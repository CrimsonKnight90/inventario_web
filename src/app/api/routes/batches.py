from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.batch import Batch
from src.app.schemas.batch import BatchCreate, BatchRead
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/batches", tags=["batches"])


@router.post("/", response_model=BatchRead, status_code=status.HTTP_201_CREATED)
async def create_batch(
    payload: BatchCreate, session: AsyncSession = Depends(get_session)
) -> BatchRead:
    # Verificar si ya existe un código igual para el mismo producto
    result = await session.execute(
        select(Batch).where(Batch.code == payload.code, Batch.product_id == payload.product_id)
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Batch code already exists for this product")

    batch = Batch(**payload.dict())
    session.add(batch)
    await session.commit()
    await session.refresh(batch)
    return batch


@router.get("/", response_model=list[BatchRead])
async def list_batches(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Batch))
    return result.scalars().all()


@router.get("/{batch_id}", response_model=BatchRead)
async def get_batch(batch_id: UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Batch).where(Batch.id == batch_id))
    batch = result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch


@router.put("/{batch_id}", response_model=BatchRead)
async def update_batch(
    batch_id: UUID,
    payload: BatchCreate,
    session: AsyncSession = Depends(get_session),
) -> BatchRead:
    result = await session.execute(select(Batch).where(Batch.id == batch_id))
    batch = result.scalar_one_or_none()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    for field, value in payload.dict().items():
        setattr(batch, field, value)

    batch.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(batch)
    return batch


@router.delete("/{batch_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_batch(batch_id: UUID, session: AsyncSession = Depends(get_session)):
    stmt = (
        update(Batch)
        .where(Batch.id == batch_id, Batch.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Batch not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="batch",
        entity_id=batch_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
