# ============================================================
# Archivo: backend/models/centro_costo.py
# Descripción: Centros de costo
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, String
from backend.db.base_class import Base

class CentroCosto(Base):
    __tablename__ = "centros_costo"

    cuentacc = Column(String(13), primary_key=True)
    nomcc = Column(String(30))
