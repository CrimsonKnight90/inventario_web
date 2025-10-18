# ============================================================
# Archivo: backend/auditoria/routes/auditoria_productos.py
# Descripción: Rutas de consulta para auditoría de productos
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.db.session import get_db
from backend.auditoria.models.producto_auditoria import ProductoAuditoria
from backend.auditoria.schemas.producto_auditoria import ProductoAuditoriaRead
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message

router = APIRouter(prefix="/auditoria/productos", tags=["Auditoría Productos"])

# 🔹 Listar registros de auditoría de productos
@router.get("/", response_model=List[ProductoAuditoriaRead], dependencies=[Depends(require_admin)])
def listar_auditoria_productos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    producto_id: Optional[int] = Query(None, description="Filtrar por ID de producto"),
    usuario_id: Optional[int] = Query(None, description="Filtrar por ID de usuario"),
    accion: Optional[str] = Query(None, description="Filtrar por acción (crear, actualizar, desactivar, reactivar)"),
    limit: int = Query(100, ge=1, le=500, description="Número máximo de registros a devolver"),
    offset: int = Query(0, ge=0, description="Desplazamiento para paginación"),
) -> List[ProductoAuditoria]:
    """
    Devuelve registros de auditoría de productos con filtros opcionales.
    Solo accesible para administradores.
    """
    query = db.query(ProductoAuditoria)

    if producto_id:
        query = query.filter(ProductoAuditoria.producto_id == producto_id)
    if usuario_id:
        query = query.filter(ProductoAuditoria.usuario_id == usuario_id)
    if accion:
        query = query.filter(ProductoAuditoria.accion == accion)

    resultados = query.order_by(ProductoAuditoria.fecha.desc()).offset(offset).limit(limit).all()
    return resultados

# 🔹 Obtener un registro específico de auditoría
@router.get("/{auditoria_id}", response_model=ProductoAuditoriaRead, dependencies=[Depends(require_admin)])
def obtener_auditoria_producto(
    auditoria_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    lang: str = "es"
) -> ProductoAuditoria:
    """
    Devuelve un registro específico de auditoría de productos.
    Solo accesible para administradores.
    """
    registro = db.query(ProductoAuditoria).filter(ProductoAuditoria.id == auditoria_id).first()
    if not registro:
        raise HTTPException(status_code=404, detail=get_message("auditoria_no_encontrada", lang))
    return registro
