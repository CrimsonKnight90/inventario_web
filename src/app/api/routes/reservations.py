from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.reservation import Reservation
from src.app.schemas.reservation import ReservationCreate, ReservationRead
from src.app.services.reservation_validator import validate_reservation
from src.app.services.reservation_lifecycle import (
    release_reservation,
    fulfill_reservation,
    expire_reservations,
    fulfill_reservation_with_movement,
)
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/reservations", tags=["reservations"])


@router.post("/", response_model=ReservationRead, status_code=status.HTTP_201_CREATED)
async def create_reservation(
    payload: ReservationCreate, session: AsyncSession = Depends(get_session)
) -> ReservationRead:
    """Create a new reservation of stock, validating against available inventory."""
    try:
        await validate_reservation(
            session,
            payload.product_id,
            payload.batch_id,
            payload.location_id,
            payload.quantity,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    reservation = Reservation(**payload.dict())
    session.add(reservation)
    await session.commit()
    await session.refresh(reservation)
    return reservation


@router.get("/", response_model=list[ReservationRead])
async def list_reservations(session: AsyncSession = Depends(get_session)) -> list[ReservationRead]:
    """List all reservations."""
    result = await session.execute(select(Reservation).order_by(Reservation.reserved_from.desc()))
    return result.scalars().all()


@router.get("/{reservation_id}", response_model=ReservationRead)
async def get_reservation(reservation_id: UUID, session: AsyncSession = Depends(get_session)) -> ReservationRead:
    """Get a single reservation by ID."""
    result = await session.execute(select(Reservation).where(Reservation.id == reservation_id))
    reservation = result.scalar_one_or_none()
    if not reservation:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation


@router.delete("/{reservation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reservation(reservation_id: UUID, session: AsyncSession = Depends(get_session)):
    """Soft delete (cancel) a reservation by setting deleted_at."""
    stmt = (
        update(Reservation)
        .where(Reservation.id == reservation_id, Reservation.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Reservation not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="reservation",
        entity_id=reservation_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return


@router.post("/{reservation_id}/release", response_model=ReservationRead)
async def release_reservation_endpoint(reservation_id: UUID, session: AsyncSession = Depends(get_session)):
    await release_reservation(session, reservation_id)
    await session.commit()
    res = await session.get(Reservation, reservation_id)
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return res


@router.post("/{reservation_id}/fulfill", response_model=ReservationRead)
async def fulfill_reservation_endpoint(reservation_id: UUID, session: AsyncSession = Depends(get_session)):
    await fulfill_reservation(session, reservation_id)
    await session.commit()
    res = await session.get(Reservation, reservation_id)
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return res


@router.post("/expire", response_model=dict)
async def expire_reservations_endpoint(session: AsyncSession = Depends(get_session)):
    count = await expire_reservations(session)
    await session.commit()
    return {"expired": count}


@router.post("/{reservation_id}/fulfill_with_movement", response_model=ReservationRead)
async def fulfill_reservation_and_generate_movement(reservation_id: UUID, session: AsyncSession = Depends(get_session)):
    """
    Fulfil a reservation and generate an outbound movement.
    """
    try:
        movement = await fulfill_reservation_with_movement(session, reservation_id)
        await session.commit()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    res = await session.get(Reservation, reservation_id)
    return res
