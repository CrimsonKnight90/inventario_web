import os
import sqlalchemy as sa
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import with_loader_criteria, Session
from sqlalchemy import event
from sqlalchemy.orm import ORMExecuteState

from src.app.models.base import SoftDeletable  # mixin / marker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@127.0.0.1:5432/inventario",
)

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

@event.listens_for(Session, "do_orm_execute")
def _add_filter_deleted_at(execute_state: ORMExecuteState):
    # Only apply to ORM SELECTs
    if not execute_state.is_select:
        return

    # Allow callers to skip the global filter (scripts, special queries)
    if execute_state.execution_options.get("_sa_skip_with_loader_criteria"):
        return

    def _deleted_filter(cls):
        col = getattr(cls, "deleted_at", None)
        if col is None:
            return sa.true()
        return col.is_(None)

    execute_state.statement = execute_state.statement.options(
        with_loader_criteria(
            SoftDeletable,
            _deleted_filter,
            include_aliases=True,
        )
    )

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

override_get_session = get_session

async def shutdown_engine() -> None:
    await engine.dispose()
