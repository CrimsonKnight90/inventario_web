from pydantic import BaseModel, condecimal
from uuid import UUID
from datetime import datetime


class ReservationBase(BaseModel):
    product_id: UUID
    batch_id: UUID
    location_id: UUID
    event_id: UUID | None = None
    cost_center_id: UUID | None = None
    quantity: condecimal(gt=0)
    reserved_until: datetime | None = None


class ReservationCreate(ReservationBase):
    pass


class ReservationRead(ReservationBase):
    id: UUID
    reserved_from: datetime
    status: str
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        from_attributes = True
