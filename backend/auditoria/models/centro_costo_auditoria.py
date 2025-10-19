# ============================================================
# Archivo: backend/auditoria/models/centro_costo_auditoria.py
# Descripción: Tabla de auditoría para Centros de Costo
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.db.base_class import Base

class CentroCostoAuditoria(Base):
    __tablename__ = "centro_costo_auditoria"

    id = Column(Integer, primary_key=True, index=True)
    cuentacc = Column(String(13), ForeignKey("centros_costo.cuentacc"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)

    accion = Column(String(50), nullable=False)  # crear, actualizar, desactivar, reactivar
    valores_anteriores = Column(JSON, nullable=True)
    valores_nuevos = Column(JSON, nullable=True)

    fecha = Column(DateTime, default=datetime.utcnow, nullable=False)

    centro_costo = relationship("CentroCosto")
    usuario = relationship("Usuario")
