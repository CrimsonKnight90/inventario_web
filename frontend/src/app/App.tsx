// ============================================================
// Archivo: frontend/src/app/App.tsx
// Descripción: App principal CORREGIDA con rutas anidadas.
//              Ahora usa Layout como wrapper de rutas privadas
//              correctamente con <Outlet />.
// Autor: CrimsonKnight90
// ============================================================

import {Routes, Route, Navigate} from "react-router-dom";
import {useAuthStore} from "@store/auth.store";
import {Layout} from "@layout/Layout";
import {PrivateRoute} from "@components/PrivateRoute";
import {routes} from "@app/routes";
import {ReactElement, useEffect} from "react";

/**
 * App principal: define las rutas correctamente para que Layout
 * pueda usar <Outlet /> sin conflictos.
 */
export default function App(): ReactElement {
    const token = useAuthStore((state) => state.token);
    const restoreFromStorage = useAuthStore((state) => state.restoreFromStorage);

    // Restaurar sesión solo una vez al montar la App
    useEffect(() => {
        restoreFromStorage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Separar rutas públicas y privadas
    const publicRoutes = routes.filter(r => !r.private);
    const privateRoutes = routes.filter(r => r.private);

    return (
        <Routes>
            {/* ✅ Rutas públicas (sin Layout) */}
            {publicRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element}/>
            ))}

            {/* Rutas privadas anidadas con Layout */}
            <Route
                element={
                    <PrivateRoute>
                        <Layout/>
                    </PrivateRoute>
                }
            >
                {privateRoutes.map((route) => {
                    const renderRoute = (r: typeof route) => {
                        const Element = r.roles && r.roles.length > 0
                            ? <PrivateRoute roles={r.roles}>{r.element}</PrivateRoute>
                            : r.element;

                        return (
                            <Route key={r.path} path={r.path.replace(/^\//, "")} element={Element}>
                                {r.children?.map((c) => (
                                    <Route
                                        key={c.path}
                                        path={c.path.replace(`${r.path}/`, "")}
                                        element={c.roles && c.roles.length > 0 ?
                                            <PrivateRoute roles={c.roles}>{c.element}</PrivateRoute> : c.element}
                                    />
                                ))}
                            </Route>
                        );
                    };

                    return renderRoute(route);
                })}
            </Route>

            {/* Redirección por defecto */}
            <Route
                path="/"
                element={<Navigate to={token ? "/dashboard" : "/login"} replace/>}
            />

            {/* Ruta 404 */}
            <Route
                path="*"
                element={
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-800">404</h1>
                            <p className="text-gray-600 mt-2">Página no encontrada</p>
                        </div>
                    </div>
                }
            />
        </Routes>
    );
}