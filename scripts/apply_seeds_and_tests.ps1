<#
.SYNOPSIS
  Apply idempotent seeds and run critical integration tests against the active DATABASE_URL.

.DESCRIPTION
  Use this after migrations are green (staging or production as appropriate). Validates seeds run idempotently,
  then executes focused integration smoke tests. Intended to be run from the repository root in PowerShell
  with the appropriate virtualenv already activated.

.USAGE
  # Example:
  $env:DATABASE_URL = "postgresql+asyncpg://postgres:pass@localhost:5432/inventario_staging"
  .\scripts\apply_seeds_and_tests.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Ensure script runs from repo root
$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
Set-Location -Path $scriptDir
Set-Location -Path ..

if (-not $env:DATABASE_URL) {
    throw "DATABASE_URL is not set. Set $env:DATABASE_URL before running this script."
}

Write-Host "DATABASE_URL = $env:DATABASE_URL"

# 1) OPTIONAL: reapply migrations as a safety step (no-op if already up-to-date)
Write-Host "[1/3] Applying Alembic migrations (safety)..."
& alembic upgrade head

# 2) Run seed scripts (idempotent)
Write-Host "[2/3] Running idempotent seed scripts..."
$seedScripts = @(
    ".\scripts\seed_roles_and_catalogs.py",
    ".\scripts\seed_initial_data.py"
)
foreach ($s in $seedScripts) {
    if (Test-Path -Path $s) {
        Write-Host "Executing $s"
        & python $s
    } else {
        Write-Host "Skipping missing seed script: $s"
    }
}

# 3) Run focused integration tests (smoke)
Write-Host "[3/3] Running focused integration tests..."
$tests = @(
    "tests/test_auth_flow.py",
    "tests/test_reservation_integration.py",
    "tests/test_end_to_end.py"
)
$existing = $tests | Where-Object { Test-Path -Path $_ }
if ($existing.Count -eq 0) {
    Write-Host "No focused tests found; running full test suite"
    & pytest -q
} else {
    & pytest -q $existing
}

Write-Host "Seeds and tests complete."
