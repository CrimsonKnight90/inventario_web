// src/layout/Topbar.tsx

import { Link, useLocation } from "react-router-dom";
import { routes, AppRoute } from "@app/routes";
import logo from "@branding/logo.svg";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@store/auth.store";

/**
 * Busca recursivamente la ruta activa y construye el breadcrumb.
 */
function findBreadcrumbs(pathname: string, routes: AppRoute[]): AppRoute[] {
  for (const route of routes) {
    if (route.path === pathname) {
      return [route];
    }
    if (route.children) {
      const childMatch = findBreadcrumbs(pathname, route.children);
      if (childMatch.length > 0) {
        return [route, ...childMatch];
      }
    }
  }
  return [];
}

export const Topbar = () => {
  // ✅ Selectores por clave: evitan objetos nuevos en cada render y bucles con Zustand
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const location = useLocation();
  const { t } = useTranslation();

  const breadcrumbs = findBreadcrumbs(location.pathname, routes);

  return (
    <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2 shadow-sm">
      {/* Sección izquierda: Logo + Breadcrumb */}
      <div className="flex items-center space-x-4">
        <img src={logo} alt="Logo" className="h-8 w-8" />
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          {breadcrumbs.map((bc, idx) => (
            <span key={bc.path} className="flex items-center">
              {idx > 0 && <span className="mx-1">/</span>}
              {idx < breadcrumbs.length - 1 ? (
                <Link to={bc.path} className="hover:underline">
                  {t(bc.breadcrumb!)}
                </Link>
              ) : (
                <span className="font-semibold text-gray-800">
                  {t(bc.breadcrumb!)}
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Sección derecha: Usuario + Logout */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">{user?.email}</span>
        <button
          onClick={logout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          {t("auth.logout")}
        </button>
      </div>
    </header>
  );
};
