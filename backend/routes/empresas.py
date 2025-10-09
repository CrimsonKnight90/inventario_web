# ============================================================
# Archivo: backend/routes/empresas.py
# Descripción: Endpoints de gestión de empresas para el panel admin
# Autor: CrimsonKnight90
# ============================================================

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.db.session import get_db
from backend.models.empresa import Empresa
from backend.schemas.empresa import EmpresaCreate, EmpresaRead
from backend.security.deps import get_current_user, require_admin
from backend.models.usuario import Usuario
from backend.schemas.usuario import UsuarioRead

router = APIRouter(prefix="/empresas", tags=["Empresas"])

# 🔹 Crear empresa (solo admin)
@router.post("/", response_model=EmpresaRead, dependencies=[Depends(require_admin)])
def crear_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    # Validar duplicados por nombre
    existente = db.query(Empresa).filter(Empresa.nombre == empresa.nombre).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe una empresa con ese nombre")

    nueva = Empresa(**empresa.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)

    return EmpresaRead(
        id=nueva.id,
        nombre=nueva.nombre,
        direccion=nueva.direccion,
        telefono=nueva.telefono,
        usuarios=[]  # recién creada, no tiene usuarios aún
    )

# 🔹 Listar empresas (cualquier usuario autenticado)
@router.get("/", response_model=List[EmpresaRead])
def listar_empresas(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    empresas = db.query(Empresa).all()
    return [
        EmpresaRead(
            id=e.id,
            nombre=e.nombre,
            direccion=e.direccion,
            telefono=e.telefono,
            usuarios=[
                UsuarioRead(
                    id=u.id,
                    nombre=u.nombre,
                    email=u.email,
                    role=u.role,
                    empresa_id=u.empresa_id,
                    empresa_nombre=e.nombre
                )
                for u in e.usuarios
            ]
        )
        for e in empresas
    ]

# 🔹 Actualizar empresa (solo admin)
@router.put("/{empresa_id}", response_model=EmpresaRead, dependencies=[Depends(require_admin)])
def actualizar_empresa(empresa_id: int, datos: EmpresaCreate, db: Session = Depends(get_db)):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")

    # Validar duplicados (si cambia el nombre)
    existente = db.query(Empresa).filter(
        Empresa.nombre == datos.nombre,
        Empresa.id != empresa_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ya existe otra empresa con ese nombre")

    for key, value in datos.dict().items():
        setattr(empresa, key, value)
    db.commit()
    db.refresh(empresa)

    return EmpresaRead(
        id=empresa.id,
        nombre=empresa.nombre,
        direccion=empresa.direccion,
        telefono=empresa.telefono,
        usuarios=[
            UsuarioRead(
                id=u.id,
                nombre=u.nombre,
                email=u.email,
                role=u.role,
                empresa_id=u.empresa_id,
                empresa_nombre=empresa.nombre
            )
            for u in empresa.usuarios
        ]
    )

# 🔹 Eliminar empresa (solo admin)
@router.delete("/{empresa_id}", dependencies=[Depends(require_admin)])
def eliminar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    db.delete(empresa)
    db.commit()
    return {"detail": "Empresa eliminada correctamente"}
