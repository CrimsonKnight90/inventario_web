from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from src.app.db.session import get_session
from src.app.models.user_role import UserRole
from src.app.schemas.user_role import UserRoleCreate, UserRoleRead

router = APIRouter(prefix="/user_roles", tags=["user_roles"])


@router.post("/", response_model=UserRoleRead, status_code=status.HTTP_201_CREATED)
async def assign_role(payload: UserRoleCreate, session: AsyncSession = Depends(get_session)) -> UserRoleRead:
    result = await session.execute(
        select(UserRole).where(UserRole.user_id == payload.user_id, UserRole.role_id == payload.role_id)
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Role already assigned to user")

    user_role = UserRole(**payload.dict())
    session.add(user_role)
    await session.commit()
    await session.refresh(user_role)
    return user_role


@router.get("/", response_model=list[UserRoleRead])
async def list_user_roles(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(UserRole))
    return result.scalars().all()


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def unassign_role(payload: UserRoleCreate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(UserRole).where(UserRole.user_id == payload.user_id, UserRole.role_id == payload.role_id)
    )
    user_role = result.scalar_one_or_none()
    if not user_role:
        raise HTTPException(status_code=404, detail="UserRole not found")

    await session.delete(user_role)
    await session.commit()
    return
