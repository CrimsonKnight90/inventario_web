// ============================================================
// Archivo: frontend/src/components/PrivateRoute.tsx
// Descripción: Componente HOC para proteger rutas privadas.
//              CORREGIDO: Valida expiración de token y roles
//              de forma más robusta.
// Autor: CrimsonKnight90
// ============================================================

import { type PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@store/auth.store";

type PrivateRouteProps = {
  roles?: string[];
};

export const PrivateRoute = ({ children, roles }: PropsWithChildren<PrivateRouteProps>) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isTokenValid = useAuthStore((s) => s.isTokenValid);

  const location = useLocation();

  // Validar token
  if (!token || !isTokenValid()) {
    console.warn("Token inválido o expirado. Redirigiendo a /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Validar roles si están definidos
  if (roles && roles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRole = roles.some((requiredRole) => userRoles.includes(requiredRole));

    if (!hasRole) {
      console.warn(`Usuario sin permisos. Roles requeridos: ${roles.join(", ")}`);
      return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};