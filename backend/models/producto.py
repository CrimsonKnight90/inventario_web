# ============================================================
# Archivo: backend/models/producto.py
# Descripción: Modelo SQLAlchemy para productos, con soporte de stock
#              y relación con categoría.
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(String(255))
    precio = Column(Float, nullable=False)

    # 🔹 Nuevos campos
    stock = Column(Integer, default=0, nullable=False)  # ✅ requerido por frontend y rutas


    # 🔹 Ahora categoria_id puede ser nulo para permitir actualizaciones parciales
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=True)

    categoria = relationship("Categoria", back_populates="productos")


