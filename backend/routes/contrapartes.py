# // ============================================================
# // Archivo: backend/routes/contrapartes.py
# // Descripción: Rutas CRUD para Contrapartes contables con validaciones, soft delete e i18n consistente ({code, message})
# // Autor: CrimsonKnight90
# // ============================================================

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import get_db
from backend.models.contraparte import Contraparte
from backend.schemas.contraparte import ContraparteCreate, ContraparteRead, ContraparteUpdate
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message
from backend.auditoria.utils_contraparte import registrar_auditoria_contraparte

router = APIRouter(prefix="/contrapartes", tags=["Contrapartes"])


# Crear
@router.post("/", response_model=ContraparteRead, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(require_admin)])
def crear_contraparte(
        payload: ContraparteCreate,
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    existe_cuenta = db.query(Contraparte).filter(Contraparte.cuentacont == payload.cuentacont).first()
    if existe_cuenta:
        raise HTTPException(400, detail={"code": "contraparte_existente",
                                         "message": get_message("contraparte_existente", lang)})

    existe_nombre = db.query(Contraparte).filter(Contraparte.nomcont == payload.nomcont).first()
    if existe_nombre:
        raise HTTPException(400, detail={"code": "contraparte_existente",
                                         "message": get_message("contraparte_existente", lang)})

    nueva = Contraparte(**payload.dict(), activo=True)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)

    registrar_auditoria_contraparte(
        db=db,
        cuentacont=nueva.cuentacont,
        usuario_id=current_user.id,
        accion="crear",
        valores_nuevos=payload.dict()
    )

    # 🔹 IMPORTANTE: devolver la entidad creada
    return nueva


# Listar
@router.get("/", response_model=List[ContraparteRead])
def listar_contrapartes(
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        incluir_inactivos: bool = Query(False, description="Incluir contrapartes inactivas")
):
    query = db.query(Contraparte)
    if not incluir_inactivos:
        query = query.filter(Contraparte.activo == True)
    return query.order_by(Contraparte.cuentacont.asc()).all()


# Obtener una
@router.get("/{cuentacont}", response_model=ContraparteRead)
def obtener_contraparte(
        cuentacont: str,
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    contraparte = db.query(Contraparte).filter(Contraparte.cuentacont == cuentacont).first()
    if not contraparte:
        raise HTTPException(404, detail={"code": "contraparte_no_encontrada",
                                         "message": get_message("contraparte_no_encontrada", lang)})
    return contraparte


# Actualizar
@router.put("/{cuentacont}", response_model=ContraparteRead, dependencies=[Depends(require_admin)])
def actualizar_contraparte(
        cuentacont: str,
        payload: ContraparteUpdate,
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    contraparte = db.query(Contraparte).filter(Contraparte.cuentacont == cuentacont).first()
    if not contraparte:
        raise HTTPException(404, detail={"code": "contraparte_no_encontrada",
                                         "message": get_message("contraparte_no_encontrada", lang)})

    if payload.nomcont and payload.nomcont != contraparte.nomcont:
        existe_nombre = db.query(Contraparte).filter(Contraparte.nomcont == payload.nomcont).first()
        if existe_nombre:
            raise HTTPException(400, detail={"code": "contraparte_existente",
                                             "message": get_message("contraparte_existente", lang)})

    for k, v in payload.dict(exclude_unset=True, exclude_none=True).items():
        setattr(contraparte, k, v)

    db.commit()
    db.refresh(contraparte)
    return contraparte


# Desactivar
@router.patch("/{cuentacont}/desactivar", dependencies=[Depends(require_admin)])
def desactivar_contraparte(
        cuentacont: str,
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    contraparte = db.query(Contraparte).filter(Contraparte.cuentacont == cuentacont).first()
    if not contraparte:
        raise HTTPException(404, detail={"code": "contraparte_no_encontrada",
                                         "message": get_message("contraparte_no_encontrada", lang)})
    if not contraparte.activo:
        return {"code": "contraparte_ya_desactivada", "message": get_message("contraparte_ya_desactivada", lang)}

    contraparte.activo = False
    db.commit()
    return {"code": "contraparte_desactivada_ok", "message": get_message("contraparte_desactivada_ok", lang)}


# Reactivar
@router.patch("/{cuentacont}/reactivar", dependencies=[Depends(require_admin)])
def reactivar_contraparte(
        cuentacont: str,
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    contraparte = db.query(Contraparte).filter(Contraparte.cuentacont == cuentacont).first()
    if not contraparte:
        raise HTTPException(404, detail={"code": "contraparte_no_encontrada",
                                         "message": get_message("contraparte_no_encontrada", lang)})
    if contraparte.activo:
        return {"code": "contraparte_ya_activa", "message": get_message("contraparte_ya_activa", lang)}

    contraparte.activo = True
    db.commit()
    return {"code": "contraparte_reactivada_ok", "message": get_message("contraparte_reactivada_ok", lang)}


# Check duplicado (cuenta o denominación)
@router.get("/check")
def check_contraparte(
        cuentacont: str | None = Query(None, description="Cuenta contable (formato 000-00-00-00)"),
        nomcont: str | None = Query(None, description="Nombre contable"),
        db: Session = Depends(get_db),
        current_user: Usuario = Depends(get_current_user),
        lang: str = "es"
):
    if cuentacont:
        cuentacont = cuentacont.strip()
        existe_cuenta = db.query(Contraparte).filter(Contraparte.cuentacont == cuentacont).first()
        if existe_cuenta:
            return {"exists": True, "field": "cuentacont", "code": "contraparte_existente",
                    "message": get_message("contraparte_existente", lang)}
    if nomcont:
        nomcont = nomcont.strip()
        existe_nombre = db.query(Contraparte).filter(Contraparte.nomcont == nomcont).first()
        if existe_nombre:
            return {"exists": True, "field": "nomcont", "code": "contraparte_existente",
                    "message": get_message("contraparte_existente", lang)}
    return {"exists": False}
