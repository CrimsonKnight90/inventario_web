from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
import sqlalchemy as sa
import uuid
from datetime import datetime
from .base import Base, UUIDPrimaryKeyMixin

class AuditLog(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "audit_log"

    entity_type: Mapped[str] = mapped_column(sa.Text, nullable=False)  # e.g. 'inventory', 'reservation'
    entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    action: Mapped[str] = mapped_column(sa.Text, nullable=False)  # created|updated|deleted|fulfilled|released|expired
    changes: Mapped[dict | None] = mapped_column(JSONB, nullable=True)  # diff or snapshot
    user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True))
    timestamp: Mapped[datetime] = mapped_column(sa.TIMESTAMP(timezone=True), server_default=sa.func.now())
