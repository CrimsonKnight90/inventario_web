# ============================================================
# Archivo: backend/models/usuario.py
# Descripción: Modelo SQLAlchemy para Usuario
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.base_class import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)  # ⚠️ se guarda hasheada

    # Rol de usuario
    role = Column(String(50), default="empleado")
