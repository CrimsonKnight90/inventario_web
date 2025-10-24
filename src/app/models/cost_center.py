# src/app/models/cost_center.py
import uuid
from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from src.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

class CostCenter(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = 'cost_center'

    code = Column(Text, nullable=False, unique=True)
    name = Column(Text, nullable=False)

    def __repr__(self) -> str:
        return f"<CostCenter id={self.id} code={self.code}>"
