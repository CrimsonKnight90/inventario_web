# src/app/models/role.py
# Modelo de rol: define los roles disponibles en el sistema con código único y descripción.

import uuid
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from src.app.models.base import Base


class Role(Base):
    __tablename__ = "role"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(sa.Text, nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(sa.Text, nullable=True)

    def __repr__(self) -> str:
        return f"<Role id={self.id} code={self.code}>"
