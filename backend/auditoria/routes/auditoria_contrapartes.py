# // ============================================================
# // Archivo: backend/auditoria/routes/auditoria_contrapartes.py
# // Descripción: Endpoints para consultar auditoría de contrapartes
# // Autor: CrimsonKnight90
# // ============================================================

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import get_db
from backend.auditoria.models.contraparte_auditoria import ContraparteAuditoria
from backend.auditoria.schemas.contraparte_auditoria import ContraparteAuditoriaRead
from backend.security.deps import get_current_user

router = APIRouter(prefix="/auditoria/contrapartes", tags=["Auditoría Contrapartes"])

@router.get("/", response_model=List[ContraparteAuditoriaRead])
def listar_auditoria_contrapartes(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(ContraparteAuditoria).order_by(ContraparteAuditoria.fecha.desc()).all()
