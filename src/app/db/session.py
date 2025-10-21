# src/app/db/session.py
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

# URL para SQLAlchemy async (dialecto asyncpg). En producción, léelo de entorno.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:postgres@127.0.0.1:5432/inventario",
)

# Motor async
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
)

# Factory de sesiones async
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Dependencia para FastAPI (inyecta sesión por request)
async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

# Para tests (permite override en dependencia)
override_get_session = get_session
