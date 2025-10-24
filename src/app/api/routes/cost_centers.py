from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.cost_center import CostCenter
from src.app.schemas.cost_center import CostCenterCreate, CostCenterRead
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/cost_centers", tags=["cost_centers"])


@router.post("/", response_model=CostCenterRead, status_code=status.HTTP_201_CREATED)
async def create_cost_center(
    payload: CostCenterCreate, session: AsyncSession = Depends(get_session)
) -> CostCenterRead:
    # Verificar si ya existe un código igual
    result = await session.execute(select(CostCenter).where(CostCenter.code == payload.code))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Cost center code already exists")

    cc = CostCenter(**payload.dict())
    session.add(cc)
    await session.commit()
    await session.refresh(cc)
    return cc


@router.get("/", response_model=list[CostCenterRead])
async def list_cost_centers(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(CostCenter))
    return result.scalars().all()


@router.get("/{cost_center_id}", response_model=CostCenterRead)
async def get_cost_center(cost_center_id: UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(CostCenter).where(CostCenter.id == cost_center_id))
    cc = result.scalar_one_or_none()
    if not cc:
        raise HTTPException(status_code=404, detail="Cost center not found")
    return cc


@router.put("/{cost_center_id}", response_model=CostCenterRead)
async def update_cost_center(
    cost_center_id: UUID,
    payload: CostCenterCreate,
    session: AsyncSession = Depends(get_session),
) -> CostCenterRead:
    result = await session.execute(select(CostCenter).where(CostCenter.id == cost_center_id))
    cc = result.scalar_one_or_none()
    if not cc:
        raise HTTPException(status_code=404, detail="Cost center not found")

    cc.code = payload.code
    cc.name = payload.name
    cc.updated_at = datetime.now(timezone.utc)

    await session.commit()
    await session.refresh(cc)
    return cc


@router.delete("/{cost_center_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cost_center(cost_center_id: UUID, session: AsyncSession = Depends(get_session)):
    stmt = (
        update(CostCenter)
        .where(CostCenter.id == cost_center_id, CostCenter.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Cost center not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="cost_center",
        entity_id=cost_center_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
