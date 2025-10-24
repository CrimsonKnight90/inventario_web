"""add soft delete and partial indexes

Revision ID: 7b2f1c9a1234
Revises: 3f64d825a8d2
Create Date: 2025-10-23 13:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '7b2f1c9a1234'
down_revision: Union[str, None] = '3f64d825a8d2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)

    # Tablas críticas donde aplicamos soft delete
    tables = [
        "product",
        "category",
        "unit",
        "inventory",
        "batch",
        "movement",
        "reservation",
        "warehouse",
        "location",
        "user_account",   # ← corregido
        "role",
        "user_role",
    ]

    # 1. Agregar columna deleted_at solo si no existe
    for table in tables:
        cols = [c["name"] for c in inspector.get_columns(table)]
        if "deleted_at" not in cols:
            op.add_column(table, sa.Column("deleted_at", sa.TIMESTAMP(timezone=True), nullable=True))

    # 2. Crear índices parciales para registros activos
    op.execute("CREATE INDEX IF NOT EXISTS idx_product_active ON product (sku) WHERE deleted_at IS NULL;")
    op.execute("CREATE INDEX IF NOT EXISTS idx_category_active ON category (name) WHERE deleted_at IS NULL;")
    op.execute("CREATE INDEX IF NOT EXISTS idx_unit_active ON unit (code) WHERE deleted_at IS NULL;")
    op.execute("CREATE INDEX IF NOT EXISTS idx_inventory_active ON inventory (batch_id) WHERE deleted_at IS NULL;")
    op.execute("CREATE INDEX IF NOT EXISTS idx_movement_active ON movement (batch_id, created_at) WHERE deleted_at IS NULL;")
    op.execute("CREATE INDEX IF NOT EXISTS idx_reservation_active ON reservation (id) WHERE deleted_at IS NULL;")
    op.execute("CREATE INDEX IF NOT EXISTS idx_user_active ON user_account (username) WHERE deleted_at IS NULL;")


def downgrade() -> None:
    # Eliminar índices
    op.execute("DROP INDEX IF EXISTS idx_product_active;")
    op.execute("DROP INDEX IF EXISTS idx_category_active;")
    op.execute("DROP INDEX IF EXISTS idx_unit_active;")
    op.execute("DROP INDEX IF EXISTS idx_inventory_active;")
    op.execute("DROP INDEX IF EXISTS idx_movement_active;")
    op.execute("DROP INDEX IF EXISTS idx_reservation_active;")
    op.execute("DROP INDEX IF EXISTS idx_user_active;")

    # Eliminar columna deleted_at (si existe)
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = [
        "product",
        "category",
        "unit",
        "inventory",
        "batch",
        "movement",
        "reservation",
        "warehouse",
        "location",
        "user_account",   # ← consistente
        "role",
        "user_role",
    ]
    for table in tables:
        cols = [c["name"] for c in inspector.get_columns(table)]
        if "deleted_at" in cols:
            op.drop_column(table, "deleted_at")
