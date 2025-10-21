"""unify user table and audit_log columns defensively

Revision ID: 0003_unify_user_and_audit
Revises: 0002_seed_initial_data
Create Date: 2025-10-21 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "0003_unify_user_and_audit"
down_revision = "0002_seed_initial_data"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    # 1) Ensure canonical user table 'user_account' exists; if 'app_user' exists, rename it.
    if "user_account" not in tables:
        if "app_user" in tables:
            op.execute("ALTER TABLE app_user RENAME TO user_account")
        else:
            op.create_table(
                "user_account",
                sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
                sa.Column("username", sa.Text(), nullable=False, unique=True),
                sa.Column("email", sa.Text(), nullable=False, unique=True),
                sa.Column("password_hash", sa.Text(), nullable=True),
                sa.Column("active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
                sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False),
                sa.Column("updated_at", sa.TIMESTAMP(timezone=True), nullable=True),
            )

    # 2) Normalize audit_log columns: add performed_by_user_id and occurred_at if missing and migrate from legacy names.
    if "audit_log" in tables:
        cols = {c["name"] for c in inspector.get_columns("audit_log")}

        if "performed_by_user_id" not in cols:
            op.add_column("audit_log", sa.Column("performed_by_user_id", postgresql.UUID(as_uuid=True), nullable=True))
            if "user_id" in cols:
                op.execute("UPDATE audit_log SET performed_by_user_id = user_id WHERE user_id IS NOT NULL")

        if "occurred_at" not in cols:
            op.add_column("audit_log", sa.Column("occurred_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False))
            if "timestamp" in cols:
                op.execute("UPDATE audit_log SET occurred_at = timestamp WHERE timestamp IS NOT NULL")

        # Ensure FK to user_account exists (drop legacy FK if needed)
        fks = inspector.get_foreign_keys("audit_log")
        for fk in fks:
            referred = fk.get("referred_table")
            if referred and referred not in ("user_account",):
                try:
                    op.drop_constraint(fk["name"], "audit_log", type_="foreignkey")
                except Exception:
                    pass

        # Create FK to user_account if not present
        try:
            op.create_foreign_key(
                "fk_audit_log_performed_by_user_account",
                "audit_log",
                "user_account",
                ["performed_by_user_id"],
                ["id"],
                ondelete="SET NULL",
            )
        except Exception:
            # ignore if already exists
            pass


def downgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    if "audit_log" in tables:
        cols = {c["name"] for c in inspector.get_columns("audit_log")}
        # drop FK if present
        try:
            op.drop_constraint("fk_audit_log_performed_by_user_account", "audit_log", type_="foreignkey")
        except Exception:
            pass
        if "performed_by_user_id" in cols:
            try:
                op.drop_column("audit_log", "performed_by_user_id")
            except Exception:
                pass
        if "occurred_at" in cols:
            try:
                op.drop_column("audit_log", "occurred_at")
            except Exception:
                pass

    # Do not attempt to rename back user_account -> app_user automatically to avoid data loss.
