from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from uuid import UUID
from datetime import datetime, timedelta, timezone
from decimal import Decimal

from src.models.inventory import Inventory
from src.models.reservation import Reservation
from src.models.movement import Movement


async def check_alerts(
    session: AsyncSession,
    product_id: UUID,
    batch_id: UUID | None = None,
    location_id: UUID | None = None,
    min_stock: Decimal = Decimal(10),
    min_coverage_days: int = 7,
    lookback_days: int = 30,
) -> list[dict]:
    """
    Generate alerts if stock is below thresholds.
    - min_stock: absolute stock threshold
    - min_coverage_days: forecasted coverage threshold
    """
    alerts = []

    # Current stock
    inv_stmt = select(func.coalesce(func.sum(Inventory.quantity), 0)).where(Inventory.product_id == product_id)
    if batch_id:
        inv_stmt = inv_stmt.where(Inventory.batch_id == batch_id)
    if location_id:
        inv_stmt = inv_stmt.where(Inventory.location_id == location_id)
    inv_result = await session.execute(inv_stmt)
    stock = Decimal(inv_result.scalar_one())

    if stock < min_stock:
        alerts.append({"type": "low_stock", "message": f"Stock {stock} below minimum {min_stock}"})

    # Consumption forecast
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
    if avg_daily > 0:
        coverage_days = float(stock / avg_daily)
        if coverage_days < min_coverage_days:
            alerts.append(
                {"type": "low_coverage", "message": f"Coverage {coverage_days:.1f} days below minimum {min_coverage_days}"}
            )

    return alerts
