"""add serial_archive

Revision ID: fcc870f63c8b
Revises: 9c8a7b123456
Create Date: 2025-10-25 01:01:15.457826

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fcc870f63c8b'
down_revision: Union[str, None] = '9c8a7b123456'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'serial_archive',
        sa.Column('product_id', sa.UUID(), nullable=False),
        sa.Column('batch_id', sa.UUID(), nullable=True),
        sa.Column('serial_number', sa.Text(), nullable=False),
        sa.Column('location_id', sa.UUID(), nullable=True),
        sa.Column('status', sa.Text(), nullable=True),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('serial_number')
    )
    op.create_index('idx_serial_archive_batch_id', 'serial_archive', ['batch_id'])
    op.create_index('idx_serial_archive_product_id', 'serial_archive', ['product_id'])

def downgrade() -> None:
    op.drop_index('idx_serial_archive_batch_id', table_name='serial_archive')
    op.drop_index('idx_serial_archive_product_id', table_name='serial_archive')
    op.drop_table('serial_archive')

