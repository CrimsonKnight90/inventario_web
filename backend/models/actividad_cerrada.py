from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from backend.db.base_class import Base

class ActividadCerrada(Base):
    __tablename__ = "actividades_cerradas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    codact = Column(Integer, ForeignKey("actividades.codact"), nullable=False)
    nomact = Column(String(30), nullable=False)
    fechaini = Column(DateTime, nullable=True)
    fechafin = Column(DateTime, nullable=True)

    totpers = Column(Integer, default=0)
    totusd = Column(Integer, default=0)
    totmn = Column(Integer, default=0)
    totsm = Column(Integer, default=0)

    elecusd = Column(Integer, default=0)
    elecmn = Column(Integer, default=0)
    salusd = Column(Integer, default=0)
    salmn = Column(Integer, default=0)
    transpusd = Column(Integer, default=0)
    transpmn = Column(Integer, default=0)
    otrosusd = Column(Integer, default=0)
    otrosmn = Column(Integer, default=0)
    porcusd = Column(Integer, default=0)
    pormn = Column(Integer, default=0)

    observaciones = Column(Text, nullable=True)
