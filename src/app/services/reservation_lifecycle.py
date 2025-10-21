from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from uuid import UUID
import uuid

from src.app.models.reservation import Reservation
from src.app.models.movement import Movement, MovementType, MovementReason
from src.app.services.inventory_updater import apply_movement
from src.app.services.audit_logger import log_audit


async def release_reservation(session: AsyncSession, reservation_id: UUID) -> None:
    """Set reservation status to released if active."""
    await session.execute(
        Reservation.__table__.update()
        .where(Reservation.id == reservation_id, Reservation.status == "active")
        .values(status="released", updated_at=datetime.now(timezone.utc))
    )


async def fulfill_reservation(session: AsyncSession, reservation_id: UUID) -> None:
    """Set reservation status to fulfilled if active."""
    await session.execute(
        Reservation.__table__.update()
        .where(Reservation.id == reservation_id, Reservation.status == "active")
        .values(status="fulfilled", updated_at=datetime.now(timezone.utc))
    )


async def expire_reservations(session: AsyncSession) -> int:
    """Expire reservations whose reserved_until already passed. Returns number expired."""
    now = datetime.now(timezone.utc)
    result = await session.execute(
        Reservation.__table__.update()
        .where(
            Reservation.status == "active",
            Reservation.reserved_until.isnot(None),
            Reservation.reserved_until < now,
        )
        .values(status="expired", updated_at=now)
        .returning(Reservation.id)
    )
    expired = result.fetchall()
    return len(expired)


async def fulfill_reservation_with_movement(
    session: AsyncSession,
    reservation_id: UUID,
    executed_by_user_id: UUID | None = None,
) -> Movement:
    """
    Fulfil a reservation and create an outbound movement, performing all DB changes atomically.
    - Looks up movement_type 'outbound' and movement_reason 'reservation_fulfillment' (with safe fallbacks).
    - Wraps movement creation, inventory update and reservation update in a single transaction.
    - Records audit entries inside the same transaction.
    """
    # Load reservation
    res = await session.get(Reservation, reservation_id)
    if not res or res.status != "active":
        raise ValueError("Reservation not found or not active")

    # Resolve movement type (must exist)
    mt_stmt = select(MovementType).where(MovementType.code == "outbound")
    movement_type = (await session.execute(mt_stmt)).scalar_one_or_none()
    if movement_type is None:
        raise ValueError("movement_type 'outbound' not found in catalog")

    # Resolve movement reason, prefer 'reservation_fulfillment', fallback to any reason
    mr_stmt = select(MovementReason).where(MovementReason.code == "reservation_fulfillment")
    movement_reason = (await session.execute(mr_stmt)).scalar_one_or_none()
    if movement_reason is None:
        movement_reason = (await session.execute(select(MovementReason).limit(1))).scalar_one_or_none()
        if movement_reason is None:
            raise ValueError("No movement_reason found in catalog; run seed script")

    async with session.begin():
        movement = Movement(
            id=uuid.uuid4(),
            code=f"RES-{reservation_id.hex[:8]}",
            movement_type_id=movement_type.id,
            product_id=res.product_id,
            batch_id=res.batch_id,
            from_location_id=res.location_id,
            to_location_id=None,
            reason_id=movement_reason.id,
            requested_by_user_id=None,
            executed_by_user_id=executed_by_user_id,
            quantity=res.quantity,
        )
        session.add(movement)
        await session.flush()

        # Apply inventory out (apply_movement records inventory audit)
        await apply_movement(
            session=session,
            product_id=res.product_id,
            batch_id=res.batch_id,
            location_id=res.location_id,
            quantity=res.quantity,
            direction="out",
        )

        # Update reservation
        res.status = "fulfilled"
        res.updated_at = datetime.now(timezone.utc)
        await session.flush()

        # Audit reservation fulfilment
        await log_audit(
            session=session,
            entity_type="reservation",
            entity_id=res.id,
            action="fulfilled",
            changes={"quantity": str(res.quantity)},
            user_id=executed_by_user_id,
        )

    return movement
