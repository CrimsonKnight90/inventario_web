# scripts/seed_admin.py
# Uso: desde la raíz del proyecto que contiene src/, ejecutar:
#   python -m scripts.seed_admin
# o ajustar PYTHONPATH para que importe src.app.*

import asyncio
import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

# Ajusta la URL de la DB según tu configuración (lee de env si usas)
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/inventario"

# Importar utilidades del proyecto
from src.app.core.security import hash_password  # usa la función real del backend
from src.app.models.user import User
from src.app.models.role import Role
from src.app.models.user_role import UserRole

# UUIDs fijos para reproducibilidad
ROLE_ADMIN_ID = uuid.uuid4()
USER_ADMIN_ID = uuid.uuid4()

ADMIN_USERNAME = "admin"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "Pass123!"  # cambia por la contraseña que prefieras en entorno real


async def run():
    engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)

    async with AsyncSessionLocal() as session:  # type: AsyncSession
        # 1) Crear rol admin si no existe
        res = await session.execute(select(Role).where(Role.code == "admin"))
        role = res.scalar_one_or_none()
        if not role:
            role = Role(code="admin", description="Administrador del sistema")
            session.add(role)
            await session.commit()
            await session.refresh(role)
            print("Rol 'admin' creado")

        # 2) Crear usuario admin si no existe
        res = await session.execute(select(User).where(User.email == ADMIN_EMAIL))
        user = res.scalar_one_or_none()
        if not user:
            pwd_hash = hash_password(ADMIN_PASSWORD)
            user = User(
                username=ADMIN_USERNAME,
                email=ADMIN_EMAIL,
                password_hash=pwd_hash,
                active=True,
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
            print(f"Usuario '{ADMIN_EMAIL}' creado")

        # 3) Asignar rol admin si no está asignado
        res = await session.execute(
            select(UserRole).where(UserRole.user_id == user.id, UserRole.role_id == role.id)
        )
        ur = res.scalar_one_or_none()
        if not ur:
            ur = UserRole(user_id=user.id, role_id=role.id)
            session.add(ur)
            await session.commit()
            print("Asignado role 'admin' al usuario")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(run())
