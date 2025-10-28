# src/app/schemas/serial.py

from pydantic import BaseModel, constr
from uuid import UUID
from datetime import datetime

class SerialBase(BaseModel):
    product_id: UUID
    batch_id: UUID | None = None
    serial_number: constr(min_length=1, max_length=255)
    location_id: UUID | None = None
    status: str | None = None

class SerialCreate(SerialBase):
    pass

class SerialRead(SerialBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        orm_mode = True
