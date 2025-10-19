# ============================================================
# Archivo: backend/models/proveedor.py
# Descripción: Modelo SQLAlchemy para Proveedores con soft delete y unicidad
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Proveedor(Base):
    __tablename__ = "proveedores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, unique=True, index=True)
    activo = Column(Boolean, nullable=False, default=True)

    documentos = relationship("Documento", back_populates="proveedor")

    __table_args__ = (
        UniqueConstraint("nombre", name="uq_proveedor_nombre"),
    )
