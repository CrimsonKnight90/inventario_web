# ============================================================
# Archivo: backend/models/categoria.py
# Descripción: Modelo SQLAlchemy para categorías, ligadas a empresa.
#              Incluye campo de descripción y relación con productos.
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    descripcion = Column(String(255))  # ✅ Nuevo campo para enriquecer categorías

    # 🔹 Relación con empresa
    empresa_id = Column(Integer, ForeignKey("empresas.id"))

    # 🔹 Relaciones inversas
    productos = relationship("Producto", back_populates="categoria")
    empresa = relationship("Empresa", back_populates="categorias")
