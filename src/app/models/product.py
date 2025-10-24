# src/app/models/product.py
# Modelo de producto: define la tabla de productos y sus relaciones con categoría y unidad.

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import sqlalchemy as sa
import uuid

from .base import Base, TimestampMixin, UUIDPrimaryKeyMixin
from .category import Category
from .unit import Unit


class Product(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "product"

    name: Mapped[str] = mapped_column(sa.Text, nullable=False)
    sku: Mapped[str] = mapped_column(sa.Text, unique=True, nullable=False)
    category_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("category.id"))
    unit_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), sa.ForeignKey("unit.id"))
    is_serialized: Mapped[bool] = mapped_column(sa.Boolean, default=False)
    is_perishable: Mapped[bool] = mapped_column(sa.Boolean, default=False)

    # Relaciones
    category = relationship("Category", backref="products")
    unit = relationship("Unit", backref="products")

    def __repr__(self) -> str:
        return f"<Product id={self.id} sku={self.sku}>"
