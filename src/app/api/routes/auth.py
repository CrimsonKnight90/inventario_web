from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from src.app.core.security import (
    create_access_token,
    decode_token,
    verify_password,
)
from src.app.models.user import User
from src.app.schemas.auth import TokenResponse
from src.app.schemas.user import UserRead
from src.app.db.session import get_session


router = APIRouter(prefix="/auth", tags=["auth"])


async def get_user_by_identifier(session: AsyncSession, identifier: str) -> Optional[User]:
    """Busca usuario por email o username."""
    if "@" in identifier:
        stmt = select(User).where(User.email == identifier)
    else:
        stmt = select(User).where(User.username == identifier)
    res = await session.execute(stmt)
    return res.scalar_one_or_none()


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
) -> TokenResponse:
    """
    Autenticación vía OAuth2PasswordRequestForm (x-www-form-urlencoded).
    Devuelve un JWT firmado y el perfil del usuario.
    """
    user = await get_user_by_identifier(session, form_data.username)
    if not user or not user.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Firmar token con email como sub
    token = create_access_token(user.email)
    # En Pydantic v1 se usa from_orm
    user_read = UserRead.from_orm(user)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=None,
        refresh_token=None,
        user=user_read,
    )


async def get_current_user(
    session: AsyncSession = Depends(get_session),
    authorization: str = Header(None, alias="Authorization"),
) -> User:
    """
    Dependencia para rutas protegidas.
    - Extrae el token del header Authorization.
    - Decodifica y valida el JWT.
    - Carga el usuario desde DB.
    """
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    scheme, _, param = authorization.partition(" ")
    if scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth scheme")

    try:
        payload = decode_token(param)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = await get_user_by_identifier(session, sub)
    if not user or not user.active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    return user


@router.get("/me", response_model=UserRead)
async def me(current_user: User = Depends(get_current_user)) -> UserRead:
    """Devuelve el perfil del usuario autenticado."""
    return UserRead.from_orm(current_user)
