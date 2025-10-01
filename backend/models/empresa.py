from sqlalchemy import Column, Integer, String
from backend.db.base import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    direccion = Column(String(255))
    telefono = Column(String(50))
