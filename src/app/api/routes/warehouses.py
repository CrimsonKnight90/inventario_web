from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.warehouse import Warehouse
from src.app.schemas.warehouse import WarehouseCreate, WarehouseRead
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/warehouses", tags=["warehouses"])


@router.post("/", response_model=WarehouseRead, status_code=status.HTTP_201_CREATED)
async def create_warehouse(
    payload: WarehouseCreate, session: AsyncSession = Depends(get_session)
) -> WarehouseRead:
    # Verificar si ya existe un código igual
    result = await session.execute(select(Warehouse).where(Warehouse.code == payload.code))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Warehouse code already exists")

    warehouse = Warehouse(**payload.dict())
    session.add(warehouse)
    await session.commit()
    await session.refresh(warehouse)
    return warehouse


@router.get("/", response_model=list[WarehouseRead])
async def list_warehouses(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Warehouse))
    return result.scalars().all()


@router.get("/{warehouse_id}", response_model=WarehouseRead)
async def get_warehouse(warehouse_id: UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Warehouse).where(Warehouse.id == warehouse_id))
    warehouse = result.scalar_one_or_none()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")
    return warehouse


@router.put("/{warehouse_id}", response_model=WarehouseRead)
async def update_warehouse(
    warehouse_id: UUID,
    payload: WarehouseCreate,
    session: AsyncSession = Depends(get_session),
) -> WarehouseRead:
    result = await session.execute(select(Warehouse).where(Warehouse.id == warehouse_id))
    warehouse = result.scalar_one_or_none()
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    for field, value in payload.dict().items():
        setattr(warehouse, field, value)

    warehouse.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(warehouse)
    return warehouse


@router.delete("/{warehouse_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_warehouse(warehouse_id: UUID, session: AsyncSession = Depends(get_session)):
    stmt = (
        update(Warehouse)
        .where(Warehouse.id == warehouse_id, Warehouse.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Warehouse not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="warehouse",
        entity_id=warehouse_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
