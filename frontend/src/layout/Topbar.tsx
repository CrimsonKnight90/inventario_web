// ============================================================
// Archivo: frontend/src/layout/Topbar.tsx
// Descripción: Barra superior con breadcrumb completamente corregido
// Autor: CrimsonKnight90
// ============================================================

import { Link, useLocation } from "react-router-dom";
import { routes, AppRoute } from "@app/routes";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@store/auth.store";
import { useBranding } from "@hooks/useConfig";
import { useMemo } from "react";

/**
 * Busca recursivamente la ruta activa y construye el breadcrumb.
 * COMPLETAMENTE CORREGIDO: Manejo robusto de rutas anidadas
 */
function findBreadcrumbs(pathname: string, routes: AppRoute[]): AppRoute[] {
  // Función recursiva mejorada
  const findRecursive = (currentRoutes: AppRoute[], currentPath: string): AppRoute[] => {
    for (const route of currentRoutes) {
      // Caso 1: Coincidencia exacta de ruta
      if (route.path === currentPath) {
        return route.breadcrumb ? [route] : [];
      }

      // Caso 2: Ruta padre con hijos - verificar si la ruta actual empieza con la ruta padre
      if (route.children && route.path !== "/" && currentPath.startsWith(route.path)) {
        const childMatch = findRecursive(route.children, currentPath);
        if (childMatch.length > 0) {
          // Solo incluir la ruta padre si tiene breadcrumb
          if (route.breadcrumb) {
            return [route, ...childMatch];
          }
          return childMatch;
        }
      }

      // Caso 3: Ruta raíz especial
      if (route.path === "/" && route.breadcrumb && currentPath === "/") {
        return [route];
      }
    }
    return [];
  };

  const result = findRecursive(routes, pathname);

  // Si no encontramos breadcrumbs pero estamos en la raíz, buscar ruta raíz
  if (result.length === 0 && pathname === "/") {
    const rootRoute = routes.find(route => route.path === "/" && route.breadcrumb);
    return rootRoute ? [rootRoute] : [];
  }

  return result;
}

export const Topbar = () => {
  const userEmail = useAuthStore((s) => s.user?.email);
  const logout = useAuthStore((s) => s.logout);
  const branding = useBranding();

  const location = useLocation();
  const { t } = useTranslation();

  // Memoizar el breadcrumb para evitar recálculos innecesarios
  const breadcrumbs = useMemo(() => {
    return findBreadcrumbs(location.pathname, routes);
  }, [location.pathname]);

  // Debug
  console.log('Current path:', location.pathname);
  console.log('Breadcrumbs:', breadcrumbs.map(bc => ({
    path: bc.path,
    breadcrumb: bc.breadcrumb
  })));

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

        {/* Separador visual entre logo y breadcrumb - solo mostrar si hay breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="h-6 w-px bg-[var(--color-border)]"></div>
        )}

        <nav className="flex items-center space-x-2 text-sm text-[var(--color-text-secondary)]">
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((bc, idx) => (
              <span key={bc.path || `breadcrumb-${idx}`} className="flex items-center">
                {idx > 0 && <span className="mx-2 text-[var(--color-muted)]">/</span>}
                {idx < breadcrumbs.length - 1 && bc.path ? (
                  <Link
                    to={bc.path}
                    className="hover:underline hover:text-[var(--color-text)] transition-colors"
                  >
                    {t(bc.breadcrumb || 'nav.untitled')}
                  </Link>
                ) : (
                  <span className="font-semibold text-[var(--color-text)]">
                    {t(bc.breadcrumb || 'nav.untitled')}
                  </span>
                )}
              </span>
            ))
          ) : (
            // Fallback si no hay breadcrumbs
            <span className="text-[var(--color-text)] font-semibold">
              {branding.appName}
            </span>
          )}
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