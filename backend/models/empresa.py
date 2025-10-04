from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(150), nullable=False)
    direccion = Column(String(255))
    telefono = Column(String(50))

    # 🔹 Relación inversa
    usuarios = relationship("Usuario", back_populates="empresa")
