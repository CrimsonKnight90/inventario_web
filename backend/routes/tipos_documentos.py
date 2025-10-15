# ============================================================
# Archivo: backend/routes/tipos_documentos.py
# Descripción: Rutas CRUD para Tipos de Documento con i18n
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.db.session import get_db
from backend.models.tipo_documento import TipoDocumento
from backend.schemas.tipo_documento import TipoDocumentoCreate, TipoDocumentoRead
from backend.security.deps import get_current_user, require_admin
from backend.i18n.messages import get_message
from datetime import datetime

router = APIRouter(prefix="/tipos-documentos", tags=["Tipos de Documento"])

@router.post("/", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_tipo_documento(payload: TipoDocumentoCreate, db: Session = Depends(get_db), lang: str = "es"):
    existente = db.query(TipoDocumento).filter(TipoDocumento.clave == payload.clave).first()
    if existente:
        if not existente.activo:
            if existente.nombre != payload.nombre or existente.factor != payload.factor:
                raise HTTPException(
                    status_code=409,
                    detail=get_message("tipo_doc_conflicto_reactivacion", lang).format(clave=payload.clave)
                )
            existente.activo = True
            existente.reactivado_en = datetime.utcnow()
            db.commit()
            db.refresh(existente)
            return {"status": "reactivated", "data": existente}
        raise HTTPException(status_code=400, detail=get_message("tipo_doc_existente_activo", lang))

    nuevo = TipoDocumento(**payload.dict(), activo=True, creado_en=datetime.utcnow())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return {"status": "created", "data": nuevo}

@router.get("/", response_model=List[TipoDocumentoRead])
def listar_tipos_documentos(
    incluir_inactivos: Optional[bool] = Query(False, description="Incluir registros inactivos"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(TipoDocumento)
    if not incluir_inactivos:
        query = query.filter(TipoDocumento.activo == True)
    return query.order_by(TipoDocumento.clave.asc()).all()

@router.patch("/{clave}/desactivar", status_code=status.HTTP_200_OK, dependencies=[Depends(require_admin)])
def desactivar_tipo_documento(clave: str, db: Session = Depends(get_db), lang: str = "es"):
    tipo = db.query(TipoDocumento).filter(TipoDocumento.clave == clave).first()
    if not tipo:
        raise HTTPException(status_code=404, detail=get_message("tipo_doc_no_encontrado", lang))
    if not tipo.activo:
        return {"detail": get_message("tipo_doc_ya_desactivado", lang).format(clave=clave)}
    tipo.activo = False
    tipo.desactivado_en = datetime.utcnow()
    db.commit()
    return {"detail": get_message("tipo_doc_desactivado_ok", lang).format(clave=clave)}

@router.patch("/{clave}/reactivar", status_code=status.HTTP_200_OK, dependencies=[Depends(require_admin)])
def reactivar_tipo_documento(clave: str, db: Session = Depends(get_db), lang: str = "es"):
    tipo = db.query(TipoDocumento).filter(TipoDocumento.clave == clave).first()
    if not tipo:
        raise HTTPException(status_code=404, detail=get_message("tipo_doc_no_encontrado", lang))
    if tipo.activo:
        return {"detail": get_message("tipo_doc_ya_activo", lang).format(clave=clave)}

    tipo.activo = True
    tipo.reactivado_en = datetime.utcnow()
    db.commit()
    db.refresh(tipo)

    return {"status": "reactivated", "data": tipo}
