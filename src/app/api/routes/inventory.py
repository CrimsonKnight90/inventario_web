from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from src.db.session import get_session
from src.models.inventory import Inventory
from src.schemas.inventory import InventoryRead

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("/", response_model=list[InventoryRead])
async def list_inventory(
    session: AsyncSession = Depends(get_session),
    product_id: UUID | None = Query(None),
    batch_id: UUID | None = Query(None),
    location_id: UUID | None = Query(None),
    limit: int = Query(50, ge=1, le=500),
) -> list[InventoryRead]:
    """List current inventory with optional filters."""
    stmt = select(Inventory).limit(limit)
    if product_id:
        stmt = stmt.where(Inventory.product_id == product_id)
    if batch_id:
        stmt = stmt.where(Inventory.batch_id == batch_id)
    if location_id:
        stmt = stmt.where(Inventory.location_id == location_id)

    result = await session.execute(stmt)
    return result.scalars().all()
