# src/app/models/category.py
import uuid
from sqlalchemy import Column, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from src.app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

class Category(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = 'category'

    name = Column(Text, nullable=False, unique=True)
    parent_id = Column(PG_UUID(as_uuid=True), ForeignKey('category.id'), nullable=True)
    parent = relationship('Category', remote_side='Category.id', backref='children')

    def __repr__(self) -> str:
        return f"<Category id={self.id} name={self.name}>"
