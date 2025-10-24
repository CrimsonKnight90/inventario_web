# src/app/models/audit_log.py
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
import sqlalchemy as sa
import uuid
from datetime import datetime
from .base import Base, UUIDPrimaryKeyMixin

class AuditLog(Base, UUIDPrimaryKeyMixin):
    __tablename__ = 'audit_log'

    entity_name: Mapped[str] = mapped_column(sa.Text, nullable=False)
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    action: Mapped[str] = mapped_column(sa.Text, nullable=False)
    changes: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    performed_by_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    reason: Mapped[str | None] = mapped_column(sa.Text, nullable=True)
    occurred_at: Mapped[datetime] = mapped_column(sa.TIMESTAMP(timezone=True), server_default=sa.func.now())
