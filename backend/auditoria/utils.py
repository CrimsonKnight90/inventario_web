# ============================================================
# Archivo: backend/auditoria/utils.py
# Descripción: Funciones utilitarias para registrar auditoría
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy.orm import Session
from backend.auditoria.models.producto_auditoria import ProductoAuditoria

def registrar_auditoria(
    db: Session,
    producto_id: int,
    usuario_id: int | None,
    accion: str,
    valores_anteriores: dict | None = None,
    valores_nuevos: dict | None = None,
):
    """
    Registra un evento de auditoría para un producto.

    Args:
        db (Session): Sesión de base de datos.
        producto_id (int): ID del producto afectado.
        usuario_id (int | None): ID del usuario que ejecuta la acción.
        accion (str): Acción realizada (crear, actualizar, desactivar, reactivar).
        valores_anteriores (dict | None): Estado previo del producto.
        valores_nuevos (dict | None): Estado posterior del producto.
    """
    log = ProductoAuditoria(
        producto_id=producto_id,
        usuario_id=usuario_id,
        accion=accion,
        valores_anteriores=valores_anteriores,
        valores_nuevos=valores_nuevos,
    )
    db.add(log)
    db.commit()
