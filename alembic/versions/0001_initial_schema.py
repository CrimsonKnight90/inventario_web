"""Initial schema for enterprise inventory system

Revision ID: 0001_initial_schema
Revises:
Create Date: 2025-10-20 13:15:00.000000

"""
from alembic import op
import sqlalchemy as sa
import sqlalchemy.dialects.postgresql as pg

# revision identifiers, used by Alembic.
revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Common types
    op.create_table(
        "category",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.Text, nullable=False, unique=True),
        sa.Column("parent_id", pg.UUID(as_uuid=True), sa.ForeignKey("category.id")),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True)),
    )

    op.create_table(
        "unit",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("code", sa.Text, nullable=False, unique=True),
        sa.Column("description", sa.Text),
        sa.Column("precision", sa.Numeric),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True)),
    )

    op.create_table(
        "product",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.Text, nullable=False),
        sa.Column("sku", sa.Text, nullable=False, unique=True),
        sa.Column("category_id", pg.UUID(as_uuid=True), sa.ForeignKey("category.id")),
        sa.Column("unit_id", pg.UUID(as_uuid=True), sa.ForeignKey("unit.id")),
        sa.Column("is_serialized", sa.Boolean, default=False),
        sa.Column("is_perishable", sa.Boolean, default=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True)),
    )

    op.create_table(
        "party",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("type", sa.Text, nullable=False),  # supplier|donor
        sa.Column("name", sa.Text, nullable=False),
        sa.Column("tax_id", sa.Text),
        sa.Column("contact", sa.Text),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True)),
    )

    op.create_table(
        "batch",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("product_id", pg.UUID(as_uuid=True), sa.ForeignKey("product.id"), nullable=False),
        sa.Column("code", sa.Text, nullable=False),
        sa.Column("expiration_date", sa.Date),
        sa.Column("origin_type", sa.Text, nullable=False),
        sa.Column("origin_id", pg.UUID(as_uuid=True), sa.ForeignKey("party.id")),
        sa.Column("quarantined", sa.Boolean, default=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True)),
    )

    op.create_table(
        "warehouse",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("code", sa.Text, nullable=False, unique=True),
        sa.Column("name", sa.Text, nullable=False),
        sa.Column("address", sa.Text),
        sa.Column("is_cold_chain", sa.Boolean, default=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True)),
    )

    op.create_table(
        "location",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("warehouse_id", pg.UUID(as_uuid=True), sa.ForeignKey("warehouse.id"), nullable=False),
        sa.Column("code", sa.Text, nullable=False),
        sa.Column("type", sa.Text, nullable=False),
        sa.Column("path", sa.Text),
        sa.Column("active", sa.Boolean, default=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True)),
    )

    op.create_table(
        "inventory",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("product_id", pg.UUID(as_uuid=True), sa.ForeignKey("product.id"), nullable=False),
        sa.Column("batch_id", pg.UUID(as_uuid=True), sa.ForeignKey("batch.id"), nullable=False),
        sa.Column("location_id", pg.UUID(as_uuid=True), sa.ForeignKey("location.id"), nullable=False),
        sa.Column("quantity", sa.Numeric, nullable=False),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True)),
        sa.UniqueConstraint("product_id", "batch_id", "location_id", name="uq_inventory_triplet"),
    )

    op.create_index("ix_inventory_lookup", "inventory", ["product_id", "batch_id", "location_id"])

    op.create_table(
        "user_account",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("username", sa.Text, nullable=False, unique=True),
        sa.Column("email", sa.Text, nullable=False, unique=True),
        sa.Column("password_hash", sa.Text, nullable=False),
        sa.Column("active", sa.Boolean, default=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True)),
    )

    op.create_table(
        "role",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("code", sa.Text, nullable=False, unique=True),
        sa.Column("description", sa.Text),
    )

    op.create_table(
        "user_role",
        sa.Column("user_id", pg.UUID(as_uuid=True), sa.ForeignKey("user_account.id"), primary_key=True),
        sa.Column("role_id", pg.UUID(as_uuid=True), sa.ForeignKey("role.id"), primary_key=True),
        sa.Column("assigned_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "audit_log",
        sa.Column("id", pg.UUID(as_uuid=True), primary_key=True),
        sa.Column("entity_name", sa.Text, nullable=False),
        sa.Column("entity_id", pg.UUID(as_uuid=True), nullable=False),
        sa.Column("action", sa.Text, nullable=False),
        sa.Column("changes", pg.JSONB),
        sa.Column("performed_by_user_id", pg.UUID(as_uuid=True), sa.ForeignKey("user_account.id")),
        sa.Column("reason", sa.Text),
        sa.Column("occurred_at", sa.TIMESTAMP(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("audit_log")
    op.drop_table("user_role")
    op.drop_table("role")
    op.drop_table("user_account")
    op.drop_index("ix_inventory_lookup", table_name="inventory")
    op.drop_table("inventory")
    op.drop_table("location")
    op.drop_table("warehouse")
    op.drop_table("batch")
    op.drop_table("party")
    op.drop_table("product")
    op.drop_table("unit")
    op.drop_table("category")
