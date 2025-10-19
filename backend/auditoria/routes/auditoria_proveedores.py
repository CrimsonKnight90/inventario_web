# ============================================================
# Archivo: backend/auditoria/routes/auditoria_proveedores.py
# Descripción: Rutas de consulta para auditoría de proveedores
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.db.session import get_db
from backend.auditoria.models.proveedor_auditoria import ProveedorAuditoria
from backend.auditoria.schemas.proveedor_auditoria import ProveedorAuditoriaRead
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message

router = APIRouter(prefix="/auditoria/proveedores", tags=["Auditoría Proveedores"])

# 🔹 Listar registros de auditoría de proveedores
@router.get("/", response_model=List[ProveedorAuditoriaRead], dependencies=[Depends(require_admin)])
def listar_auditoria_proveedores(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    proveedor_id: Optional[int] = Query(None, description="Filtrar por ID de proveedor"),
    usuario_id: Optional[int] = Query(None, description="Filtrar por ID de usuario"),
    accion: Optional[str] = Query(None, description="Filtrar por acción (crear, actualizar, desactivar, reactivar)"),
    limit: int = Query(100, ge=1, le=500, description="Número máximo de registros a devolver"),
    offset: int = Query(0, ge=0, description="Desplazamiento para paginación"),
) -> List[ProveedorAuditoria]:
    """
    Devuelve registros de auditoría de proveedores con filtros opcionales.
    Solo accesible para administradores.
    """
    query = db.query(ProveedorAuditoria)

    if proveedor_id:
        query = query.filter(ProveedorAuditoria.proveedor_id == proveedor_id)
    if usuario_id:
        query = query.filter(ProveedorAuditoria.usuario_id == usuario_id)
    if accion:
        query = query.filter(ProveedorAuditoria.accion == accion)

    resultados = query.order_by(ProveedorAuditoria.fecha.desc()).offset(offset).limit(limit).all()
    return resultados

# 🔹 Obtener un registro específico de auditoría
@router.get("/{auditoria_id}", response_model=ProveedorAuditoriaRead, dependencies=[Depends(require_admin)])
def obtener_auditoria_proveedor(
    auditoria_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
) -> ProveedorAuditoria:
    """
    Devuelve un registro específico de auditoría de proveedores.
    Solo accesible para administradores.
    """
    registro = db.query(ProveedorAuditoria).filter(ProveedorAuditoria.id == auditoria_id).first()
    if not registro:
        raise HTTPException(status_code=404, detail=get_message("auditoria_no_encontrada", lang))
    return registro
