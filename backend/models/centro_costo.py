# ============================================================
# Archivo: backend/models/centro_costo.py
# Descripción: Modelo SQLAlchemy para Centros de Costo con soft delete y validaciones
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, String, Boolean, CheckConstraint, UniqueConstraint
from backend.db.base_class import Base

class CentroCosto(Base):
    __tablename__ = "centros_costo"

    cuentacc = Column(String(13), primary_key=True, index=True)  # formato 000-00-00-00
    nomcc = Column(String(100), nullable=False, unique=True)
    activo = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        CheckConstraint("cuentacc ~ '^[0-9]{3}-[0-9]{2}-[0-9]{2}-[0-9]{2}$'", name="ck_centro_costo_cuentacc_formato"),
        UniqueConstraint("nomcc", name="uq_centro_costo_nomcc"),
    )
