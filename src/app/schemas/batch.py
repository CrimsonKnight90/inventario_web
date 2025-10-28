# src/app/schemas/batch.py

from pydantic import BaseModel, constr
from uuid import UUID
from datetime import datetime, date

class BatchBase(BaseModel):
    product_id: UUID
    code: constr(min_length=1, max_length=100)
    expiration_date: date | None = None
    origin_type: str
    origin_id: UUID | None = None
    quarantined: bool = False

class BatchCreate(BatchBase):
    pass

class BatchRead(BatchBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        orm_mode = True
