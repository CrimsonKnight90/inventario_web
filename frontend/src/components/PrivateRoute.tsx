// ============================================================
// Archivo: frontend/src/components/PrivateRoute.tsx
// Descripción: Componente HOC para proteger rutas privadas.
//              CORREGIDO: Optimizado para funcionar con rutas
//              anidadas y roles opcionales.
// Autor: CrimsonKnight90
// ============================================================

import { type PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@store/auth.store";

type PrivateRouteProps = {
  roles?: string[];
};

export const PrivateRoute = ({
  children,
  roles
}: PropsWithChildren<PrivateRouteProps>) => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isTokenValid = useAuthStore((s) => s.isTokenValid);

  const location = useLocation();

  // ✅ Validar token
  if (!token || !isTokenValid()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Validar roles solo si se especificaron
  if (roles && roles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRole = roles.some((requiredRole) =>
      userRoles.includes(requiredRole)
    );

    if (!hasRole) {
      console.warn(
        `Usuario sin permisos. Roles requeridos: ${roles.join(", ")}`
      );
      // ✅ Redirigir a dashboard en lugar de loop infinito
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};