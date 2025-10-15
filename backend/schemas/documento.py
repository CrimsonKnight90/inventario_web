# ============================================================
# Archivo: backend/schemas/documento.py
# Descripción: Schemas Pydantic para Documentos (Vales)
# Autor: CrimsonKnight90
# ============================================================

from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional
from backend.i18n.messages import get_message

class DocumentoBase(BaseModel):
    fecha: Optional[datetime] = None
    importe_usd: Optional[int] = 0
    importe_mn: Optional[int] = 0

    # 🔹 Validaciones con mensajes traducibles
    @field_validator("importe_usd")
    def validar_importe_usd(cls, v):
        if v is not None and v < 0:
            raise ValueError(get_message("invalid_importe_usd"))
        return v

    @field_validator("importe_mn")
    def validar_importe_mn(cls, v):
        if v is not None and v < 0:
            raise ValueError(get_message("invalid_importe_mn"))
        return v

class DocumentoCreate(DocumentoBase):
    tipo_doc_id: str
    proveedor_id: Optional[int] = None

class DocumentoRead(DocumentoBase):
    id: int
    tipo_doc_id: str
    proveedor_id: Optional[int] = None

    class Config:
        from_attributes = True
