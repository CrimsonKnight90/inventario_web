from pydantic import BaseModel, constr
from uuid import UUID
from datetime import datetime

class CostCenterBase(BaseModel):
    code: constr(min_length=1, max_length=50)
    name: constr(min_length=1, max_length=255)

class CostCenterCreate(CostCenterBase):
    pass

class CostCenterRead(CostCenterBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        from_attributes = True
