from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.category import Category
from src.app.schemas.category import CategoryCreate, CategoryRead
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("/", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    session: AsyncSession = Depends(get_session),
):
    # Verificar si ya existe
    result = await session.execute(select(Category).where(Category.name == payload.name))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")

    category = Category(name=payload.name, parent_id=payload.parent_id)
    session.add(category)
    await session.commit()
    await session.refresh(category)
    return category


@router.get("/", response_model=list[CategoryRead])
async def list_categories(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Category))
    return result.scalars().all()


@router.get("/{category_id}", response_model=CategoryRead)
async def get_category(category_id: UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=CategoryRead)
async def update_category(
    category_id: UUID,
    payload: CategoryCreate,
    session: AsyncSession = Depends(get_session),
) -> CategoryRead:
    """Update an existing category."""
    result = await session.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category.name = payload.name
    category.parent_id = payload.parent_id
    category.updated_at = datetime.now(timezone.utc)

    await session.commit()
    await session.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: UUID, session: AsyncSession = Depends(get_session)):
    """Soft delete a category by setting deleted_at."""
    stmt = (
        update(Category)
        .where(Category.id == category_id, Category.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Category not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="category",
        entity_id=category_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
