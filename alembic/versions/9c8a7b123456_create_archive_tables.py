"""create archive tables for movement, reservation, batch, serial

Revision ID: 9c8a7b123456
Revises: 7b2f1c9a1234
Create Date: 2025-10-23 14:00:00.000000
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision: str = '9c8a7b123456'
down_revision: Union[str, None] = '7b2f1c9a1234'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Movement archive
    op.create_table(
        'movement_archive',
        sa.Column('code', sa.Text(), nullable=False),
        sa.Column('movement_type_id', sa.UUID(), nullable=False),
        sa.Column('product_id', sa.UUID(), nullable=False),
        sa.Column('batch_id', sa.UUID(), nullable=False),
        sa.Column('from_location_id', sa.UUID(), nullable=True),
        sa.Column('to_location_id', sa.UUID(), nullable=True),
        sa.Column('reason_id', sa.UUID(), nullable=False),
        sa.Column('requested_by_user_id', sa.UUID(), nullable=True),
        sa.Column('executed_by_user_id', sa.UUID(), nullable=True),
        sa.Column('quantity', sa.Numeric(), nullable=False),
        sa.Column('occurred_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('deleted_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('code')
    )

    # Reservation archive
    op.create_table(
        'reservation_archive',
        sa.Column('product_id', sa.UUID(), nullable=False),
        sa.Column('batch_id', sa.UUID(), nullable=False),
        sa.Column('location_id', sa.UUID(), nullable=False),
        sa.Column('event_id', sa.UUID(), nullable=True),
        sa.Column('cost_center_id', sa.UUID(), nullable=True),
        sa.Column('quantity', sa.Numeric(), nullable=False),
        sa.Column('reserved_from', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('reserved_until', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('status', sa.Text(), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('deleted_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Batch archive
    op.create_table(
        'batch_archive',
        sa.Column('product_id', sa.UUID(), nullable=False),
        sa.Column('code', sa.Text(), nullable=False),
        sa.Column('expiration_date', sa.Date(), nullable=True),
        sa.Column('origin_type', sa.Text(), nullable=False),
        sa.Column('origin_id', sa.UUID(), nullable=True),
        sa.Column('quarantined', sa.Boolean(), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.Column('deleted_at', sa.TIMESTAMP(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Serial archive (alineada con la tabla serial original, pero sin FKs)
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


def downgrade() -> None:
    op.drop_table('movement_archive')
    op.drop_table('reservation_archive')
    op.drop_table('batch_archive')
    op.drop_table('serial_archive')
