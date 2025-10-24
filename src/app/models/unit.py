# src/app/models/unit.py
import uuid
from sqlalchemy import Column, Text, Numeric
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from src.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

class Unit(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = 'unit'

    code = Column(Text, nullable=False, unique=True)
    description = Column(Text, nullable=True)
    precision = Column(Numeric, nullable=True)

    def __repr__(self) -> str:
        return f"<Unit id={self.id} code={self.code}>"
