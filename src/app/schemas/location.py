from pydantic import BaseModel, constr
from uuid import UUID
from datetime import datetime

class LocationBase(BaseModel):
    warehouse_id: UUID
    code: constr(min_length=1, max_length=100)
    type: constr(min_length=1, max_length=50)
    path: str | None = None
    active: bool = True

class LocationCreate(LocationBase):
    pass

class LocationRead(LocationBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        from_attributes = True
