# src/app/schemas/audit_log.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class AuditLogRead(BaseModel):
    id: UUID
    entity_name: str
    entity_id: UUID
    action: str
    changes: dict | None = None
    performed_by_user_id: UUID | None = None
    reason: str | None = None
    occurred_at: datetime

    class Config:
        orm_mode = True
