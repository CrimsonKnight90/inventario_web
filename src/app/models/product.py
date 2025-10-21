from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import sqlalchemy as sa
import uuid
from .base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Category(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "category"

    name: Mapped[str] = mapped_column(sa.Text, unique=True, nullable=False)
    parent_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("category.id"))

    parent = relationship("Category", remote_side="Category.id", backref="children")


class Unit(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "unit"

    code: Mapped[str] = mapped_column(sa.Text, unique=True, nullable=False)
    description: Mapped[str | None]
    precision: Mapped[float | None]


class Product(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "product"

    name: Mapped[str] = mapped_column(sa.Text, nullable=False)
    sku: Mapped[str] = mapped_column(sa.Text, unique=True, nullable=False)
    category_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("category.id"))
    unit_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("unit.id"))
    is_serialized: Mapped[bool] = mapped_column(sa.Boolean, default=False)
    is_perishable: Mapped[bool] = mapped_column(sa.Boolean, default=False)

    category = relationship("Category", backref="products")
    unit = relationship("Unit", backref="products")
