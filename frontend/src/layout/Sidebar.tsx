// ============================================================
// Archivo: frontend/src/layout/Sidebar.tsx
// Descripción: Sidebar que solo muestra el grupo padre si la ruta
//              actual pertenece a su sección o si el usuario lo abrió.
// Autor: CrimsonKnight90
// ============================================================

import { NavLink, useLocation } from "react-router-dom";
import { routes, AppRoute } from "@app/routes";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";

const makeAbsolute = (parentPath: string, childPath: string) => {
  if (!childPath) return parentPath;
  if (childPath.startsWith("/")) return childPath;
  const parent = parentPath.endsWith("/") ? parentPath.replace(/\/$/, "") : parentPath;
  const child = childPath.startsWith("/") ? childPath.replace(/^\//, "") : childPath;
  return `${parent}/${child}`;
};

export const Sidebar = () => {
  const [open, setOpen] = useState<string | null>(null);
  const { t } = useTranslation();
  const location = useLocation();
  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  // Abrir automáticamente el grupo padre si la ruta actual está dentro de sus hijos
  useEffect(() => {
    for (const r of routes) {
      if (!r.private) continue;
      const routeTo = r.path.startsWith("/") ? r.path : `/${r.path.replace(/^\//, "")}`;
      if (currentPath === routeTo || currentPath.startsWith(`${routeTo}/`)) {
        setOpen(r.path);
        return;
      }
    }
    // no forzar cierre aquí (permite que usuario mantenga su elección)
  }, [currentPath]);

  const renderRoute = (route: AppRoute) => {
    const routeTo = route.path.startsWith("/") ? route.path : `/${route.path.replace(/^\//, "")}`;
    const isSectionActive = currentPath === routeTo || currentPath.startsWith(`${routeTo}/`);

    // Mostrar padre solo si pertenece a la sección activa o el usuario lo abrió
    const shouldShowParent = isSectionActive || open === route.path;

    if (!shouldShowParent) return null;

    if (route.children && route.children.length > 0) {
      const isOpen = open === route.path;

      return (
        <div key={routeTo}>
          <button
            onClick={() => setOpen(isOpen ? null : route.path)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded text-sm font-medium ${
              isSectionActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center gap-2">
              {route.icon}
              {t(route.breadcrumb!)}
            </span>
            <span>{isOpen ? "▾" : "▸"}</span>
          </button>

          {isOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {route.children.map((child) => {
                const childTo = makeAbsolute(routeTo, child.path);
                return (
                  <NavLink
                    key={childTo}
                    to={childTo}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-2 rounded text-sm ${
                        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    {child.icon}
                    {t(child.breadcrumb!)}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={routeTo}
        to={routeTo}
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${
            isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        {route.icon}
        {t(route.breadcrumb!)}
      </NavLink>
    );
  };

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
      <nav className="flex flex-col p-4 space-y-2">
        {routes.filter((r) => r.private && r.breadcrumb).map(renderRoute)}
      </nav>
    </aside>
  );
};
