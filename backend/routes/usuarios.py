# ============================================================
# Archivo: backend/routes/usuarios.py
# Descripción: Endpoints de gestión de usuarios para el panel admin (con i18n)
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend.security.auth import hash_password
from backend.db.session import get_db
from backend import models
from backend.schemas.usuario import UsuarioCreate, UsuarioRead, UsuarioUpdateRole
from backend.i18n.messages import get_message

router = APIRouter(prefix="/usuarios", tags=["usuarios"])

# Listar todos los usuarios
@router.get("/", response_model=List[UsuarioRead])
def listar_usuarios(db: Session = Depends(get_db)):
    usuarios = db.query(models.Usuario).all()
    return [
        UsuarioRead(
            id=u.id,
            nombre=u.nombre,
            email=u.email,
            role=u.role,
        )
        for u in usuarios
    ]

# Crear un nuevo usuario
@router.post("/", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
def crear_usuario(payload: UsuarioCreate, db: Session = Depends(get_db), lang: str = "es"):
    existente = db.query(models.Usuario).filter(models.Usuario.email == payload.email).first()
    if existente:
        raise HTTPException(status_code=400, detail=get_message("usuario_existente", lang))

    # Validar rol
    if payload.role not in ["empleado", "admin"]:
        raise HTTPException(status_code=400, detail=get_message("invalid_role", lang))

    nuevo = models.Usuario(
        nombre=payload.nombre,
        email=payload.email,
        password=hash_password(payload.password),  # ✅ se guarda hasheada
        role=payload.role,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return UsuarioRead(
        id=nuevo.id,
        nombre=nuevo.nombre,
        email=nuevo.email,
        role=nuevo.role,
    )

# Actualizar rol de un usuario
@router.put("/{usuario_id}/rol", response_model=UsuarioRead)
def actualizar_rol(usuario_id: int, payload: UsuarioUpdateRole, db: Session = Depends(get_db), lang: str = "es"):
    usuario = db.query(models.Usuario).get(usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail=get_message("user_not_found", lang))

    if payload.role not in ["empleado", "admin"]:
        raise HTTPException(status_code=400, detail=get_message("invalid_role", lang))

    usuario.role = payload.role
    db.commit()
    db.refresh(usuario)

    return UsuarioRead(
        id=usuario.id,
        nombre=usuario.nombre,
        email=usuario.email,
        role=usuario.role,
    )

# Eliminar usuario
@router.delete("/{usuario_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_usuario(usuario_id: int, db: Session = Depends(get_db), lang: str = "es"):
    usuario = db.query(models.Usuario).get(usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail=get_message("user_not_found", lang))

    db.delete(usuario)
    db.commit()
    return None
