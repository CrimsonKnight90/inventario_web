# ============================================================
# Archivo: backend/models/config.py
# Descripción: Modelo SQLAlchemy para la tabla de configuración de branding
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String
from backend.db.base_class import Base

class Config(Base):
    __tablename__ = "configuracion"

    id = Column(Integer, primary_key=True, index=True)
    app_name = Column(String(100), nullable=False, default="Inventario Pro")
    logo_url = Column(String(255), nullable=False, default="/uploads/logo.png")
    primary_color = Column(String(20), nullable=False, default="#1E293B")
    secondary_color = Column(String(20), nullable=False, default="#3B82F6")
    background_color = Column(String(20), nullable=False, default="#F8FAFC")
    topbar_color = Column(String(20), nullable=False, default="#0F172A")  # 🔹 Nuevo
