from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import sqlalchemy as sa
import uuid
from datetime import datetime

from .base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class MovementType(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "movement_type"

    code: Mapped[str] = mapped_column(sa.Text, unique=True, nullable=False)
    description: Mapped[str | None]


class MovementReason(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "movement_reason"

    code: Mapped[str] = mapped_column(sa.Text, unique=True, nullable=False)
    description: Mapped[str | None]
    requires_approval: Mapped[bool] = mapped_column(sa.Boolean, default=False)


class Movement(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "movement"

    code: Mapped[str] = mapped_column(sa.Text, unique=True, nullable=False)
    movement_type_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("movement_type.id"))
    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("product.id"))
    batch_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("batch.id"))
    from_location_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("location.id"))
    to_location_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("location.id"))
    reason_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("movement_reason.id"))
    requested_by_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("user_account.id"))
    executed_by_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("user_account.id"))
    quantity: Mapped[float] = mapped_column(sa.Numeric, nullable=False)
    occurred_at: Mapped[datetime] = mapped_column(sa.TIMESTAMP(timezone=True), server_default=sa.func.now())

    movement_type = relationship("MovementType")
    reason = relationship("MovementReason")
