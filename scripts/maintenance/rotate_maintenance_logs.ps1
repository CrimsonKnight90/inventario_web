# Ruta: scripts/maintenance/rotate_maintenance_logs.ps1
param(
  [int]$DaysToKeep = 30,
  [string]$ProjectRoot = ""
)

# Detectar raíz del proyecto si no se pasa explícitamente
if (-not $ProjectRoot -or $ProjectRoot -eq "") {
  $scriptPath = $MyInvocation.MyCommand.Definition
  $scriptDir = Split-Path -Parent $scriptPath
  $detectedRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
  if (Test-Path $detectedRoot) {
    $ProjectRoot = $detectedRoot
  } elseif ($env:PROJ_ROOT -and (Test-Path $env:PROJ_ROOT)) {
    $ProjectRoot = $env:PROJ_ROOT
  } else {
    Write-Error "No se pudo determinar la raíz del proyecto. Pase -ProjectRoot o defina la variable de entorno PROJ_ROOT."
    exit 2
  }
}

$logDir = Join-Path $ProjectRoot "logs"
if (!(Test-Path $logDir)) { Exit 0 }

Get-ChildItem -Path $logDir -Filter "maintenance_run_*.log" | Where-Object {
  $_.LastWriteTime -lt (Get-Date).AddDays(-$DaysToKeep)
} | ForEach-Object {
  try {
    Remove-Item $_.FullName -Force
  } catch {
    Write-Warning "Could not remove log file: $($_.FullName) - $($_.Exception.Message)"
  }
}
