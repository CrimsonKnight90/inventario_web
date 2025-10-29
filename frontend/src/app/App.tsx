// src/app/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@store/auth.store";
import { Layout } from "@layout/Layout";
import { PrivateRoute } from "@components/PrivateRoute";
import { routes, AppRoute } from "@app/routes";
import { ReactElement, useEffect } from "react";
import LoginPage from "@pages/Login.page"; // Importar LoginPage

/**
 * Renderiza una ruta y sus posibles subrutas de forma recursiva.
 * VERSIÓN PLANA: No hay anidamiento, por lo que no se usan children.
 */
function renderRoute(route: AppRoute): ReactElement {
  const { path, element, private: isPrivate, roles } = route;

  const wrappedElement = isPrivate ? (
    <PrivateRoute roles={roles}>
      <Layout>{element}</Layout>
    </PrivateRoute>
  ) : (
    element
  );

  return (
    <Route key={path} path={path} element={wrappedElement} />
  );
}

/**
 * App principal: define las rutas a partir de la configuración centralizada.
 */
export default function App(): ReactElement {
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