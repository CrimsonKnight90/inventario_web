# ============================================================
# Archivo: backend/main.py
# Descripción: Punto de entrada de la API FastAPI
# Autor: CrimsonKnight90
# ============================================================

from fastapi import FastAPI
from backend.db.session import engine
from backend.db import base  # importa Base para que Alembic detecte los modelos
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from backend.i18n.messages import get_message  # 🔹 nuevo módulo de mensajes

# Routers existentes
from backend.routes import (
    productos, usuarios, categorias, movimientos,
    auth, actividades, actividades_cerradas
)

# Nuevos routers
from backend.routes import (
    proveedores, documentos, tipos_documentos, um, monedas,
    centros_costo, consumos, contrapartes, combinaciones
)

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
    allow_origins=["http://localhost:5173"],  # o ["*"] durante desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
