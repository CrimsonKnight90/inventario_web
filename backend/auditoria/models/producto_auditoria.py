# ============================================================
# Archivo: backend/auditoria/models/producto_auditoria.py
# Descripción: Tabla de auditoría para productos
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.db.base_class import Base

class ProductoAuditoria(Base):
    __tablename__ = "producto_auditoria"

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=True)

    accion = Column(String(50), nullable=False)  # crear, actualizar, desactivar, reactivar
    valores_anteriores = Column(JSON, nullable=True)
    valores_nuevos = Column(JSON, nullable=True)

    fecha = Column(DateTime, default=datetime.utcnow, nullable=False)

    producto = relationship("Producto")
    usuario = relationship("Usuario")
