from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(String(255))
    precio = Column(Float, nullable=False)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))

    categoria = relationship("Categoria", back_populates="productos")
