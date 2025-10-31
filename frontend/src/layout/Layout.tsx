//============================================================
// Archivo: src/layout/Layout.tsx
// Descripción: Componente principal de layout que estructura la
//              aplicación con Sidebar, Topbar y área de contenido.
//              Maneja el responsive design y la navegación.
// Autor: CrimsonKnight90
//============================================================

import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSidebar } from '../hooks/useConfig';

/**
 * Componente Layout principal
 *
 * Estructura:
 * - Sidebar (colapsable)
 * - Topbar (fijo en la parte superior)
 * - Área de contenido (con Outlet de React Router)
 *
 * Responsabilidades:
 * - Gestionar la estructura visual de la aplicación
 * - Manejar el estado del sidebar (colapsado/expandido)
 * - Adaptar el layout a diferentes tamaños de pantalla
 * - Proporcionar contexto para navegación
 */
const Layout: React.FC = () => {
  const { isSidebarCollapsed, setSidebarCollapsed } = useSidebar();

  /**
   * Efecto para manejar el responsive del sidebar
   * En pantallas pequeñas, el sidebar se colapsa automáticamente
   */
  useEffect(() => {
    const handleResize = () => {
      // En pantallas menores a 1024px (lg breakpoint), colapsar sidebar
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    // Ejecutar al montar
    handleResize();

    // Listener para cambios de tamaño
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setSidebarCollapsed]);

  /**
   * Prevenir scroll cuando el sidebar está abierto en móvil
   */
  useEffect(() => {
    if (!isSidebarCollapsed && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Overlay para móvil cuando el sidebar está abierto */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Contenedor principal */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        {/* Topbar */}
        <Topbar />

        {/* Área de contenido principal */}
        <main className="min-h-[calc(100vh-64px)] pt-16">
          {/* Outlet de React Router - aquí se renderizarán las páginas */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;