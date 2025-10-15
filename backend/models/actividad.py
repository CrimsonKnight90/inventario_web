# backend/models/actividad.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from backend.db.base_class import Base
from sqlalchemy.orm import relationship

class Actividad(Base):
    __tablename__ = "actividades"

    codact = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nomact = Column(String(30), nullable=False)
    fechaini = Column(DateTime, nullable=True)
    fechafin = Column(DateTime, nullable=True)
    actcerrada = Column(Boolean, default=False)

    # 🔹 Relaciones
    consumos = relationship("Consumo", back_populates="actividad")
