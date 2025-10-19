# ============================================================
# Archivo: backend/auditoria/models/proveedor_auditoria.py
# Descripción: Tabla de auditoría para proveedores
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.db.base_class import Base

class ProveedorAuditoria(Base):
    __tablename__ = "proveedor_auditoria"

    id = Column(Integer, primary_key=True, index=True)
    proveedor_id = Column(Integer, ForeignKey("proveedores.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)

    accion = Column(String(50), nullable=False)  # crear, actualizar, desactivar, reactivar
    valores_anteriores = Column(JSON, nullable=True)
    valores_nuevos = Column(JSON, nullable=True)

    fecha = Column(DateTime, default=datetime.utcnow, nullable=False)

    proveedor = relationship("Proveedor")
    usuario = relationship("Usuario")
