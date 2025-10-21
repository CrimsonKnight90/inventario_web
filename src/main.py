# src/main.py
import os
import sys
import asyncio

# Asegurar que el paquete src esté en sys.path cuando ejecutes desde la raíz
ROOT = os.path.dirname(__file__)
sys.path.append(ROOT)

# Forzar selector en Windows para evitar errores IOCP/WinError64 con asyncpg
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importa el router agregado que exporta todos los routers de src.app.api.routes
from src.app.api.routes import router as api_router

app = FastAPI(
    title="Enterprise Inventory System",
    version="1.0.0",
    description="Multi-warehouse, multi-purpose inventory management API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajustar en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar router agregado (contendrá subrouters como /products, /inventory, etc.)
app.include_router(api_router)


@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok"}
