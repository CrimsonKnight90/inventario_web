# src/app/models/user_role.py
# Modelo de asociación usuario-rol: tabla intermedia que vincula usuarios con roles asignados.

import datetime
import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from src.app.models.base import Base


class UserRole(Base):
    __tablename__ = "user_role"

    user_id: Mapped[PG_UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        sa.ForeignKey("user_account.id"),
        primary_key=True,
        nullable=False,
    )
    role_id: Mapped[PG_UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        sa.ForeignKey("role.id"),
        primary_key=True,
        nullable=False,
    )
    assigned_at: Mapped[datetime.datetime] = mapped_column(
        sa.TIMESTAMP(timezone=True),
        server_default=sa.text("now()"),
        nullable=False,
    )

    # Relaciones (solo lectura para evitar escritura accidental desde aquí)
    user = relationship("User", viewonly=True)
    role = relationship("Role", viewonly=True)

    def __repr__(self) -> str:
        return f"<UserRole user_id={self.user_id} role_id={self.role_id}>"
