from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class AlertRead(BaseModel):
    type: str
    message: str
    severity: str  # info | warning | critical
    product_id: UUID | None = None
    batch_id: UUID | None = None
    location_id: UUID | None = None
    occurred_at: datetime

    class Config:
        from_attributes = True
