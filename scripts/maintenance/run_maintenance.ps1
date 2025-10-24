# Ruta: scripts/maintenance/run_maintenance.ps1
param(
  [int]$BatchSize = 10,
  [int]$LockKey = 123456789,
  [string]$ProjectRoot = ""
)

# Detectar raíz del proyecto
if (-not $ProjectRoot -or $ProjectRoot -eq "") {
  $scriptPath = $MyInvocation.MyCommand.Definition
  $scriptDir = Split-Path -Parent $scriptPath
  # si este script está en scripts/maintenance, la raíz es dos niveles arriba
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

# Preparar entorno
$projRoot = $ProjectRoot
$env:PYTHONPATH = $projRoot

# Comprobar python y psql (si no están en PATH, recomendar ruta absoluta)
$pythonCmd = (Get-Command python -ErrorAction SilentlyContinue).Source
if (-not $pythonCmd) {
  Write-Warning "python no encontrado en PATH. Si falla, edita este script y asigna la ruta completa a python.exe en la variable \$pythonCmd."
  $pythonCmd = "python"
}
$psqlCmd = (Get-Command psql -ErrorAction SilentlyContinue).Source
if (-not $psqlCmd) {
  Write-Warning "psql no encontrado en PATH. El chequeo opcional de audit_log se omitirá si psql no está disponible."
}

# Rutas basadas en la raíz detectada
$logDir = Join-Path $projRoot "logs"
if (!(Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

$script = Join-Path $projRoot "scripts\maintenance\archive_and_purge.py"
if (!(Test-Path $script)) {
  Write-Error "No se encontró el script de mantenimiento: $script"
  exit 2
}

$timestamp = (Get-Date).ToString("yyyyMMdd_HHmmss")
$log = Join-Path $logDir "maintenance_run_$timestamp.log"

# Ejecuta el job y captura salida
& $pythonCmd $script --commit --batch-size $BatchSize --lock-key $LockKey > $log 2>&1
$exit = $LASTEXITCODE

# Opcional: leer último summary del audit_log y fallar si errors > 0 (solo si psql disponible)
if ($psqlCmd) {
  try {
    $audit = & $psqlCmd -h 127.0.0.1 -p 5432 -U postgres -d inventario -t -c "SELECT changes->>'errors' FROM audit_log WHERE entity_name='maintenance_job' ORDER BY occurred_at DESC LIMIT 1;" 2>$null
    if ($audit) {
      $errors = $audit.Trim()
      if ($errors -ne "" -and [int]$errors -gt 0) {
        Write-Output "Maintenance completed but errors > 0 (errors=$errors). Revisa $log"
        exit 2
      }
    }
  } catch {
    Write-Warning "Fallo al consultar audit_log con psql. Revisar manualmente $log"
  }
}

if ($exit -ne 0) {
  Write-Output "Maintenance failed (exit $exit). Revisa el log: $log"
  exit $exit
}

Write-Output "Maintenance finished successfully. Log: $log"
exit 0
