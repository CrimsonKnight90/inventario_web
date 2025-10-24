from pydantic import BaseModel, constr
from uuid import UUID
from datetime import datetime

class PartyBase(BaseModel):
    type: constr(min_length=1, max_length=50)  # supplier | donor
    name: constr(min_length=1, max_length=255)
    tax_id: str | None = None
    contact: str | None = None

class PartyCreate(PartyBase):
    pass

class PartyRead(PartyBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        from_attributes = True
