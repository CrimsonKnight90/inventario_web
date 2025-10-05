# ============================================================
# Archivo: alembic/versions/20251005_ajustes_productos_categorias.py
# Descripción: Migración Alembic para añadir stock y empresa_id a productos,
#              y empresa_id a categorías.
# Autor: CrimsonKnight90
# ============================================================

from alembic import op
import sqlalchemy as sa

# Identificadores de la migración
revision: str = "20251005_ajustes_productos_categorias"
down_revision: str = "d96e73b6a483"  # tu migración inicial
branch_labels = None
depends_on = None

def upgrade() -> None:
    """Aplicar cambios en la base de datos."""
    # 🔹 Productos: añadir stock y empresa_id
    op.add_column("productos", sa.Column("stock", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("productos", sa.Column("empresa_id", sa.Integer(), sa.ForeignKey("empresas.id")))

    # 🔹 Categorías: añadir empresa_id
    op.add_column("categorias", sa.Column("empresa_id", sa.Integer(), sa.ForeignKey("empresas.id")))

def downgrade() -> None:
    """Revertir cambios en la base de datos."""
    op.drop_column("productos", "stock")
    op.drop_column("productos", "empresa_id")
    op.drop_column("categorias", "empresa_id")
