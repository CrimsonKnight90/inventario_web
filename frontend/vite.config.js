// ============================================================
// Archivo: frontend/vite.config.js
// Descripción: Configuración de Vite con React y proxy hacia el backend FastAPI
// Autor: CrimsonKnight90
// ============================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige todas las peticiones a /uploads hacia el backend
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Si quieres también redirigir la API:
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
