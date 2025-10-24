# src/app/models/serial.py
import uuid
from sqlalchemy import Column, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from src.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

class Serial(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = 'serial'

    product_id = Column(PG_UUID(as_uuid=True), ForeignKey('product.id'), nullable=False)
    batch_id = Column(PG_UUID(as_uuid=True), ForeignKey('batch.id'), nullable=True)
    serial_number = Column(Text, nullable=False, unique=True)
    location_id = Column(PG_UUID(as_uuid=True), ForeignKey('location.id'), nullable=True)
    status = Column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<Serial id={self.id} serial={self.serial_number}>"
