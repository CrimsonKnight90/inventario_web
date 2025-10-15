# ============================================================
# Archivo: backend/models/consumo.py
# Descripción: Consumos asociados a actividades
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Consumo(Base):
    __tablename__ = "consumos"

    id = Column(Integer, primary_key=True, index=True)
    actividad_id = Column(Integer, ForeignKey("actividades.codact"))
    cantpers = Column(Integer, default=0)

    actividad = relationship("Actividad", back_populates="consumos")
