from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from src.db.session import get_session
from src.models.reservation import Reservation
from src.schemas.reservation import ReservationCreate, ReservationRead
from src.services.reservation_validator import validate_reservation
from src.services.reservation_lifecycle import release_reservation, fulfill_reservation, expire_reservations, fulfill_reservation_with_movement

from src.db.session import get_session
from src.models.reservation import Reservation
from src.schemas.reservation import ReservationCreate, ReservationRead
from src.services.reservation_validator import validate_reservation

router = APIRouter(prefix="/reservations", tags=["reservations"])


@router.post("/", response_model=ReservationRead, status_code=201)
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
    Cumple una reserva y genera automáticamente un movimiento de salida.
    """
    try:
        movement = await fulfill_reservation_with_movement(session, reservation_id)
        await session.commit()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    res = await session.get(Reservation, reservation_id)
    return res
