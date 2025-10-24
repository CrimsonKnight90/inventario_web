from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from datetime import datetime, timezone
from passlib.hash import bcrypt

from src.app.db.session import get_session
from src.app.models.user import User
from src.app.schemas.user import UserCreate, UserRead, UserUpdate
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(payload: UserCreate, session: AsyncSession = Depends(get_session)) -> UserRead:
    # Verificar duplicados
    result = await session.execute(select(User).where((User.username == payload.username) | (User.email == payload.email)))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    user = User(
        username=payload.username,
        email=payload.email,
        password_hash=bcrypt.hash(payload.password),
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@router.get("/", response_model=list[UserRead])
async def list_users(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User))
    return result.scalars().all()


@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/{user_id}", response_model=UserRead)
async def update_user(user_id: UUID, payload: UserUpdate, session: AsyncSession = Depends(get_session)) -> UserRead:
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.username:
        user.username = payload.username
    if payload.email:
        user.email = payload.email
    if payload.password:
        user.password_hash = bcrypt.hash(payload.password)
    if payload.active is not None:
        user.active = payload.active

    user.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: UUID, session: AsyncSession = Depends(get_session)):
    stmt = (
        update(User)
        .where(User.id == user_id, User.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="User not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="user",
        entity_id=user_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
