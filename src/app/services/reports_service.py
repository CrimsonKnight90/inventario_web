from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta, timezone
from uuid import UUID
from decimal import Decimal

from src.app.models.inventory import Inventory
from src.app.models.reservation import Reservation
from src.app.models.movement import Movement


def _inventory_filters(product_id: UUID | None, batch_id: UUID | None, location_id: UUID | None):
    filters = []
    if product_id is not None:
        filters.append(Inventory.product_id == product_id)
    if batch_id is not None:
        filters.append(Inventory.batch_id == batch_id)
    if location_id is not None:
        filters.append(Inventory.location_id == location_id)
    return filters


def _reservation_filters(product_id: UUID | None, batch_id: UUID | None, location_id: UUID | None):
    filters = [Reservation.status == "active"]
    if product_id is not None:
        filters.append(Reservation.product_id == product_id)
    if batch_id is not None:
        filters.append(Reservation.batch_id == batch_id)
    if location_id is not None:
        filters.append(Reservation.location_id == location_id)
    return filters


def _movement_base_filters(product_id: UUID | None, batch_id: UUID | None):
    filters = []
    if product_id is not None:
        filters.append(Movement.product_id == product_id)
    if batch_id is not None:
        filters.append(Movement.batch_id == batch_id)
    return filters


def _movement_location_sum_filter(product_id: UUID | None, batch_id: UUID | None, location_id: UUID | None):
    filters = _movement_base_filters(product_id, batch_id)
    filters.append(Movement.from_location_id.isnot(None))
    if location_id is not None:
        filters.append(Movement.from_location_id == location_id)
    return filters


async def get_stock_summary(
    session: AsyncSession,
    product_id: UUID | None = None,
    batch_id: UUID | None = None,
    location_id: UUID | None = None,
) -> dict:
    inv_filters = _inventory_filters(product_id, batch_id, location_id)
    inv_stmt = select(func.coalesce(func.sum(Inventory.quantity), 0)).where(*inv_filters)
    inv_result = await session.execute(inv_stmt)
    physical = inv_result.scalar_one()

    res_filters = _reservation_filters(product_id, batch_id, location_id)
    res_stmt = select(func.coalesce(func.sum(Reservation.quantity), 0)).where(*res_filters)
    res_result = await session.execute(res_stmt)
    reserved = res_result.scalar_one()

    mov_filters = _movement_location_sum_filter(product_id, batch_id, location_id)
    mov_stmt = select(func.coalesce(func.sum(Movement.quantity), 0)).where(*mov_filters)
    mov_result = await session.execute(mov_stmt)
    consumed = mov_result.scalar_one()

    available = Decimal(physical) - Decimal(reserved)

    return {
        "physical": str(Decimal(physical)),
        "reserved": str(Decimal(reserved)),
        "available": str(available),
        "consumed": str(Decimal(consumed)),
    }


async def get_stock_history(
    session: AsyncSession,
    product_id: UUID,
    batch_id: UUID | None = None,
    location_id: UUID | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
) -> List[dict]:
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
    balance = 0.0
    for occurred_at, qty, from_loc, to_loc in movements:
        qty_f = float(qty)
        if location_id:
            if from_loc == location_id:
                balance -= qty_f
            elif to_loc == location_id:
                balance += qty_f
        else:
            if from_loc:
                balance -= qty_f
            if to_loc:
                balance += qty_f

        history.append({"date": occurred_at, "balance": balance})

    return history


async def get_stock_forecast(
    session: AsyncSession,
    product_id: UUID,
    batch_id: UUID | None = None,
    location_id: UUID | None = None,
    lookback_days: int = 30,
) -> dict:
    inv_filters = _inventory_filters(product_id, batch_id, location_id)
    inv_stmt = select(func.coalesce(func.sum(Inventory.quantity), 0)).where(*inv_filters)
    inv_result = await session.execute(inv_stmt)
    stock = Decimal(inv_result.scalar_one())

    if stock <= 0:
        raise ValueError("No stock available for forecast")

    since = datetime.now(timezone.utc) - timedelta(days=lookback_days)
    mov_filters = _movement_location_sum_filter(product_id, batch_id, location_id)
    mov_filters.append(Movement.occurred_at >= since)
    mov_stmt = select(func.coalesce(func.sum(Movement.quantity), 0)).where(*mov_filters)
    mov_result = await session.execute(mov_stmt)
    consumed = Decimal(mov_result.scalar_one())

    avg_daily = consumed / Decimal(lookback_days) if consumed > 0 else Decimal(0)

    if avg_daily == 0:
        return {
            "stock": str(stock),
            "avg_daily_consumption": "0",
            "coverage_days": None,
            "depletion_date": None,
        }

    coverage_days = float(stock / avg_daily)
    depletion_date = datetime.now(timezone.utc) + timedelta(days=coverage_days)

    return {
        "stock": str(stock),
        "avg_daily_consumption": str(round(avg_daily, 2)),
        "coverage_days": round(coverage_days, 1),
        "depletion_date": depletion_date,
    }
