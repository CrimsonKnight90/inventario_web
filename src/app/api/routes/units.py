from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.unit import Unit
from src.app.schemas.unit import UnitCreate, UnitRead
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/units", tags=["units"])


@router.post("/", response_model=UnitRead, status_code=status.HTTP_201_CREATED)
async def create_unit(
    payload: UnitCreate,
    session: AsyncSession = Depends(get_session),
):
    # Verificar si ya existe un código igual
    result = await session.execute(select(Unit).where(Unit.code == payload.code))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Unit code already exists")

    unit = Unit(
        code=payload.code,
        description=payload.description,
        precision=payload.precision,
    )
    session.add(unit)
    await session.commit()
    await session.refresh(unit)
    return unit


@router.get("/", response_model=list[UnitRead])
async def list_units(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Unit))
    return result.scalars().all()


@router.get("/{unit_id}", response_model=UnitRead)
async def get_unit(unit_id: UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Unit).where(Unit.id == unit_id))
    unit = result.scalar_one_or_none()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    return unit


@router.put("/{unit_id}", response_model=UnitRead)
async def update_unit(
    unit_id: UUID,
    payload: UnitCreate,
    session: AsyncSession = Depends(get_session),
) -> UnitRead:
    """Update an existing unit."""
    result = await session.execute(select(Unit).where(Unit.id == unit_id))
    unit = result.scalar_one_or_none()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    unit.code = payload.code
    unit.description = payload.description
    unit.precision = payload.precision
    unit.updated_at = datetime.now(timezone.utc)

    await session.commit()
    await session.refresh(unit)
    return unit


@router.delete("/{unit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_unit(unit_id: UUID, session: AsyncSession = Depends(get_session)):
    """Soft delete a unit by setting deleted_at."""
    stmt = (
        update(Unit)
        .where(Unit.id == unit_id, Unit.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Unit not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="unit",
        entity_id=unit_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
