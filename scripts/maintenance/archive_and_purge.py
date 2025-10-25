import argparse
import asyncio
import logging
import uuid
import json
from datetime import datetime, timedelta, timezone
from typing import List, Optional

import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects import postgresql

logger = logging.getLogger("maintenance")
logging.basicConfig(level=logging.INFO)

BATCH_SIZE = 100


async def _try_advisory_lock(session: AsyncSession, key: int) -> bool:
    res = await session.execute(sa.text("SELECT pg_try_advisory_lock(:k) AS got").bindparams(k=key))
    val = res.scalar_one_or_none()
    return bool(val)


async def _release_advisory_lock(session: AsyncSession, key: int) -> None:
    await session.execute(sa.text("SELECT pg_advisory_unlock(:k)").bindparams(k=key))


async def _move_batch_atomic(
        session: AsyncSession,
        src_table: str,
        archive_table: str,
        columns: List[str],
        cutoff_column: str,
        cutoff_dt,
        limit: int = 100,
        dry_run: bool = True,
) -> List[str]:
    """
    Move up to `limit` rows from src_table to archive_table where cutoff_column < cutoff_dt.
    Strategy: insert-then-delete (INSERT ... ON CONFLICT DO NOTHING; then DELETE rows that exist in archive).
    Returns list of moved ids (those deleted from source). In dry_run mode logs candidate count and returns [].
    """
    cols_csv = ", ".join(columns)
    insert_cols = cols_csv

    if dry_run:
        count_sql = f"SELECT count(*) FROM {src_table} WHERE {cutoff_column} < :cutoff"
        res = await session.execute(sa.text(count_sql).execution_options(_sa_skip_with_loader_criteria=True),
                                    {"cutoff": cutoff_dt})
        count = res.scalar_one()
        logger.info("DRY RUN - candidates in %s: %d", src_table, int(count))
        return []

    # 1) Insert candidates into archive (avoid UniqueViolation with ON CONFLICT DO NOTHING)
    sql_insert = f"""
    WITH candidate AS (
      SELECT id FROM {src_table}
      WHERE {cutoff_column} < :cutoff
      ORDER BY id
      LIMIT :limit
    )
    INSERT INTO {archive_table} ({insert_cols})
    SELECT {cols_csv}
    FROM {src_table} s
    WHERE s.id IN (SELECT id FROM candidate)
    ON CONFLICT (id) DO NOTHING
    RETURNING id;
    """

    res_ins = await session.execute(
        sa.text(sql_insert).execution_options(_sa_skip_with_loader_criteria=True),
        {"cutoff": cutoff_dt, "limit": limit},
    )
    inserted_ids = [str(r[0]) for r in res_ins.fetchall()]

    # 2) Collect candidate ids (up to limit) to evaluate which exist in archive (either newly inserted or pre-existing)
    res_cand = await session.execute(
        sa.text(
            f"SELECT id FROM (SELECT id FROM {src_table} WHERE {cutoff_column} < :cutoff ORDER BY id LIMIT :limit) t").execution_options(
            _sa_skip_with_loader_criteria=True),
        {"cutoff": cutoff_dt, "limit": limit},
    )
    candidates = [str(r[0]) for r in res_cand.fetchall()]

    exist_ids: List[str] = []
    if candidates:
        res_exist = await session.execute(
            sa.text(f"SELECT id FROM {archive_table} WHERE id = ANY(:ids)").execution_options(
                _sa_skip_with_loader_criteria=True),
            {"ids": candidates},
        )
        exist_ids = [str(r[0]) for r in res_exist.fetchall()]

    # 3) Delete from source only those ids that actually exist in archive
    moved_ids: List[str] = []
    if exist_ids:
        res_del = await session.execute(
            sa.text(f"DELETE FROM {src_table} WHERE id = ANY(:ids) RETURNING id").execution_options(
                _sa_skip_with_loader_criteria=True),
            {"ids": exist_ids},
        )
        moved_ids = [str(r[0]) for r in res_del.fetchall()]

    return moved_ids


async def _purge_audit_logs(session: AsyncSession, cutoff_dt, dry_run: bool = True) -> int:
    if dry_run:
        res = await session.execute(
            sa.text("SELECT count(*) FROM audit_log WHERE occurred_at < :cutoff").execution_options(
                _sa_skip_with_loader_criteria=True),
            {"cutoff": cutoff_dt},
        )
        return int(res.scalar_one())
    else:
        res = await session.execute(
            sa.text("DELETE FROM audit_log WHERE occurred_at < :cutoff RETURNING id").execution_options(
                _sa_skip_with_loader_criteria=True),
            {"cutoff": cutoff_dt},
        )
        ids = res.fetchall()
        return len(ids)


async def maintenance_job(dry_run: bool = True, batch_size: int = BATCH_SIZE, lock_key: Optional[int] = 123456789):
    # Lazy imports to avoid circular dependencies
    from src.app.db.session import AsyncSessionLocal

    # Column lists must match archive table schemas
    reservation_columns = [
        "id", "product_id", "batch_id", "location_id", "event_id", "cost_center_id",
        "quantity", "reserved_from", "reserved_until", "status", "created_at", "updated_at", "deleted_at"
    ]
    batch_columns = [
        "id", "product_id", "code", "expiration_date", "origin_type", "origin_id", "quarantined",
        "created_at", "updated_at", "deleted_at"
    ]
    movement_columns = [
        "id", "code", "movement_type_id", "product_id", "batch_id", "from_location_id", "to_location_id",
        "reason_id", "requested_by_user_id", "executed_by_user_id", "quantity", "occurred_at",
        "created_at", "updated_at", "deleted_at"
    ]

    start_ts = datetime.now(timezone.utc)
    logger.info("Starting maintenance_job dry_run=%s batch_size=%d at %s", dry_run, batch_size, start_ts.isoformat())
    totals = {"reservation": 0, "batch": 0, "movement": 0}
    errors = 0
    purged_count = 0

    async with AsyncSessionLocal() as session:  # type: AsyncSession
        # Forzar encoding de la sesión a UTF8 para evitar problemas de mezcla de codificaciones
        await session.execute(sa.text("SET client_encoding = 'UTF8'"))

        got_lock = await _try_advisory_lock(session, lock_key)
        if not got_lock:
            logger.error("Could not acquire advisory lock %s. Aborting.", lock_key)
            return

        try:
            # 1) Reservations first (dependents of batch)
            cutoff_res = datetime.now(timezone.utc) - timedelta(days=365 * 2)
            while True:
                moved_ids = await _move_batch_atomic(session, "reservation", "reservation_archive", reservation_columns,
                                                     "deleted_at", cutoff_res, limit=batch_size, dry_run=dry_run)
                if not moved_ids:
                    break
                totals["reservation"] += len(moved_ids)
                logger.info("Moved reservation ids (batch): %s", moved_ids)
                if not dry_run:
                    await session.commit()

            # 2) Movements (must run before batches to avoid FK violations)
            cutoff_mov = datetime.now(timezone.utc) - timedelta(days=365 * 3)
            while True:
                moved_ids = await _move_batch_atomic(session, "movement", "movement_archive", movement_columns,
                                                     "deleted_at", cutoff_mov, limit=batch_size, dry_run=dry_run)
                if not moved_ids:
                    break
                totals["movement"] += len(moved_ids)
                logger.info("Moved movement ids (batch): %s", moved_ids)
                if not dry_run:
                    await session.commit()

            # 3) Serials (must run before batches to avoid FK violations)
            serial_columns = [
                "id", "product_id", "batch_id", "serial_number",
                "location_id", "status", "created_at", "updated_at", "deleted_at"
            ]
            cutoff_serial = datetime.now(timezone.utc) - timedelta(days=365 * 3)

            while True:
                moved_ids = await _move_batch_atomic(
                    session, "serial", "serial_archive", serial_columns,
                    "deleted_at", cutoff_serial, limit=batch_size, dry_run=dry_run
                )
                if not moved_ids:
                    break
                totals["serial"] = totals.get("serial", 0) + len(moved_ids)
                logger.info("Moved serial ids (batch): %s", moved_ids)
                if not dry_run:
                    await session.commit()

            # 3) Batches (parents) — but verify children per-lote before deleting
            cutoff_batch = datetime.now(timezone.utc) - timedelta(days=365 * 5)
            while True:
                # collect candidate batch ids up to limit
                res_cand = await session.execute(
                    sa.text(
                        "SELECT id FROM batch WHERE deleted_at < :cutoff ORDER BY id LIMIT :limit"
                    ).execution_options(_sa_skip_with_loader_criteria=True),
                    {"cutoff": cutoff_batch, "limit": batch_size},
                )
                candidates = [str(r[0]) for r in res_cand.fetchall()]
                if not candidates:
                    break

                # check for residual children in movement referencing these batches
                res_child = await session.execute(
                    sa.text(
                        "SELECT DISTINCT batch_id FROM movement WHERE batch_id = ANY(:ids) LIMIT 1"
                    ).execution_options(_sa_skip_with_loader_criteria=True),
                    {"ids": candidates},
                )
                residual = [str(r[0]) for r in res_child.fetchall()]

                if residual:
                    logger.warning(
                        "Found residual movement children for batch ids, will attempt to move them first: %s", residual)
                    # Attempt to move movements referencing these batches (only ones older than movement cutoff)
                    # Use candidate set to limit scope
                    sql_move_specific = f"""
                    WITH candidate_mov AS (
                      SELECT id FROM movement WHERE batch_id = ANY(:ids) AND deleted_at < :cutoff_mov ORDER BY id LIMIT :limit
                    )
                    INSERT INTO movement_archive ({', '.join(movement_columns)})
                    SELECT {', '.join(movement_columns)}
                    FROM movement m
                    WHERE m.id IN (SELECT id FROM candidate_mov)
                    ON CONFLICT (id) DO NOTHING
                    RETURNING id;
                    """
                    res_move_specific = await session.execute(
                        sa.text(sql_move_specific).execution_options(_sa_skip_with_loader_criteria=True),
                        {"ids": candidates, "cutoff_mov": cutoff_mov, "limit": batch_size},
                    )
                    moved_specific = [str(r[0]) for r in res_move_specific.fetchall()]

                    if moved_specific:
                        # delete those that exist now in archive
                        res_exist = await session.execute(
                            sa.text("SELECT id FROM movement_archive WHERE id = ANY(:ids)").execution_options(
                                _sa_skip_with_loader_criteria=True),
                            {"ids": moved_specific},
                        )
                        exist_ids = [str(r[0]) for r in res_exist.fetchall()]
                        if exist_ids:
                            await session.execute(
                                sa.text("DELETE FROM movement WHERE id = ANY(:ids)").execution_options(
                                    _sa_skip_with_loader_criteria=True),
                                {"ids": exist_ids},
                            )
                            if not dry_run:
                                await session.commit()
                            logger.info("Moved and deleted movement ids referencing batches: %s", exist_ids)
                    # re-evaluate batches in next loop iteration
                    continue

                # No residual movement children (or they were cleared) — move batches normally
                moved_ids = await _move_batch_atomic(session, "batch", "batch_archive", batch_columns, "deleted_at",
                                                     cutoff_batch, limit=batch_size, dry_run=dry_run)
                if not moved_ids:
                    break
                totals["batch"] += len(moved_ids)
                logger.info("Moved batch ids (batch): %s", moved_ids)
                if not dry_run:
                    await session.commit()

            # 4) Audit logs purge
            cutoff_log = datetime.now(timezone.utc) - timedelta(days=365 * 7)
            purged_count = await _purge_audit_logs(session, cutoff_log, dry_run=dry_run)
            if not dry_run:
                await session.commit()

            # 5) Write summary to audit_log only on commit
            if not dry_run:
                run_id = str(uuid.uuid4())
                summary = {
                    "moved_reservations": totals["reservation"],
                    "moved_batches": totals["batch"],
                    "moved_movements": totals["movement"],
                    "moved_serials": totals.get("serial", 0),
                    "purged_audit_logs": purged_count,
                    "errors": errors,
                    "started_at": start_ts.isoformat(),
                    "finished_at": datetime.now(timezone.utc).isoformat(),
                }

                # Construir SQL con bindparam JSONB
                insert_sql = sa.text("""
                    INSERT INTO audit_log (
                        id, entity_name, entity_id, action, changes, performed_by_user_id, reason, occurred_at
                    ) VALUES (
                        :id, :ename, :eid, :action, :changes, :user, :reason, now()
                    )
                """).bindparams(sa.bindparam("changes", type_=postgresql.JSONB))

                params = {
                    "id": run_id,
                    "ename": "maintenance_job",
                    "eid": run_id,
                    "action": "archive_and_purge",
                    "changes": summary,  # pasamos el dict directamente
                    "user": None,
                    "reason": "scheduled archive_and_purge",
                }

                await session.execute(insert_sql.execution_options(_sa_skip_with_loader_criteria=True), params)
                await session.commit()

            logger.info("Maintenance finished: totals=%s purged_audit_logs=%d dry_run=%s", totals, purged_count,
                        dry_run)

        except Exception as exc:
            errors += 1
            await session.rollback()
            logger.exception("Error during maintenance_job: %s", exc)
        finally:
            try:
                await _release_advisory_lock(session, lock_key)
            except Exception:
                logger.warning("Failed releasing advisory lock; it may be auto-released at session end.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--commit", action="store_true", help="Persist changes (not dry-run)")
    parser.add_argument("--batch-size", type=int, default=BATCH_SIZE, help="Rows per batch")
    parser.add_argument("--lock-key", type=int, default=123456789, help="Advisory lock key (int)")
    args = parser.parse_args()

    BATCH_SIZE = args.batch_size
    asyncio.run(maintenance_job(dry_run=not args.commit, batch_size=BATCH_SIZE, lock_key=args.lock_key))
