# ============================================================
# Archivo: backend/models/um.py
# Descripción: Unidades de medida (con soft delete)
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, String, Integer, Boolean
from backend.db.base_class import Base

class UM(Base):
    __tablename__ = "um"

    um = Column(String(8), primary_key=True)
    factor = Column(Integer, default=1, nullable=False)
    activo = Column(Boolean, default=True, nullable=False)
