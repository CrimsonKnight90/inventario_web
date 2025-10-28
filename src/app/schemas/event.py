# src/app/schemas/event.py

from pydantic import BaseModel, constr
from uuid import UUID
from datetime import datetime

class EventBase(BaseModel):
    code: constr(min_length=1, max_length=50)
    name: constr(min_length=1, max_length=255)

class EventCreate(EventBase):
    pass

class EventRead(EventBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        orm_mode = True
