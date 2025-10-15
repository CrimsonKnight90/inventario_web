"""remove empresa_id from usuarios

Revision ID: 3c4163dd9806
Revises: b51a1a56eba0
Create Date: 2025-10-14 22:39:37.229411

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3c4163dd9806'
down_revision: Union[str, None] = 'b51a1a56eba0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Quitar la FK y la columna empresa_id
    op.drop_constraint("usuarios_empresa_id_fkey", "usuarios", type_="foreignkey")
    op.drop_column("usuarios", "empresa_id")

def downgrade():
    # Restaurar la columna y la FK si haces rollback
    op.add_column("usuarios", sa.Column("empresa_id", sa.Integer, nullable=False))
    op.create_foreign_key("usuarios_empresa_id_fkey", "usuarios", "empresas", ["empresa_id"], ["id"])
