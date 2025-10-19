# ============================================================
# Archivo: backend/auditoria/utils_proveedor.py
# Descripción: Funciones utilitarias para registrar auditoría de proveedores
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy.orm import Session
from backend.auditoria.models.proveedor_auditoria import ProveedorAuditoria

def registrar_auditoria_proveedor(
    db: Session,
    proveedor_id: int,
    usuario_id: int | None,
    accion: str,
    valores_anteriores: dict | None = None,
    valores_nuevos: dict | None = None,
):
    """
    Registra un evento de auditoría para un proveedor.

    Args:
        db (Session): Sesión de base de datos.
        proveedor_id (int): ID del proveedor afectado.
        usuario_id (int | None): ID del usuario que ejecuta la acción.
        accion (str): Acción realizada (crear, actualizar, desactivar, reactivar).
        valores_anteriores (dict | None): Estado previo del proveedor.
        valores_nuevos (dict | None): Estado posterior del proveedor.
    """
    log = ProveedorAuditoria(
        proveedor_id=proveedor_id,
        usuario_id=usuario_id,
        accion=accion,
        valores_anteriores=valores_anteriores,
        valores_nuevos=valores_nuevos,
    )
    db.add(log)
    db.commit()
