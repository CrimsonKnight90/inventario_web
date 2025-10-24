# src/app/models/location.py
import uuid
from sqlalchemy import Column, Text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from src.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

class Location(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = 'location'

    warehouse_id = Column(PG_UUID(as_uuid=True), ForeignKey('warehouse.id'), nullable=False)
    code = Column(Text, nullable=False)
    type = Column(Text, nullable=False)
    path = Column(Text, nullable=True)
    active = Column(Boolean, nullable=False, server_default='true')

    def __repr__(self) -> str:
        return f"<Location id={self.id} code={self.code}>"
