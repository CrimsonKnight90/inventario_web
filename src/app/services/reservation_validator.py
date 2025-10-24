from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from decimal import Decimal
from src.app.models.inventory import Inventory
from src.app.models.reservation import Reservation


async def validate_reservation(
    session: AsyncSession,
    product_id: UUID,
    batch_id: UUID,
    location_id: UUID,
    quantity: Decimal,
) -> None:
    """
    Ensure that requested reservation quantity does not exceed available stock.
    Available = Inventory.quantity - SUM(active reservations).
    Raises ValueError if insufficient stock.
    """
    # Current inventory
    inv_stmt = select(Inventory).where(
        Inventory.product_id == product_id,
        Inventory.batch_id == batch_id,
        Inventory.location_id == location_id,
    )
    inv_result = await session.execute(inv_stmt)
    inv = inv_result.scalar_one_or_none()
    available = inv.quantity if inv else Decimal(0)

    # Active reservations
    res_stmt = select(func.coalesce(func.sum(Reservation.quantity), 0)).where(
        Reservation.product_id == product_id,
        Reservation.batch_id == batch_id,
        Reservation.location_id == location_id,
        Reservation.status == "active",
    )
    res_result = await session.execute(res_stmt)
    reserved_qty = res_result.scalar_one()

    effective_available = available - reserved_qty
    if effective_available < quantity:
        raise ValueError(f"Insufficient stock to reserve. Available: {effective_available}, requested: {quantity}")
