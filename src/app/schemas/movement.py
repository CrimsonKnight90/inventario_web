# src/app/schemas/movement.py

from pydantic import BaseModel, constr, condecimal
from uuid import UUID
from datetime import datetime

class MovementBase(BaseModel):
    code: constr(min_length=1, max_length=100)
    movement_type_id: UUID
    product_id: UUID
    batch_id: UUID
    from_location_id: UUID | None = None
    to_location_id: UUID | None = None
    reason_id: UUID
    requested_by_user_id: UUID | None = None
    executed_by_user_id: UUID | None = None
    quantity: condecimal(gt=0)

class MovementCreate(MovementBase):
    pass

class MovementRead(MovementBase):
    id: UUID
    occurred_at: datetime
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        orm_mode = True
