from pydantic import BaseModel, constr
from uuid import UUID
from datetime import datetime


class CategoryBase(BaseModel):
    name: constr(min_length=1, max_length=255)
    parent_id: UUID | None = None


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        from_attributes = True
