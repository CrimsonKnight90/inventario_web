"""
Seed script to insert initial demo data: users, products, batches.
Run with: `python scripts/seed_initial_data.py`
"""

import asyncio
import uuid
from datetime import date, timedelta

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/inventory_db"

engine = create_async_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def seed():
    async with SessionLocal() as session:
        # Create demo user (admin)
        await session.execute(
            text(
                """
                INSERT INTO user_account (id, username, email, password_hash, active, created_at, updated_at)
                VALUES (:id, :username, :email, :password_hash, true, now(), now())
                ON CONFLICT (username) DO NOTHING
                """
            ),
            {
                "id": str(uuid.uuid4()),
                "username": "admin",
                "email": "admin@example.com",
                "password_hash": "$2b$12$examplehash",  # bcrypt hash placeholder
            },
        )

        # Create demo category and unit
        category_id = str(uuid.uuid4())
        unit_id = str(uuid.uuid4())
        await session.execute(
            text(
                """
                INSERT INTO category (id, name, created_at, updated_at)
                VALUES (:id, 'Food', now(), now())
                ON CONFLICT (name) DO NOTHING
                """
            ),
            {"id": category_id},
        )
        await session.execute(
            text(
                """
                INSERT INTO unit (id, code, description, created_at, updated_at)
                VALUES (:id, 'kg', 'Kilogram', now(), now())
                ON CONFLICT (code) DO NOTHING
                """
            ),
            {"id": unit_id},
        )

        # Create demo product
        product_id = str(uuid.uuid4())
        await session.execute(
            text(
                """
                INSERT INTO product (id, name, sku, category_id, unit_id, is_serialized, is_perishable, created_at, updated_at)
                VALUES (:id, 'Rice 1kg', 'SKU-RICE-001', :category_id, :unit_id, false, true, now(), now())
                ON CONFLICT (sku) DO NOTHING
                """
            ),
            {"id": product_id, "category_id": category_id, "unit_id": unit_id},
        )

        # Create demo batch
        batch_id = str(uuid.uuid4())
        await session.execute(
            text(
                """
                INSERT INTO batch (id, product_id, code, expiration_date, origin_type, created_at, updated_at)
                VALUES (:id, :product_id, 'BATCH-001', :expiration_date, 'supplier', now(), now())
                ON CONFLICT (code) DO NOTHING
                """
            ),
            {"id": batch_id, "product_id": product_id, "expiration_date": date.today() + timedelta(days=365)},
        )

        await session.commit()
        print("✅ Seed data inserted successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
