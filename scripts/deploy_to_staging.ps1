<#
.SYNOPSIS
  Deploy verification script for staging on Windows/PowerShell.

.DESCRIPTION
  Applies alembic migrations, runs idempotent seed scripts and executes critical tests.
  Designed for use from the repository root in a developer machine running PowerShell.

.USAGE
  $env:DATABASE_URL = "postgresql+asyncpg://user:pass@host:5432/inventario_staging"
  .\scripts\deploy_to_staging.ps1
#>

param(
    [switch]$InstallDeps = $true,
    [string]$VenvPath = ".\venv310"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Ensure run from repo root (where this script resides)
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
Set-Location -Path $scriptDir
Set-Location -Path ..

# Activate virtualenv (create if missing)
if (-not (Test-Path -Path $VenvPath)) {
    Write-Host "Virtualenv not found at $VenvPath. Creating..."
    python -m venv $VenvPath
}

# Adjust activation command for PowerShell
$activateScript = Join-Path $VenvPath "Scripts\Activate.ps1"
if (-not (Test-Path -Path $activateScript)) {
    throw "Activation script not found at $activateScript"
}

# Allow running activation for this process
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force

Write-Host "Activating virtual environment: $VenvPath"
& $activateScript

# Install dependencies if requested
if ($InstallDeps) {
    Write-Host "Installing dependencies..."
    python -m pip install --upgrade pip
    if (Test-Path -Path "requirements.txt") {
        pip install -r requirements.txt
    }
    pip install alembic asyncpg pytest pytest-asyncio httpx
}

# Validate DATABASE_URL env var
if (-not $env:DATABASE_URL) {
    throw "Environment variable DATABASE_URL is not set. Example: $env:DATABASE_URL = 'postgresql+asyncpg://user:pass@host:5432/dbname'"
}

# 1) Apply Alembic migrations
Write-Host "[1/4] Applying Alembic migrations..."
& alembic upgrade head

# 2) Run seed scripts (idempotent)
Write-Host "[2/4] Running seed scripts..."
if (Test-Path -Path ".\scripts\seed_roles_and_catalogs.py") {
    & python .\scripts\seed_roles_and_catalogs.py
} else {
    Write-Host "Warning: scripts/seed_roles_and_catalogs.py not found"
}
if (Test-Path -Path ".\scripts\seed_initial_data.py") {
    & python .\scripts\seed_initial_data.py
} else {
    Write-Host "Warning: scripts/seed_initial_data.py not found"
}

# 3) Run critical smoke tests
Write-Host "[3/4] Running critical tests..."
$tests = @(
    "tests/test_auth_flow.py",
    "tests/test_reservation_integration.py",
    "tests/test_end_to_end.py"
)
$existing = $tests | Where-Object { Test-Path -Path $_ }
if ($existing.Count -eq 0) {
    Write-Host "No focused tests found; running full test suite (may take longer)..."
    & pytest -q
} else {
    & pytest -q $existing
}

# 4) Final status
Write-Host "[4/4] Staging deploy verification complete."
