# src/app/api/routes/__init__.py
from fastapi import APIRouter

# Aggregator router exported for the application to include once.
router = APIRouter()

# Import routers from individual modules under src.app.api.routes
# NOTE: import names must match the router names exported by each module.
# If a module uses a different router variable name, adapt the import accordingly.

# Example files present in your project tree under src/app/api/routes:
# alerts.py, audit.py, auth.py, inventory.py, movements.py,
# pruducts.py (note: filename spelling preserved), reports.py, reservations.py

# Import each router and include it under the aggregator.
# Each module must expose a FastAPI APIRouter instance named `router`.
from src.app.api.routes import alerts as alerts_mod
from src.app.api.routes import audit as audit_mod
from src.app.api.routes import auth as auth_mod
from src.app.api.routes import inventory as inventory_mod
from src.app.api.routes import movements as movements_mod
from src.app.api.routes import pruducts as pruducts_mod  # filename 'pruducts.py' preserved
from src.app.api.routes import reports as reports_mod
from src.app.api.routes import reservations as reservations_mod

# Include routers from modules (they should already define prefixes)
for sub in (
    alerts_mod,
    audit_mod,
    auth_mod,
    inventory_mod,
    movements_mod,
    pruducts_mod,
    reports_mod,
    reservations_mod,
):
    # Each module should expose `router` variable (APIRouter)
    if hasattr(sub, "router"):
        router.include_router(sub.router)
    else:
        raise ImportError(f"Module {sub.__name__} must expose an APIRouter named 'router'")
