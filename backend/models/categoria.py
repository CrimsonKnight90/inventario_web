# ============================================================
# Archivo: backend/models/categoria.py
# Descripción: Modelo SQLAlchemy para Categoría con soft delete
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String, Boolean, func, select
from sqlalchemy.orm import relationship, column_property
from backend.db.base_class import Base
from backend.models.producto import Producto  # 🔹 Importa el modelo Producto

class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True)
    descripcion = Column(String(255))
    activo = Column(Boolean, default=True, nullable=False)

    productos = relationship("Producto", back_populates="categoria")

    # 🔹 Campo calculado eficiente
    tieneProductos = column_property(
        select(func.count(Producto.id))
        .where(Producto.categoria_id == id)   # ✅ comparación correcta
        .correlate_except(Producto)
        .scalar_subquery() > 0
    )