// src/components/PrivateRoute.tsx
import { type PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@store/auth.store";

type PrivateRouteProps = {
  roles?: string[];
};

export const PrivateRoute = ({ children, roles }: PropsWithChildren<PrivateRouteProps>) => {
  // ✅ Selectores por clave: evitan objetos nuevos en cada render
  const token = useAuthStore((s) => s.token);
  const user  = useAuthStore((s) => s.user);

  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const hasRole = user?.roles?.some((r) => roles.includes(r));
    if (!hasRole) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};
