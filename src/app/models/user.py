# src/app/models/user.py
# Modelo de usuario: define la tabla de cuentas de usuario con credenciales, estado y metadatos de auditoría.

import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import sqlalchemy as sa

from src.app.models.base import Base


class User(Base):
    __tablename__ = "user_account"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    username: Mapped[str] = mapped_column(sa.Text, nullable=False, unique=True)
    email: Mapped[str] = mapped_column(sa.Text, nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(sa.Text, nullable=False)
    active: Mapped[bool] = mapped_column(sa.Boolean, nullable=False, server_default=sa.text("true"))
    created_at: Mapped[datetime] = mapped_column(
        sa.TIMESTAMP(timezone=True), nullable=False, server_default=sa.text("now()")
    )
    updated_at: Mapped[datetime] = mapped_column(sa.TIMESTAMP(timezone=True), nullable=True)
    deleted_at: Mapped[datetime] = mapped_column(sa.TIMESTAMP(timezone=True), nullable=True)

    def __repr__(self) -> str:
        return f"<User id={self.id} username={self.username}>"
