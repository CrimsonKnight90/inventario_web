# src/app/models/batch.py
import uuid
from sqlalchemy import Column, Text, Date, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from src.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

class Batch(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = 'batch'

    product_id = Column(PG_UUID(as_uuid=True), ForeignKey('product.id'), nullable=False)
    code = Column(Text, nullable=False)
    expiration_date = Column(Date, nullable=True)
    origin_type = Column(Text, nullable=False)
    origin_id = Column(PG_UUID(as_uuid=True), ForeignKey('party.id'), nullable=True)
    quarantined = Column(Boolean, nullable=False, server_default='false')

    def __repr__(self) -> str:
        return f"<Batch id={self.id} code={self.code}>"
