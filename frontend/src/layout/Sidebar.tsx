// src/layout/Sidebar.tsx

import { NavLink } from "react-router-dom";
import { routes, AppRoute } from "@app/routes";
import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Sidebar dinámico con soporte para submenús.
 * - Usa el campo `breadcrumb` como clave de traducción.
 */
export const Sidebar = () => {
  const [open, setOpen] = useState<string | null>(null);
  const { t } = useTranslation();

  const renderRoute = (route: AppRoute) => {
    if (route.children && route.children.length > 0) {
      const isOpen = open === route.path;
      return (
        <div key={route.path}>
          <button
            onClick={() => setOpen(isOpen ? null : route.path)}
            className="flex items-center justify-between w-full px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="flex items-center gap-2">
              {route.icon}
              {t(route.breadcrumb!)}
            </span>
            <span>{isOpen ? "▾" : "▸"}</span>
          </button>
          {isOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {route.children.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded text-sm ${
                      isActive
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  {child.icon}
                  {t(child.breadcrumb!)}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={route.path}
        to={route.path}
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${
            isActive
              ? "bg-blue-100 text-blue-700"
              : "text-gray-700 hover:bg-gray-100"
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
