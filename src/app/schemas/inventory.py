from pydantic import BaseModel, condecimal
from uuid import UUID
from datetime import datetime


class InventoryBase(BaseModel):
    product_id: UUID
    batch_id: UUID
    location_id: UUID
    quantity: condecimal(ge=0)


class InventoryRead(InventoryBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        from_attributes = True
