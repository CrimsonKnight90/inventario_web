from fastapi import FastAPI
from backend.db.session import engine
from backend.db import base  # importa Base para que Alembic detecte los modelos
from backend.routes import productos, usuarios, categorias, movimientos, empresas
from sqlalchemy import text

app = FastAPI(
    title="Inventario Web 🚀",
    version="0.2",
    description="Sistema de inventario adaptable a cualquier empresa"
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
app.include_router(productos.router)
app.include_router(usuarios.router)
app.include_router(categorias.router)
app.include_router(movimientos.router)
app.include_router(empresas.router)
