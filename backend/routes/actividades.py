# ============================================================
# Archivo: backend/routes/actividades.py
# Descripción: Endpoints de gestión y listados de actividades
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend import models
from backend.schemas.actividad import ActividadCreate, ActividadRead
from backend.schemas.actividad_cerrada import ActividadCerradaBase, ActividadCerradaRead

router = APIRouter(prefix="/actividades", tags=["actividades"])

# Crear actividad
@router.post("/", response_model=ActividadRead)
def crear_actividad(actividad: ActividadCreate, db: Session = Depends(get_db)):
    nueva = models.Actividad(**actividad.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# Listar todas
@router.get("/", response_model=list[ActividadRead])
def listar_actividades(db: Session = Depends(get_db)):
    return db.query(models.Actividad).all()

# Listar solo creadas (abiertas)
@router.get("/creadas", response_model=list[ActividadRead])
def listar_actividades_creadas(db: Session = Depends(get_db)):
    return db.query(models.Actividad).filter(models.Actividad.actcerrada == False).all()

# Listar solo cerradas
@router.get("/cerradas", response_model=list[ActividadRead])
def listar_actividades_cerradas(db: Session = Depends(get_db)):
    return db.query(models.Actividad).filter(models.Actividad.actcerrada == True).all()

# Cerrar actividad
@router.post("/{codact}/cerrar", response_model=ActividadCerradaRead)
def cerrar_actividad(
    codact: int,
    payload: ActividadCerradaBase,
    db: Session = Depends(get_db)
):
    actividad = db.query(models.Actividad).filter(models.Actividad.codact == codact).first()
    if not actividad:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Actividad no encontrada")

    if actividad.actcerrada:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La actividad ya está cerrada")

    # Marcar como cerrada
    actividad.actcerrada = True
    db.add(actividad)

    # Filtrar campos que ya se pasan explícitamente para evitar duplicados
    payload_filtered = payload.dict(
        exclude_unset=True,
        exclude={"codact", "nomact", "fechaini", "fechafin"}
    )

    # Crear registro en actividades_cerradas
    cerrada = models.ActividadCerrada(
        codact=actividad.codact,
        nomact=actividad.nomact,
        fechaini=actividad.fechaini,
        fechafin=actividad.fechafin,
        **payload_filtered,
    )
    db.add(cerrada)
    db.commit()
    db.refresh(cerrada)

    return cerrada
