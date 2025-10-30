// ============================================================
// Archivo: frontend/src/layout/Layout.tsx
// Descripción: Layout principal OPTIMIZADO para evitar renderizados
//              innecesarios y mejorar el rendimiento.
// Autor: CrimsonKnight90
// ============================================================

import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";
import { memo } from "react";

/**
 * Layout optimizado con memo para evitar renderizados innecesarios
 */
export const Layout = memo(() => {
  return (
    <div className="flex flex-col h-screen">
      {/* Topbar fijo */}
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fijo debajo del Topbar */}
        <Sidebar />

        {/* Contenido scrollable - Solo usa Outlet */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
});

Layout.displayName = "Layout";