"""seed initial data

Revision ID: 3f64d825a8d2
Revises: acc76c676b14
Create Date: 2025-10-22 01:47:49.275417

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3f64d825a8d2'
down_revision: Union[str, None] = 'acc76c676b14'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.execute("INSERT INTO role (id, code, description) VALUES (gen_random_uuid(), 'admin', 'Administrador')")
    op.execute("INSERT INTO movement_type (id, code, description) VALUES (gen_random_uuid(), 'inbound', 'Entrada')")
    op.execute("INSERT INTO movement_reason (id, code, description, requires_approval) VALUES (gen_random_uuid(), 'purchase', 'Compra', false)")



def downgrade() -> None:
    pass
