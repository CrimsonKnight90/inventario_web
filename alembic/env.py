# alembic/env.py
import asyncio
# Forzar selector en Windows para evitar errores IOCP/WinError64 con asyncpg
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from logging.config import fileConfig
import os
import sys

from alembic import context
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine

# Ensure src is on sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "src"))

from src.app.models import base  # import Base metadata
from src.app.core.settings import settings  # opcional, si lo usas

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = base.Base.metadata

def get_url() -> str:
    return os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:postgres@localhost:5432/inventario"
    )

def run_migrations_offline() -> None:
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    connectable = create_async_engine(get_url(), poolclass=pool.NullPool, future=True)
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
