from fastapi import APIRouter

# Aggregator router exported for the application to include once.
router = APIRouter()

# Import routers from individual modules under src.app.api.routes
# Cada módulo debe exponer un APIRouter llamado `router`.
from src.app.api.routes import alerts as alerts_mod
from src.app.api.routes import audit as audit_mod
from src.app.api.routes import auth as auth_mod
from src.app.api.routes import categories as categories_mod
from src.app.api.routes import inventory as inventory_mod
from src.app.api.routes import movements as movements_mod
from src.app.api.routes import products as products_mod
from src.app.api.routes import reports as reports_mod
from src.app.api.routes import reservations as reservations_mod
from src.app.api.routes import units as units_mod

# Incluir routers de cada módulo en el agregador
for sub in (
    alerts_mod,
    audit_mod,
    auth_mod,
    categories_mod,
    inventory_mod,
    movements_mod,
    products_mod,
    reports_mod,
    reservations_mod,
    units_mod,
):
    if hasattr(sub, "router"):
        router.include_router(sub.router)
    else:
        raise ImportError(f"Module {sub.__name__} must expose an APIRouter named 'router'")
