@echo off
echo Cerrando backend (uvicorn), frontend (vite) y ventanas CMD abiertas...

:: Cierra procesos de Python (backend)
taskkill /F /IM python.exe /T >nul 2>&1

:: Cierra procesos de Node.js (frontend)
taskkill /F /IM node.exe /T >nul 2>&1

:: Cierra las ventanas cmd abiertas por start_all.bat
taskkill /F /IM cmd.exe /T >nul 2>&1

echo Todo detenido y ventanas cerradas.
