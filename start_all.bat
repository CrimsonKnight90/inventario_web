@echo off
start cmd /k "cd /d C:\Estudio\inventario_web && call venv310\Scripts\activate && uvicorn backend.main:app --reload --port 8000"
start cmd /k "cd /d C:\Estudio\inventario_web\frontend && npm run dev"
