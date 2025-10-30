// ============================================================
// Archivo: frontend/src/layout/Layout.tsx
// Descripción: Layout principal CORREGIDO para usar Outlet
//              correctamente sin conflictos con children.
// Autor: CrimsonKnight90
// ============================================================

import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

/**
 * ✅ ELIMINADO PropsWithChildren - no se necesita
 * El Layout ya no recibe children, solo usa <Outlet />
 */
export const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Topbar fijo */}
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fijo debajo del Topbar */}
        <Sidebar />

        {/* Contenido scrollable - ✅ SOLO usa Outlet */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};