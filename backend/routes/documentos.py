# ============================================================
# Archivo: backend/routes/documentos.py
# Descripción: Rutas CRUD para Documentos (Vales) + Cierre de periodo (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from backend.db.session import get_db
from backend.models.documento import Documento
from backend.models.tipo_documento import TipoDocumento
from backend.schemas.documento import DocumentoCreate, DocumentoRead
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message

router = APIRouter(prefix="/documentos", tags=["Documentos"])

# ------------------------------------------------------------
# CRUD básico
# ------------------------------------------------------------
@router.post("/", response_model=DocumentoRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def crear_documento(payload: DocumentoCreate, db: Session = Depends(get_db)):
    nuevo = Documento(**payload.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[DocumentoRead])
def listar_documentos(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    return db.query(Documento).all()

@router.get("/{documento_id}", response_model=DocumentoRead)
def obtener_documento(documento_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user), lang: str = "es"):
    doc = db.query(Documento).get(documento_id)
    if not doc:
        raise HTTPException(status_code=404, detail=get_message("documento_no_encontrado", lang))
    return doc

@router.delete("/{documento_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def eliminar_documento(documento_id: int, db: Session = Depends(get_db), lang: str = "es"):
    doc = db.query(Documento).get(documento_id)
    if not doc:
        raise HTTPException(status_code=404, detail=get_message("documento_no_encontrado", lang))
    db.delete(doc)
    db.commit()
    return None

# ------------------------------------------------------------
# Cierre de periodo
# ------------------------------------------------------------
@router.post("/cierre/{year}/{month}", response_model=DocumentoRead, dependencies=[Depends(require_admin)])
def generar_cierre_periodo(year: int, month: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user), lang: str = "es"):
    """
    Genera un Documento de tipo CIERRE consolidando todos los vales
    en el mes indicado (ya no depende de empresa).
    """

    cierre_tipo = db.query(TipoDocumento).filter(TipoDocumento.clave == "CIERRE").first()
    if not cierre_tipo:
        raise HTTPException(status_code=400, detail=get_message("cierre_tipo_no_existe", lang))

    # Rango de fechas
    fecha_inicio = datetime(year, month, 1)
    if month == 12:
        fecha_fin = datetime(year + 1, 1, 1) - timedelta(seconds=1)
    else:
        fecha_fin = datetime(year, month + 1, 1) - timedelta(seconds=1)

    # Documentos del periodo (excepto cierres previos)
    docs = db.query(Documento).filter(
        Documento.fecha >= fecha_inicio,
        Documento.fecha <= fecha_fin,
        Documento.tipo_doc_id != "CIERRE"
    ).all()

    if not docs:
        raise HTTPException(status_code=400, detail=get_message("no_docs_periodo", lang))

    total_usd = sum(d.importe_usd for d in docs)
    total_mn = sum(d.importe_mn for d in docs)

    cierre = Documento(
        fecha=datetime.utcnow(),
        tipo_doc_id="CIERRE",
        importe_usd=total_usd,
        importe_mn=total_mn
    )
    db.add(cierre)
    db.commit()
    db.refresh(cierre)

    return cierre
