// ============================================================
// Archivo: frontend/src/layout/Topbar.tsx
// Descripción: Barra superior con logo dinámico desde config.
//              ACTUALIZADO: Usa el logo del store de configuración.
// Autor: CrimsonKnight90
// ============================================================

import { Link, useLocation } from "react-router-dom";
import { routes, AppRoute } from "@app/routes";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@store/auth.store";
import { useBranding } from "@hooks/useConfig";

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
  const userEmail = useAuthStore((s) => s.user?.email);
  const logout = useAuthStore((s) => s.logout);
  const branding = useBranding();

  const location = useLocation();
  const { t } = useTranslation();

  const breadcrumbs = findBreadcrumbs(location.pathname, routes);

  return (
    <header className="flex items-center justify-between bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-2 shadow-sm">
      {/* Sección izquierda: Logo + Breadcrumb */}
      <div className="flex items-center space-x-4">
        <img
          src={branding.logoUrl}
          alt={branding.appName}
          className="h-8 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.src = "/assets/logo.svg";
          }}
        />
        <nav className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)]">
          {breadcrumbs.map((bc, idx) => (
            <span key={bc.path} className="flex items-center">
              {idx > 0 && <span className="mx-1">/</span>}
              {idx < breadcrumbs.length - 1 ? (
                <Link
                  to={bc.path}
                  className="hover:underline hover:text-[var(--color-text)]"
                >
                  {t(bc.breadcrumb!)}
                </Link>
              ) : (
                <span className="font-semibold text-[var(--color-text)]">
                  {t(bc.breadcrumb!)}
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Sección derecha: Usuario + Logout */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-[var(--color-text)]">
          {userEmail || "Usuario"}
        </span>
        <button
          onClick={logout}
          className="text-sm bg-[var(--color-danger)] text-white px-3 py-1 rounded hover:bg-[var(--color-danger-hover)] transition-colors"
        >
          {t("nav.logout")}
        </button>
      </div>
    </header>
  );
};