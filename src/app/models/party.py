# src/app/models/party.py
import uuid
from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from src.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

class Party(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = 'party'

    type = Column(Text, nullable=False)  # supplier|donor
    name = Column(Text, nullable=False)
    tax_id = Column(Text, nullable=True)
    contact = Column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<Party id={self.id} name={self.name}>"
