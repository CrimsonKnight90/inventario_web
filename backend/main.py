from fastapi import FastAPI
from backend.db.session import engine
from backend.db import base  # importa Base para que Alembic detecte los modelos
from backend.routes import productos, usuarios, categorias, movimientos, empresas, auth
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Inventario Web 🚀",
    version="0.2",
    description="Sistema de inventario adaptable a cualquier empresa"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # o ["*"] durante desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint raíz
@app.get("/")
def read_root():
    return {"message": "Bienvenido al sistema de Inventario Web 🚀"}

# Endpoint para probar conexión a DB
@app.get("/ping-db")
def ping_db():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1")).scalar()
        return {"db_connection": bool(result)}

# Registrar routers
app.include_router(auth.router)
app.include_router(productos.router)
app.include_router(usuarios.router)
app.include_router(categorias.router)
app.include_router(movimientos.router)
app.include_router(empresas.router)
