from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.location import Location
from src.app.schemas.location import LocationCreate, LocationRead
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/locations", tags=["locations"])


@router.post("/", response_model=LocationRead, status_code=status.HTTP_201_CREATED)
async def create_location(
    payload: LocationCreate, session: AsyncSession = Depends(get_session)
) -> LocationRead:
    # Verificar si ya existe un código igual en el mismo warehouse
    result = await session.execute(
        select(Location).where(
            Location.code == payload.code,
            Location.warehouse_id == payload.warehouse_id,
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Location code already exists in this warehouse")

    location = Location(**payload.dict())
    session.add(location)
    await session.commit()
    await session.refresh(location)
    return location


@router.get("/", response_model=list[LocationRead])
async def list_locations(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Location))
    return result.scalars().all()


@router.get("/{location_id}", response_model=LocationRead)
async def get_location(location_id: UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Location).where(Location.id == location_id))
    location = result.scalar_one_or_none()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location


@router.put("/{location_id}", response_model=LocationRead)
async def update_location(
    location_id: UUID,
    payload: LocationCreate,
    session: AsyncSession = Depends(get_session),
) -> LocationRead:
    result = await session.execute(select(Location).where(Location.id == location_id))
    location = result.scalar_one_or_none()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    for field, value in payload.dict().items():
        setattr(location, field, value)

    location.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(location)
    return location


@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_location(location_id: UUID, session: AsyncSession = Depends(get_session)):
    stmt = (
        update(Location)
        .where(Location.id == location_id, Location.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Location not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="location",
        entity_id=location_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
