"""Seed initial data for movement types, reasons, and roles

Revision ID: 0002_seed_initial_data
Revises: 0001_initial_schema
Create Date: 2025-10-20 13:25:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "0002_seed_initial_data"
down_revision = "0001_initial_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Insert movement types
    op.execute(
        sa.text(
            """
            INSERT INTO movement_type (id, code, description)
            VALUES
              (gen_random_uuid(), 'inbound', 'Inbound movement'),
              (gen_random_uuid(), 'outbound', 'Outbound movement'),
              (gen_random_uuid(), 'transfer', 'Transfer between locations'),
              (gen_random_uuid(), 'adjustment', 'Inventory adjustment')
            """
        )
    )

    # Insert movement reasons
    op.execute(
        sa.text(
            """
            INSERT INTO movement_reason (id, code, description, requires_approval)
            VALUES
              (gen_random_uuid(), 'purchase', 'Purchase from supplier', false),
              (gen_random_uuid(), 'donation', 'Donation received', false),
              (gen_random_uuid(), 'kitchen', 'Consumption by kitchen', false),
              (gen_random_uuid(), 'events', 'Consumption for events', false),
              (gen_random_uuid(), 'hr', 'Consumption by HR', false),
              (gen_random_uuid(), 'office', 'Office supplies usage', false),
              (gen_random_uuid(), 'it', 'IT equipment usage', true),
              (gen_random_uuid(), 'cleaning', 'Cleaning supplies usage', false),
              (gen_random_uuid(), 'external_donation', 'Donation to external community', true),
              (gen_random_uuid(), 'adjustment', 'Inventory adjustment', true)
            """
        )
    )

    # Insert roles
    op.execute(
        sa.text(
            """
            INSERT INTO role (id, code, description)
            VALUES
              (gen_random_uuid(), 'admin', 'System administrator'),
              (gen_random_uuid(), 'warehouse', 'Warehouse operator'),
              (gen_random_uuid(), 'purchasing', 'Purchasing staff'),
              (gen_random_uuid(), 'kitchen', 'Kitchen staff'),
              (gen_random_uuid(), 'hr', 'Human resources staff'),
              (gen_random_uuid(), 'auditor', 'Auditor with read-only access')
            """
        )
    )


def downgrade() -> None:
    op.execute("DELETE FROM role")
    op.execute("DELETE FROM movement_reason")
    op.execute("DELETE FROM movement_type")
