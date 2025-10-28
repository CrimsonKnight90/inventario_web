# src/app/schemas/product.py

from pydantic import BaseModel, Field, constr
from uuid import UUID
from datetime import datetime

class ProductBase(BaseModel):
    name: constr(min_length=1, max_length=255)
    sku: constr(min_length=1, max_length=100)
    category_id: UUID | None = None
    unit_id: UUID | None = None
    is_serialized: bool = False
    is_perishable: bool = False

class ProductCreate(ProductBase):
    pass

class ProductRead(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        orm_mode = True
