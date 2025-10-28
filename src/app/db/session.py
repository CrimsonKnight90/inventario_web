# src/app/db/session.py
import os
import sqlalchemy as sa
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import with_loader_criteria, Session
from sqlalchemy import event
from sqlalchemy.orm import ORMExecuteState

from src.app.models.base import SoftDeletable  # mixin / marker

# ----------------------------------------------------------------------
# Database URL: se toma de variable de entorno DATABASE_URL o se usa un
# valor por defecto seguro para desarrollo local.
# ----------------------------------------------------------------------
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@127.0.0.1:5432/inventario",
)

# ----------------------------------------------------------------------
# Engine asíncrono con asyncpg. echo=False para no saturar logs en prod.
# ----------------------------------------------------------------------
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
)

# ----------------------------------------------------------------------
# Session factory asíncrona. expire_on_commit=False para mantener objetos
# vivos tras commit (útil en APIs).
# ----------------------------------------------------------------------
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# ----------------------------------------------------------------------
# Filtro global de soft-delete: aplica a todas las consultas ORM SELECT.
# Si la entidad hereda de SoftDeletable, se añade deleted_at IS NULL.
# ----------------------------------------------------------------------
@event.listens_for(Session, "do_orm_execute")
def _add_filter_deleted_at(execute_state: ORMExecuteState):
    # Solo aplica a SELECTs
    if not execute_state.is_select:
        return

    # Permitir omitir el filtro global con execution_options
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

# ----------------------------------------------------------------------
# Dependency para FastAPI: obtiene una sesión asíncrona.
# ----------------------------------------------------------------------
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

# Alias para sobreescribir en tests
override_get_session = get_session

# ----------------------------------------------------------------------
# Shutdown hook: cierra el engine (ej. en eventos de shutdown de FastAPI).
# ----------------------------------------------------------------------
async def shutdown_engine() -> None:
    await engine.dispose()
