# ============================================================
# Archivo: backend/models/documento.py
# Descripción: Documentos contables (vales de entrada, consumo, servicios, cierre)
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.db.base_class import Base

class Documento(Base):
    __tablename__ = "documentos"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(DateTime, default=datetime.utcnow)

    tipo_doc_id = Column(String(8), ForeignKey("tipos_documentos.clave"))
    proveedor_id = Column(Integer, ForeignKey("proveedores.id"), nullable=True)


    importe_usd = Column(Integer, default=0)
    importe_mn = Column(Integer, default=0)

    tipo_doc = relationship("TipoDocumento")
    proveedor = relationship("Proveedor", back_populates="documentos")

