from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.serial import Serial
from src.app.schemas.serial import SerialCreate, SerialRead
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/serials", tags=["serials"])


@router.post("/", response_model=SerialRead, status_code=status.HTTP_201_CREATED)
async def create_serial(
    payload: SerialCreate, session: AsyncSession = Depends(get_session)
) -> SerialRead:
    # Verificar si ya existe un serial_number igual
    result = await session.execute(select(Serial).where(Serial.serial_number == payload.serial_number))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Serial number already exists")

    serial = Serial(**payload.dict())
    session.add(serial)
    await session.commit()
    await session.refresh(serial)
    return serial


@router.get("/", response_model=list[SerialRead])
async def list_serials(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Serial))
    return result.scalars().all()


@router.get("/{serial_id}", response_model=SerialRead)
async def get_serial(serial_id: UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Serial).where(Serial.id == serial_id))
    serial = result.scalar_one_or_none()
    if not serial:
        raise HTTPException(status_code=404, detail="Serial not found")
    return serial


@router.put("/{serial_id}", response_model=SerialRead)
async def update_serial(
    serial_id: UUID,
    payload: SerialCreate,
    session: AsyncSession = Depends(get_session),
) -> SerialRead:
    result = await session.execute(select(Serial).where(Serial.id == serial_id))
    serial = result.scalar_one_or_none()
    if not serial:
        raise HTTPException(status_code=404, detail="Serial not found")

    for field, value in payload.dict().items():
        setattr(serial, field, value)

    serial.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(serial)
    return serial


@router.delete("/{serial_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_serial(serial_id: UUID, session: AsyncSession = Depends(get_session)):
    stmt = (
        update(Serial)
        .where(Serial.id == serial_id, Serial.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Serial not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="serial",
        entity_id=serial_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
