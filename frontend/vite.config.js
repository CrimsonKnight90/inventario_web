// ============================================================
// Archivo: frontend/vite.config.js
// Descripción: Configuración de Vite con React y proxy hacia el backend FastAPI.
//              Incluye proxy para /uploads, /config y /api en entorno de desarrollo.
// Autor: CrimsonKnight90
// ============================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Definir target base para evitar repetición
const API_TARGET = 'http://localhost:8000'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige todas las peticiones a /uploads hacia el backend
      '/uploads': {
        target: API_TARGET,
        changeOrigin: true,
      },
      // Redirige todas las peticiones a /config hacia el backend
      '/config': {
        target: API_TARGET,
        changeOrigin: true,
      },
      // Redirige todas las peticiones a /api hacia el backend
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        // Opcional: reescribir la ruta para que el backend no necesite /api
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
