from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime,  timedelta, timezone
from uuid import UUID
from decimal import Decimal

from src.db.session import get_session
from src.models.inventory import Inventory
from src.models.reservation import Reservation
from src.models.movement import Movement

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/stock_summary")
async def stock_summary(
        session: AsyncSession = Depends(get_session),
        product_id: UUID | None = Query(None),
        batch_id: UUID | None = Query(None),
        location_id: UUID | None = Query(None),
):
    """
    Consolidated stock report:
    - physical: current inventory
    - reserved: active reservations
    - available: physical - reserved
    - consumed: total outbound movements
    """
    filters = []
    if product_id:
        filters.append(Inventory.product_id == product_id)
    if batch_id:
        filters.append(Inventory.batch_id == batch_id)
    if location_id:
        filters.append(Inventory.location_id == location_id)

    # Physical stock
    inv_stmt = select(func.coalesce(func.sum(Inventory.quantity), 0)).where(*filters)
    inv_result = await session.execute(inv_stmt)
    physical = inv_result.scalar_one()

    # Reserved stock
    res_stmt = select(func.coalesce(func.sum(Reservation.quantity), 0)).where(
        Reservation.status == "active", *filters
    )
    res_result = await session.execute(res_stmt)
    reserved = res_result.scalar_one()

    # Consumed stock (outbound movements)
    mov_stmt = select(func.coalesce(func.sum(Movement.quantity), 0)).where(
        Movement.from_location_id.isnot(None), *filters
    )
    mov_result = await session.execute(mov_stmt)
    consumed = mov_result.scalar_one()

    available = physical - reserved

    return {
        "physical": str(physical),
        "reserved": str(reserved),
        "available": str(available),
        "consumed": str(consumed),
    }


@router.get("/stock_history")
async def stock_history(
        session: AsyncSession = Depends(get_session),
        product_id: UUID,
        batch_id: UUID | None = None,
        location_id: UUID | None = None,
        start_date: datetime | None = Query(None),
        end_date: datetime | None = Query(None),
):
    """
    Historical stock evolution report.
    Returns cumulative stock changes over time based on movements.
    """
    stmt = select(
        Movement.occurred_at,
        Movement.quantity,
        Movement.from_location_id,
        Movement.to_location_id,
    ).where(Movement.product_id == product_id)

    if batch_id:
        stmt = stmt.where(Movement.batch_id == batch_id)
    if location_id:
        stmt = stmt.where(
            (Movement.from_location_id == location_id) | (Movement.to_location_id == location_id)
        )
    if start_date:
        stmt = stmt.where(Movement.occurred_at >= start_date)
    if end_date:
        stmt = stmt.where(Movement.occurred_at <= end_date)

    stmt = stmt.order_by(Movement.occurred_at.asc())
    result = await session.execute(stmt)
    movements = result.all()

    history = []
    balance = 0
    for occurred_at, qty, from_loc, to_loc in movements:
        if location_id:
            if from_loc == location_id:
                balance -= float(qty)
            elif to_loc == location_id:
                balance += float(qty)
        else:
            # Global balance (all locations)
            if from_loc:
                balance -= float(qty)
            if to_loc:
                balance += float(qty)

        history.append({"date": occurred_at.isoformat(), "balance": balance})

    return history

@router.get("/stock_forecast")
async def stock_forecast(
    session: AsyncSession = Depends(get_session),
    product_id: UUID = Query(...),
    batch_id: UUID | None = Query(None),
    location_id: UUID | None = Query(None),
    lookback_days: int = Query(30, ge=7, le=365),
):
    """
    Estimate stock depletion date based on average daily consumption in the last N days.
    """
    # Current stock
    inv_stmt = select(func.coalesce(func.sum(Inventory.quantity), 0)).where(Inventory.product_id == product_id)
    if batch_id:
        inv_stmt = inv_stmt.where(Inventory.batch_id == batch_id)
    if location_id:
        inv_stmt = inv_stmt.where(Inventory.location_id == location_id)
    inv_result = await session.execute(inv_stmt)
    stock = Decimal(inv_result.scalar_one())

    if stock <= 0:
        raise HTTPException(status_code=400, detail="No stock available for forecast")

    # Historical consumption (outbound movements)
    since = datetime.now(timezone.utc) - timedelta(days=lookback_days)
    mov_stmt = select(func.coalesce(func.sum(Movement.quantity), 0)).where(
        Movement.product_id == product_id,
        Movement.from_location_id.isnot(None),
        Movement.occurred_at >= since,
    )
    if batch_id:
        mov_stmt = mov_stmt.where(Movement.batch_id == batch_id)
    if location_id:
        mov_stmt = mov_stmt.where(Movement.from_location_id == location_id)
    mov_result = await session.execute(mov_stmt)
    consumed = Decimal(mov_result.scalar_one())

    avg_daily = consumed / Decimal(lookback_days) if consumed > 0 else Decimal(0)

    if avg_daily == 0:
        return {"stock": str(stock), "avg_daily_consumption": "0", "coverage_days": None, "depletion_date": None}

    coverage_days = float(stock / avg_daily)
    depletion_date = datetime.now(timezone.utc) + timedelta(days=coverage_days)

    return {
        "stock": str(stock),
        "avg_daily_consumption": str(round(avg_daily, 2)),
        "coverage_days": round(coverage_days, 1),
        "depletion_date": depletion_date.isoformat(),
    }
