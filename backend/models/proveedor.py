# ============================================================
# Archivo: backend/models/proveedor.py
# Descripción: Modelo SQLAlchemy para Proveedores
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Proveedor(Base):
    __tablename__ = "proveedores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)

    documentos = relationship("Documento", back_populates="proveedor")
