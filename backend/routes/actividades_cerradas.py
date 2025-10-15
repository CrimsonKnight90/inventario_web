# ============================================================
# Archivo: backend/routers/actividades_cerradas.py
# Descripción: Rutas FastAPI para actividades cerradas (CRUD) con i18n
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.db.session import get_db
from backend.models.actividad_cerrada import ActividadCerrada
from backend.schemas.actividad_cerrada import (
    ActividadCerradaCreate,
    ActividadCerradaRead,
)
from backend.i18n.messages import get_message

router = APIRouter(prefix="/actividades-cerradas", tags=["actividades-cerradas"])


@router.get("/", response_model=List[ActividadCerradaRead])
def listar_actividades_cerradas(db: Session = Depends(get_db)):
    return db.query(ActividadCerrada).order_by(ActividadCerrada.id.desc()).all()


@router.get("/{id}", response_model=ActividadCerradaRead)
def obtener_actividad_cerrada(id: int, db: Session = Depends(get_db), lang: str = "es"):
    actividad = db.query(ActividadCerrada).get(id)
    if not actividad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=get_message("actividad_cerrada_no_encontrada", lang)
        )
    return actividad


@router.post("/", response_model=ActividadCerradaRead, status_code=status.HTTP_201_CREATED)
def crear_actividad_cerrada(payload: ActividadCerradaCreate, db: Session = Depends(get_db)):
    nueva = ActividadCerrada(**payload.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


@router.put("/{id}", response_model=ActividadCerradaRead)
def actualizar_actividad_cerrada(id: int, payload: ActividadCerradaCreate, db: Session = Depends(get_db), lang: str = "es"):
    actividad = db.query(ActividadCerrada).get(id)
    if not actividad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=get_message("actividad_cerrada_no_encontrada", lang)
        )

    for campo, valor in payload.dict().items():
        setattr(actividad, campo, valor)

    db.commit()
    db.refresh(actividad)
    return actividad


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_actividad_cerrada(id: int, db: Session = Depends(get_db), lang: str = "es"):
    actividad = db.query(ActividadCerrada).get(id)
    if not actividad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=get_message("actividad_cerrada_no_encontrada", lang)
        )

    db.delete(actividad)
    db.commit()
    return None
