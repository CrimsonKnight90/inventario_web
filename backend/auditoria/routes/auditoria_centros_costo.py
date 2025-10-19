# ============================================================
# Archivo: backend/auditoria/routes/auditoria_centros_costo.py
# Descripción: Rutas de consulta para auditoría de Centros de Costo
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.db.session import get_db
from backend.auditoria.models.centro_costo_auditoria import CentroCostoAuditoria
from backend.auditoria.schemas.centro_costo_auditoria import CentroCostoAuditoriaRead
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message

router = APIRouter(prefix="/auditoria/centros-costo", tags=["Auditoría Centros de Costo"])

@router.get("/", response_model=List[CentroCostoAuditoriaRead], dependencies=[Depends(require_admin)])
def listar_auditoria_centros_costo(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    cuentacc: Optional[str] = Query(None, description="Filtrar por cuenta contable"),
    usuario_id: Optional[int] = Query(None, description="Filtrar por ID de usuario"),
    accion: Optional[str] = Query(None, description="Filtrar por acción"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
) -> List[CentroCostoAuditoria]:
    query = db.query(CentroCostoAuditoria)
    if cuentacc:
        query = query.filter(CentroCostoAuditoria.cuentacc == cuentacc)
    if usuario_id:
        query = query.filter(CentroCostoAuditoria.usuario_id == usuario_id)
    if accion:
        query = query.filter(CentroCostoAuditoria.accion == accion)

    return query.order_by(CentroCostoAuditoria.fecha.desc()).offset(offset).limit(limit).all()

@router.get("/{auditoria_id}", response_model=CentroCostoAuditoriaRead, dependencies=[Depends(require_admin)])
def obtener_auditoria_centro_costo(
    auditoria_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
) -> CentroCostoAuditoria:
    registro = db.query(CentroCostoAuditoria).filter(CentroCostoAuditoria.id == auditoria_id).first()
    if not registro:
        raise HTTPException(404, detail=get_message("auditoria_no_encontrada", lang))
    return registro
