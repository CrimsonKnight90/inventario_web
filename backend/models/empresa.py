# ============================================================
# Archivo: backend/models/empresa.py
# Descripción: Modelo SQLAlchemy para empresas, con relaciones a usuarios,
#              productos y categorías.
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    direccion = Column(String(255))
    telefono = Column(String(50))

    # 🔹 Relaciones inversas
    usuarios = relationship("Usuario", back_populates="empresa")
    productos = relationship("Producto", back_populates="empresa")
    categorias = relationship("Categoria", back_populates="empresa")
