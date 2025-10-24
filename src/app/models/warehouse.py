# src/app/models/warehouse.py
import uuid
from sqlalchemy import Column, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from src.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

class Warehouse(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = 'warehouse'

    code = Column(Text, nullable=False, unique=True)
    name = Column(Text, nullable=False)
    address = Column(Text, nullable=True)
    is_cold_chain = Column(Boolean, nullable=False, server_default='false')

    def __repr__(self) -> str:
        return f"<Warehouse id={self.id} code={self.code}>"
