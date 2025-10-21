from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import sqlalchemy as sa
import uuid
from datetime import datetime
from .base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class Reservation(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "reservation"

    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("product.id"), nullable=False)
    batch_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("batch.id"), nullable=False)
    location_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("location.id"), nullable=False)
    event_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("event.id"))
    cost_center_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("cost_center.id"))
    quantity: Mapped[float] = mapped_column(sa.Numeric, nullable=False)
    reserved_from: Mapped[datetime] = mapped_column(sa.TIMESTAMP(timezone=True), server_default=sa.func.now())
    reserved_until: Mapped[datetime | None]
    status: Mapped[str] = mapped_column(sa.Text, default="active")  # active|released|fulfilled|expired
