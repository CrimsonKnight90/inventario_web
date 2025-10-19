# // ============================================================
# // Archivo: backend/auditoria/models/contraparte_auditoria.py
# // Descripción: Tabla de auditoría para contrapartes contables
# // Autor: CrimsonKnight90
# // ============================================================

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.db.base_class import Base

class ContraparteAuditoria(Base):
    __tablename__ = "contraparte_auditoria"

    id = Column(Integer, primary_key=True, index=True)
    cuentacont = Column(String(13), ForeignKey("contrapartes.cuentacont"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)

    accion = Column(String(50), nullable=False)  # crear, actualizar, desactivar, reactivar
    valores_anteriores = Column(JSON, nullable=True)
    valores_nuevos = Column(JSON, nullable=True)

    fecha = Column(DateTime, default=datetime.utcnow, nullable=False)

    contraparte = relationship("Contraparte")
    usuario = relationship("Usuario")
