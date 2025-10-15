# ============================================================
# Archivo: backend/models/moneda.py
# Descripción: Catálogo de monedas (con soft delete)
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, String, Boolean
from backend.db.base_class import Base

class Moneda(Base):
    __tablename__ = "monedas"

    nombre = Column(String(30), primary_key=True)
    activo = Column(Boolean, default=True, nullable=False)
