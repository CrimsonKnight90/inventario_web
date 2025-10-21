from pydantic import BaseModel, constr
from uuid import UUID
from datetime import datetime


class UnitBase(BaseModel):
    code: constr(min_length=1, max_length=50)
    description: str | None = None
    precision: float | None = None


class UnitCreate(UnitBase):
    pass


class UnitRead(UnitBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        from_attributes = True
