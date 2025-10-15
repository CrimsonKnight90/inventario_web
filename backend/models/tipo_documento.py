# ============================================================
# Archivo: backend/models/tipo_documento.py
# Descripción: Catálogo de tipos de documentos (vales, comprobantes) con reglas y soft delete
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy import Column, String, Integer, Boolean, CheckConstraint, DateTime
from backend.db.base_class import Base

class TipoDocumento(Base):
    __tablename__ = "tipos_documentos"

    clave = Column(String(8), primary_key=True)
    nombre = Column(String(30), nullable=False)
    factor = Column(Integer, default=1, nullable=False)
    activo = Column(Boolean, default=True, nullable=False)

    # Opcional: timestamps para auditoría básica que ya estás usando en routes
    creado_en = Column(DateTime, nullable=True)
    desactivado_en = Column(DateTime, nullable=True)
    reactivado_en = Column(DateTime, nullable=True)

    __table_args__ = (
        CheckConstraint("factor IN (-1, 1)", name="chk_factor_valido"),
        CheckConstraint("clave ~ '^[A-Z]+$'", name="chk_clave_mayusculas"),
    )

