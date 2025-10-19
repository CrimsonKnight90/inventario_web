# // ============================================================
# // Archivo: backend/auditoria/utils_contraparte.py
# // Descripción: Funciones utilitarias para registrar auditoría de contrapartes
# // Autor: CrimsonKnight90
# // ============================================================

from sqlalchemy.orm import Session
from backend.auditoria.models.contraparte_auditoria import ContraparteAuditoria

def registrar_auditoria_contraparte(
    db: Session,
    cuentacont: str,
    usuario_id: int | None,
    accion: str,
    valores_anteriores: dict | None = None,
    valores_nuevos: dict | None = None,
):
    """
    Registra un evento de auditoría para una contraparte.
    """
    log = ContraparteAuditoria(
        cuentacont=cuentacont,
        usuario_id=usuario_id,
        accion=accion,
        valores_anteriores=valores_anteriores,
        valores_nuevos=valores_nuevos,
    )
    db.add(log)
    db.commit()
