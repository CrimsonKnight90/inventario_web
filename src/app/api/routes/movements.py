from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.app.db.session import get_session
from src.app.models.movement import Movement
from src.app.schemas.movement import MovementCreate, MovementRead
from src.app.services.inventory_updater import apply_movement
from src.app.api.deps.auth import require_roles

router = APIRouter(prefix="/movements", tags=["movements"])


@router.post(
    "/",
    response_model=MovementRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_roles(["warehouse", "admin"]))],
)
async def create_movement(
    payload: MovementCreate, session: AsyncSession = Depends(get_session)
) -> MovementRead:
    """Register a new inventory movement and update stock accordingly.

    Only users with role 'warehouse' or 'admin' can perform this action.
    """
    stmt = select(Movement).where(Movement.code == payload.code)
    result = await session.execute(stmt)
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Movement code already exists")

    movement = Movement(**payload.dict())
    session.add(movement)

    try:
        if payload.from_location_id and payload.to_location_id:
            # Transfer
            await apply_movement(
                session,
                payload.product_id,
                payload.batch_id,
                payload.from_location_id,
                payload.quantity,
                "transfer_out",
            )
            await apply_movement(
                session,
                payload.product_id,
                payload.batch_id,
                payload.to_location_id,
                payload.quantity,
                "transfer_in",
            )
        elif payload.to_location_id:
            # Inbound
            await apply_movement(
                session,
                payload.product_id,
                payload.batch_id,
                payload.to_location_id,
                payload.quantity,
                "in",
            )
        elif payload.from_location_id:
            # Outbound
            await apply_movement(
                session,
                payload.product_id,
                payload.batch_id,
                payload.from_location_id,
                payload.quantity,
                "out",
            )
        else:
            raise HTTPException(status_code=400, detail="Invalid movement: no location specified")
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    await session.commit()
    await session.refresh(movement)
    return movement
