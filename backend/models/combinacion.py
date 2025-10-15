# ============================================================
# Archivo: backend/models/combinacion.py
# Descripción: Combinaciones contables
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, String
from backend.db.base_class import Base

class Combinacion(Base):
    __tablename__ = "combinaciones"

    cc = Column(String(8), primary_key=True)
    cont = Column(String(8))
    cl = Column(String(8))
