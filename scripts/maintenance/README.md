# 🛠️ Mantenimiento y Archivado de Datos

Este directorio contiene los scripts de mantenimiento del sistema de inventario.  
Su objetivo es **archivar registros antiguos** en tablas `_archive`, mantener las tablas activas livianas y garantizar trazabilidad en `audit_log`.

---

## 📂 Scripts principales

- **`run_maintenance.ps1`**  
  Ejecuta el job de archivado manualmente.  
  - Parámetros:
    - `-BatchSize`: cantidad máxima de registros a mover por tabla en cada iteración (default: 50).  
    - `-LockKey`: clave de bloqueo para evitar ejecuciones concurrentes.  
    - `-ProjectRoot`: raíz del proyecto (detectada automáticamente si no se pasa).  
  - Ejemplo:
    ```powershell
    powershell -File .\scripts\maintenance\run_maintenance.ps1 -BatchSize 100
    ```

- **`install_tasks.ps1`**  
  Instala las tareas programadas en Windows Task Scheduler.  
  - Crea:
    - `InventoryMaintenance_Weekly`: corre el job cada lunes a las 03:00.  
    - `InventoryMaintenance_RotateLogs_Daily`: rota logs cada día a las 03:30.  
  - Ejemplo:
    ```powershell
    .\scripts\maintenance\install_tasks.ps1 -BatchSize 50
    ```

- **`rotate_maintenance_logs.ps1`**  
  Elimina logs antiguos.  
  - Parámetros:
    - `-DaysToKeep`: días de retención (default: 30).  
  - Ejemplo:
    ```powershell
    powershell -File .\scripts\maintenance\rotate_maintenance_logs.ps1 -DaysToKeep 7
    ```

---

## 📑 Orden de archivado
El job mueve datos en este orden para evitar errores de FK:  
**Reservation → Movement → Serial → Batch**

---

## ⏳ Criterios de corte
Un registro se archiva si:
- Tiene `deleted_at` definido.  
- Su antigüedad supera el umbral:
  - Reservation ≥ 2 años  
  - Movement ≥ 3 años  
  - Serial ≥ 3 años  
  - Batch ≥ 5 años  

---

## 📜 Logs
Cada corrida genera un archivo en `logs/maintenance_run_YYYYMMDD_HHMMSS.log`.  
Contiene:
- IDs movidos por tabla.  
- Totales procesados.  
- Errores (si los hubiera).  

Ejemplo:
```
Moved serial ids (batch): [...]
Moved batch ids (batch): [...]
Maintenance finished: totals={'reservation': 0, 'movement': 0, 'serial': 994, 'batch': 100}
```

---

## 🗂️ Audit Log
Cada corrida inserta un registro en `audit_log` con:
- `entity_name = 'maintenance_job'`  
- `occurred_at`: fecha/hora de ejecución.  
- `changes`: JSON con métricas (`moved_reservations`, `moved_movements`, `moved_serials`, `moved_batches`, `errors`).  

Consulta rápida:
```sql
SELECT occurred_at,
       changes->>'moved_reservations' AS reservations,
       changes->>'moved_movements'    AS movements,
       changes->>'moved_serials'      AS serials,
       changes->>'moved_batches'      AS batches,
       changes->>'errors'             AS errors
FROM audit_log
WHERE entity_name='maintenance_job'
ORDER BY occurred_at DESC
LIMIT 5;
```

---

## ✅ Checklist de validación
- [ ] Revisar que las tareas estén registradas en Task Scheduler (`schtasks /Query`).  
- [ ] Confirmar que se generan logs en `logs/`.  
- [ ] Validar que `audit_log` registra cada corrida.  
- [ ] Verificar que `activos + archivados = total histórico`.  
- [ ] Confirmar que no hay huérfanos en `_archive`.  

---