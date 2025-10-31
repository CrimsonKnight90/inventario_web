//============================================================
// Archivo: src/app/main.tsx
// Descripción: Punto de entrada principal de la aplicación React.
//              Configura el renderizado raíz y envuelve la app con
//              StrictMode para detectar problemas potenciales.
// Autor: CrimsonKnight90
//============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Asegúrate de tener Tailwind configurado aquí

/**
 * Punto de entrada principal de la aplicación
 *
 * Consideraciones de seguridad:
 * - StrictMode ayuda a identificar problemas potenciales
 * - Validación del elemento root antes del renderizado
 *
 * Consideraciones de rendimiento:
 * - Usa createRoot de React 18+ para concurrent rendering
 * - StrictMode solo afecta en desarrollo
 */

// Validación de seguridad: verificar que el elemento root existe
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Error crítico: No se encontró el elemento root en el DOM. ' +
    'Verifica que index.html contenga un div con id="root"'
  );
}

// Crear la raíz de React con manejo de errores
try {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Error al inicializar la aplicación:', error);

  // Mostrar mensaje de error al usuario
  rootElement.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      font-family: system-ui, -apple-system, sans-serif;
      background-color: #fee;
      color: #c00;
    ">
      <h1 style="font-size: 2rem; margin-bottom: 1rem;">Error de Inicialización</h1>
      <p style="font-size: 1rem; text-align: center; max-width: 600px;">
        Lo sentimos, la aplicación no pudo iniciarse correctamente.
        Por favor, recarga la página o contacta al administrador del sistema.
      </p>
      <pre style="
        margin-top: 1rem;
        padding: 1rem;
        background-color: #fff;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        overflow-x: auto;
        max-width: 800px;
      ">${error instanceof Error ? error.message : 'Error desconocido'}</pre>
    </div>
  `;
}