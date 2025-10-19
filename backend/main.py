# ============================================================
# Archivo: backend/main.py
# Descripción: Punto de entrada de la API FastAPI con routers, CORS,
#              middleware de idioma y soporte para servir archivos estáticos (/uploads)
# Autor: CrimsonKnight90
# ============================================================

import os
from fastapi import FastAPI, Request
from backend.db.session import engine
from backend.db import base  # importa Base para que Alembic detecte los modelos
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.i18n.messages import get_message

# Routers existentes
from backend.routes import (
    productos, usuarios, categorias, movimientos,
    auth, actividades, actividades_cerradas
)

# Nuevos routers
from backend.routes import (
    proveedores, documentos, tipos_documentos, um, monedas,
    centros_costo, consumos, contrapartes, combinaciones,
    config
)

# 🔹 Routers de auditoría
from backend.auditoria.routes import auditoria_productos
from backend.auditoria.routes import auditoria_proveedores
from backend.auditoria.routes import auditoria_centros_costo
from backend.auditoria.routes import auditoria_contrapartes

app = FastAPI(
    title="Inventario Web 🚀",
    version="0.3",
    description="Sistema de inventario adaptable a cualquier empresa, con soporte de vales y comprobantes"
)

# ------------------------------------------------------------
# Middleware de idioma
# ------------------------------------------------------------
@app.middleware("http")
async def add_language_to_request(request: Request, call_next):
    lang = request.headers.get("Accept-Language", "es")
    request.state.lang = lang if lang in ["es", "en"] else "es"
    response = await call_next(request)
    return response

# ------------------------------------------------------------
# Configuración de CORS
# ------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],  # o ["*"] durante desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------
# Servir archivos estáticos (logos, uploads)
# ------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")

# Crear carpeta uploads si no existe
os.makedirs(UPLOADS_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# ------------------------------------------------------------
# Endpoints básicos
# ------------------------------------------------------------
@app.get("/")
def read_root(request: Request):
    return {"message": get_message("welcome", request.state.lang)}

@app.get("/ping-db")
def ping_db():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1")).scalar()
        return {"db_connection": bool(result)}

# ------------------------------------------------------------
# Registrar routers
# ------------------------------------------------------------
# Core
app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(usuarios.router)
app.include_router(categorias.router)
app.include_router(movimientos.router)
app.include_router(actividades.router)
app.include_router(actividades_cerradas.router)

# Nuevos módulos
app.include_router(proveedores.router)
app.include_router(documentos.router)
app.include_router(tipos_documentos.router)
app.include_router(um.router)
app.include_router(monedas.router)
app.include_router(centros_costo.router)
app.include_router(consumos.router)
app.include_router(contrapartes.router)
app.include_router(combinaciones.router)
app.include_router(config.router, tags=["config"])

# 🔹 Auditoría
app.include_router(auditoria_productos.router, tags=["Auditoría Productos"])
app.include_router(auditoria_proveedores.router, tags=["Auditoría Proveedores"])
app.include_router(auditoria_centros_costo.router, tags=["Auditoría Centros de Costo"])
app.include_router(auditoria_contrapartes.router, tags=["Auditoría Contrapartes"])