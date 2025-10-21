from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import sqlalchemy as sa
import uuid
from .base import Base, UUIDPrimaryKeyMixin, TimestampMixin


class Inventory(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "inventory"

    product_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("product.id"), nullable=False)
    batch_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("batch.id"), nullable=False)
    location_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("location.id"), nullable=False)
    quantity: Mapped[float] = mapped_column(sa.Numeric, nullable=False)

    __table_args__ = (
        sa.UniqueConstraint("product_id", "batch_id", "location_id", name="uq_inventory_triplet"),
    )
