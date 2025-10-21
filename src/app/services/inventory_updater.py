from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from decimal import Decimal
from uuid import UUID

from src.app.models.inventory import Inventory
from src.app.services.audit_logger import log_audit


async def apply_movement(
    session: AsyncSession,
    product_id: UUID,
    batch_id: UUID,
    location_id: UUID,
    quantity: Decimal,
    direction: str,
) -> None:
    """
    Update inventory according to a movement and record audit inside the same transaction.

    direction: "in" (increase), "out" (decrease), "transfer_in", "transfer_out"

    This function expects to be called either standalone or enclosed by an outer transaction
    (async with session.begin()). It will flush as needed to obtain row ids for audit entries.
    """
    stmt = select(Inventory).where(
        Inventory.product_id == product_id,
        Inventory.batch_id == batch_id,
        Inventory.location_id == location_id,
    )
    result = await session.execute(stmt)
    inv: Optional[Inventory] = result.scalar_one_or_none()

    if direction in ("in", "transfer_in"):
        if inv:
            inv.quantity = (inv.quantity or 0) + quantity
            await session.flush()
            await log_audit(
                session=session,
                entity_type="inventory",
                entity_id=inv.id,
                action="increase",
                changes={"direction": direction, "quantity": str(quantity)},
                user_id=None,
            )
        else:
            inv = Inventory(
                product_id=product_id,
                batch_id=batch_id,
                location_id=location_id,
                quantity=quantity,
            )
            session.add(inv)
            await session.flush()
            await log_audit(
                session=session,
                entity_type="inventory",
                entity_id=inv.id,
                action="create",
                changes={"direction": direction, "quantity": str(quantity)},
                user_id=None,
            )
    elif direction in ("out", "transfer_out"):
        if not inv or (inv.quantity or 0) < quantity:
            raise IntegrityError(None, None, Exception("Insufficient stock"))
        inv.quantity = (inv.quantity or 0) - quantity
        await session.flush()
        await log_audit(
            session=session,
            entity_type="inventory",
            entity_id=inv.id,
            action="decrease",
            changes={"direction": direction, "quantity": str(quantity)},
            user_id=None,
        )
    else:
        raise ValueError("Invalid direction")
