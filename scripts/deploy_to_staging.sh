#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   DATABASE_URL="postgresql+asyncpg://user:pass@host:5432/inventario_staging" ./scripts/deploy_to_staging.sh

: "${DATABASE_URL:?Set DATABASE_URL e.g. postgresql+asyncpg://user:pass@host:5432/dbname}"
export DATABASE_URL

# 1) Install venv if not present
if [ ! -d ".venv" ]; then
  python -m venv .venv
fi
# shellcheck source=/dev/null
. .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt
pip install alembic asyncpg pytest pytest-asyncio httpx

# 2) Apply migrations
echo "[1/4] Applying Alembic migrations..."
alembic upgrade head

# 3) Run seeds (idempotent)
echo "[2/4] Running seed scripts..."
python scripts/seed_roles_and_catalogs.py
python scripts/seed_initial_data.py || true

# 4) Smoke tests (critical flows)
echo "[3/4] Running critical tests..."
pytest -q tests/test_auth_flow.py tests/test_reservation_integration.py tests/test_end_to_end.py

echo "[4/4] Deployment to staging verification complete."
