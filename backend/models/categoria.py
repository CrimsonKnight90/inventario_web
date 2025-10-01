from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)

    productos = relationship("Producto", back_populates="categoria")
