# ============================================================
# Archivo: backend/routes/config.py
# Descripción: Endpoints para configuración de branding (nombre, logo, colores)
# Autor: CrimsonKnight90
# ============================================================

import os, shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.schemas.config import ConfigOut, ConfigUpdate
from backend.crud import config as crud_config

router = APIRouter()

# Carpeta donde se guardan los logos
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ------------------------------------------------------------
# Leer configuración
# ------------------------------------------------------------
@router.get("/config", response_model=ConfigOut)
def read_config(db: Session = Depends(get_db)):
    cfg = crud_config.get_config(db)
    if not cfg:
        return {
            "app_name": "Inventario Pro",
            "logo_url": "/uploads/logo.png",
            "primary_color": "#1E293B",
            "secondary_color": "#3B82F6",
            "background_color": "#F8FAFC",
            "topbar_color": "#0F172A"  # 🔹 Nuevo
        }
    return cfg


# ------------------------------------------------------------
# Actualizar configuración (parcial)
# ------------------------------------------------------------
@router.put("/config", response_model=ConfigOut)
def update_config(config_in: ConfigUpdate, db: Session = Depends(get_db)):
    # Actualiza campos parciales y devuelve el registro resultante
    return crud_config.update_config(db, config_in)


# ------------------------------------------------------------
# Subir logo y actualizar configuración
# ------------------------------------------------------------
@router.post("/config/logo", response_model=ConfigOut)
async def upload_logo(
        file: UploadFile = File(...),
        db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Solo se permiten imágenes")

    # Guardar siempre como logo.png en uploads
    file_path = os.path.join(UPLOAD_DIR, "logo.png")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # URL accesible desde el frontend
    new_url = "/uploads/logo.png"

    # Actualizar en DB usando ConfigUpdate (no dict) y devolver el objeto completo
    config_in = ConfigUpdate(logo_url=new_url)
    updated = crud_config.update_config(db, config_in)
    return updated
