# ============================================================
# Archivo: backend/models/producto.py
# Descripción: Modelo SQLAlchemy para productos con soft delete
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(String(255))

    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=True)
    um_id = Column(String(8), ForeignKey("um.um"), nullable=False)
    moneda_id = Column(String(30), ForeignKey("monedas.nombre"), nullable=False)

    existencia_min = Column(Float, default=0.0, nullable=False)
    existencia_max = Column(Float, nullable=False)

    activo = Column(Boolean, default=True, nullable=False)

    categoria = relationship("Categoria", back_populates="productos")
    um = relationship("UM")
    moneda = relationship("Moneda")

    __table_args__ = (
        CheckConstraint("existencia_min >= 0", name="ck_producto_existencia_min"),
        CheckConstraint("existencia_max > 0", name="ck_producto_existencia_max"),
        CheckConstraint("existencia_min <= existencia_max", name="ck_producto_rango"),
        UniqueConstraint("nombre", name="uq_producto_nombre"),
    )
