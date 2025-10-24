# src/app/services/auth.py
# Servicios de autenticación y autorización: login, registro de usuarios, validación de contraseñas, roles y decodificación de tokens JWT.

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from jose import jwt, JWTError

from src.app.core.security import verify_password, hash_password, settings
from src.app.models.user import User
from src.app.models.role import Role
from src.app.models.user_role import UserRole


async def authenticate_user(session: AsyncSession, username: str, password: str) -> Optional[User]:
    """Authenticate a user by username and password."""
    result = await session.execute(
        select(User).where(User.username == username, User.active.is_(True))
    )
    user: Optional[User] = result.scalar_one_or_none()
    if not user or not user.password_hash:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


async def get_user_roles(session: AsyncSession, user_id) -> List[str]:
    """Fetch role codes for a user."""
    stmt = (
        select(Role.code)
        .join(UserRole, Role.id == UserRole.role_id)
        .where(UserRole.user_id == user_id)
    )
    result = await session.execute(stmt)
    return [r[0] for r in result.all()]


def decode_token(token: str) -> dict:
    """Decode JWT without DB."""
    try:
        return jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm],
        )
    except JWTError as e:
        raise ValueError(f"Invalid token: {e}")


async def signup_user(
    session: AsyncSession,
    username: str,
    email: str,
    password: str,
    active: bool = True,
) -> User:
    """Create a new user (basic)."""
    existing = await session.execute(
        select(User).where((User.username == username) | (User.email == email))
    )
    if existing.scalar_one_or_none():
        raise ValueError("User already exists")

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password),
        active=active,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
