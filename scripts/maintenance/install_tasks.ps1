# scripts/maintenance/install_tasks.ps1
param(
  [string]$ProjectRoot = "",
  [int]$BatchSize = 50,
  [int]$LockKey = 123456789,
  [string]$TaskName = "InventoryMaintenance_Weekly",
  [string]$RotateTaskName = "InventoryMaintenance_RotateLogs_Daily",
  [string]$ScheduleTime = "03:00"
)

# Determinar ProjectRoot si no se pasó
if (-not $ProjectRoot -or $ProjectRoot -eq "") {
  $scriptPath = $MyInvocation.MyCommand.Definition
  $scriptDir = Split-Path -Parent $scriptPath
  $detectedRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
  if (Test-Path $detectedRoot) {
    $ProjectRoot = $detectedRoot
  } elseif ($env:PROJ_ROOT -and (Test-Path $env:PROJ_ROOT)) {
    $ProjectRoot = $env:PROJ_ROOT
  } else {
    Write-Error "Project root no encontrado. Pase -ProjectRoot o defina PROJ_ROOT."
    exit 2
  }
}

# Paths
$RunScript = Join-Path $ProjectRoot "scripts\maintenance\run_maintenance.ps1"
$RotateScript = Join-Path $ProjectRoot "scripts\maintenance\rotate_maintenance_logs.ps1"

# 1) Validaciones mínimas y creación de directorios
if (!(Test-Path $ProjectRoot)) {
  Write-Error "Project root no encontrado: $ProjectRoot"
  exit 2
}

$logDir = Join-Path $ProjectRoot "logs"
if (!(Test-Path $logDir)) {
  New-Item -ItemType Directory -Path $logDir | Out-Null
  Write-Output "Creado log dir: $logDir"
}

# 2) Crear run_maintenance.ps1 si no existe (wrapper que usa detección automática)
if (!(Test-Path $RunScript)) {
  $runContent = @"
param(
  [int]`$BatchSize = $BatchSize,
  [int]`$LockKey = $LockKey,
  [string]`$ProjectRoot = ""
)

# Este wrapper delega la detección de ruta en run_maintenance.ps1 real (misma ruta)
# Ejecuta el script principal desde la ubicación detectada
`$scriptPath = `$(Join-Path (Split-Path -Parent `$MyInvocation.MyCommand.Definition) 'run_maintenance.ps1')
if (Test-Path `$scriptPath) {
  & powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -File `$scriptPath -BatchSize `$BatchSize -LockKey `$LockKey -ProjectRoot `$ProjectRoot
  exit `$LASTEXITCODE
} else {
  Write-Error 'No se encontró run_maintenance.ps1 en la misma carpeta.'
  exit 2
}
"@
  $runContent | Out-File -FilePath $RunScript -Encoding UTF8
  Write-Output "Se creó wrapper run_maintenance.ps1 en $RunScript"
}

# 3) Crear rotate_maintenance_logs.ps1 si no existe (usa detección)
if (!(Test-Path $RotateScript)) {
  $rotContent = @"
param([int]`$DaysToKeep = 30, [string]`$ProjectRoot = "")
# Detección simple: la implementación real se encuentra en rotate_maintenance_logs.ps1 original
# Si aquí se ejecuta, intenta borrar logs en ../logs
`$scriptDir = Split-Path -Parent `$MyInvocation.MyCommand.Definition
`$defaultRoot = Split-Path -Parent (Split-Path -Parent `$scriptDir)
`$root = if (`$ProjectRoot -and (Test-Path `$ProjectRoot)) { `$ProjectRoot } elseif (Test-Path `$defaultRoot) { `$defaultRoot } else { Write-Warning 'No se encontró root'; exit 0 }
Get-ChildItem -Path (Join-Path `$root 'logs') -Filter 'maintenance_run_*.log' -ErrorAction SilentlyContinue | Where-Object { `$_.LastWriteTime -lt (Get-Date).AddDays(-`$DaysToKeep) } | Remove-Item -Force -ErrorAction SilentlyContinue
"@
  $rotContent | Out-File -FilePath $RotateScript -Encoding UTF8
  Write-Output "Se creó rotate_maintenance_logs.ps1 en $RotateScript"
}

# 4) Crear la tarea semanal usando schtasks como SYSTEM
$timeParts = $ScheduleTime.Split(":")
$hour = [int]$timeParts[0]
$minute = [int]$timeParts[1]
$timeArg = "{0:D2}:{1:D2}" -f $hour, $minute

# Comando que ejecutará la tarea (PowerShell wrapper con parámetros)
$action = "powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File `"$RunScript`" -BatchSize $BatchSize -LockKey $LockKey -ProjectRoot `"$ProjectRoot`""

$schtasksCreate = @(
  '/Create',
  '/RU', 'SYSTEM',
  '/SC', 'WEEKLY',
  '/D', 'MON',
  '/ST', $timeArg,
  '/TN', $TaskName,
  '/TR', $action,
  '/F'
) -join ' '

Write-Output "Creando tarea programada: $TaskName (hora: $timeArg, usuario: SYSTEM)..."
Start-Process -FilePath schtasks.exe -ArgumentList $schtasksCreate -NoNewWindow -Wait

# 5) Crear tarea diaria para rotar logs a las 03:30
$rotAction = "powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File `"$RotateScript`" -DaysToKeep 30 -ProjectRoot `"$ProjectRoot`""
$schtasksCreateRot = @(
  '/Create',
  '/RU', 'SYSTEM',
  '/SC', 'DAILY',
  '/ST', '03:30',
  '/TN', $RotateTaskName,
  '/TR', $rotAction,
  '/F'
) -join ' '
Write-Output "Creando tarea de rotación de logs: $RotateTaskName ..."
Start-Process -FilePath schtasks.exe -ArgumentList $schtasksCreateRot -NoNewWindow -Wait

# 6) Probar ejecución inmediata de la tarea recién creada (Run once)
Write-Output "Ejecutando la tarea una vez para validar (Run) ..."
Start-Process -FilePath schtasks.exe -ArgumentList "/Run /TN `"$TaskName`"" -NoNewWindow -Wait
Start-Sleep -Seconds 6

# 7) Mostrar estado de la tarea
Write-Output "Listado de tareas registradas (filtrando por nombre)..."
schtasks /Query /TN $TaskName /V /FO LIST

Write-Output "Instalación completada. Revisa logs en $logDir para la ejecución inicial."
