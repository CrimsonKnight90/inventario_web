# ============================================================
# Archivo: backend/routes/movimientos.py
# Descripción: Rutas para gestión de movimientos de inventario (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.db.session import get_db
from backend.models.movimiento import Movimiento
from backend.models.producto import Producto
from backend.schemas.movimiento import MovimientoCreate, MovimientoRead
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.i18n.messages import get_message

router = APIRouter(prefix="/movimientos", tags=["Movimientos"])
