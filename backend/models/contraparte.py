# ============================================================
# Archivo: backend/models/contraparte.py
# Descripción: Contrapartes contables
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String
from backend.db.base_class import Base

class Contraparte(Base):
    __tablename__ = "contrapartes"

    cuentacont = Column(Integer, primary_key=True)
    nomcont = Column(String(30))
