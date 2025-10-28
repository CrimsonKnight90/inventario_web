// src/app/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@store/auth.store";
import { Layout } from "@layout/Layout";
import { PrivateRoute } from "@components/PrivateRoute";
import { routes, AppRoute } from "@app/routes";
import { ReactElement, useEffect } from "react";

/**
 * Renderiza una ruta y sus posibles subrutas de forma recursiva.
 */
function renderRoute(route: AppRoute): ReactElement {
  const { path, element, private: isPrivate, roles, children } = route;

  const wrappedElement = isPrivate ? (
    <PrivateRoute roles={roles}>
      <Layout>{element}</Layout>
    </PrivateRoute>
  ) : (
    element
  );

  return (
    <Route key={path} path={path} element={wrappedElement}>
      {children && children.map(renderRoute)}
    </Route>
  );
}

/**
 * App principal: define las rutas a partir de la configuración centralizada.
 */
export default function App(): ReactElement {
  // ✅ Usar selectores separados para evitar renders infinitos
  const token = useAuthStore((state) => state.token);
  const restoreFromStorage = useAuthStore((state) => state.restoreFromStorage);

  // Restaurar sesión solo una vez al montar la App
  useEffect(() => {
    restoreFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      {routes.map(renderRoute)}

      {/* Redirección por defecto */}
      <Route
        path="/"
        element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}
