# ============================================================
# Archivo: backend/auditoria/utils_centro_costo.py
# Descripción: Funciones utilitarias para registrar auditoría de Centros de Costo
# Autor: CrimsonKnight90
# ============================================================

from sqlalchemy.orm import Session
from backend.auditoria.models.centro_costo_auditoria import CentroCostoAuditoria

def registrar_auditoria_centro_costo(
    db: Session,
    cuentacc: str,
    usuario_id: int | None,
    accion: str,
    valores_anteriores: dict | None = None,
    valores_nuevos: dict | None = None,
):
    """
    Registra un evento de auditoría para un centro de costo.
    """
    log = CentroCostoAuditoria(
        cuentacc=cuentacc,
        usuario_id=usuario_id,
        accion=accion,
        valores_anteriores=valores_anteriores,
        valores_nuevos=valores_nuevos,
    )
    db.add(log)
    db.commit()
