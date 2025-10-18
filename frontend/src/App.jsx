// ============================================================
// Archivo: frontend/src/App.jsx
// Descripción: Configuración de rutas de la aplicación React (react-router-dom, páginas privadas y públicas).
//              Usa el BrandingProvider ya definido en main.jsx para evitar duplicados.
// Autor: CrimsonKnight90
// ============================================================

import {Routes, Route, Navigate} from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./components/PrivateRoute"
import AdminPage from "./pages/AdminPage"
import Layout from "./components/Layout"
import CategoriasPage from "./pages/administracion/CategoriasPage"
import ProductosPage from "./pages/administracion/ProductosPage"

import CrearActividadPage from "./pages/operativo/CrearActividadPage"
import CerrarActividadPage from "./pages/operativo/CerrarActividadPage"

import ActividadesPage from "./pages/listados/ActividadesPage"
import ActividadesCreadasPage from "./pages/listados/ActividadesCreadasPage"
import ActividadesCerradasPage from "./pages/listados/ActividadesCerradasPage"

import UMPage from "./pages/parametros/UMPage"
import MonedasPage from "./pages/parametros/MonedasPage"
import TiposDocumentosPage from "./pages/parametros/TiposDocumentosPage"

import ConfigPage from "./pages/ConfigPage"
import ForbiddenPage from "./pages/ForbiddenPage"
import NotFoundPage from "./pages/NotFoundPage"

import ErrorBoundaryWrapper from "./components/ErrorBoundaryWrapper"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login"/>}/>
            <Route path="/login" element={<LoginPage/>}/>

            <Route
                path="/admin"
                element={
                    <PrivateRoute roles={["admin"]}>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <AdminPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/config"
                element={
                    <PrivateRoute roles={["admin"]}>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <ConfigPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <Dashboard/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/categorias"
                element={
                    <PrivateRoute roles={["admin"]}>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <CategoriasPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />


            <Route
                path="/productos"
                element={
                    <PrivateRoute>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <ProductosPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/operativo/actividades/crear"
                element={
                    <PrivateRoute>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <CrearActividadPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/operativo/actividades/cerrar"
                element={
                    <PrivateRoute>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <CerrarActividadPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/listados/actividades"
                element={
                    <PrivateRoute>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <ActividadesPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/listados/actividades/creadas"
                element={
                    <PrivateRoute>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <ActividadesCreadasPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/listados/actividades/cerradas"
                element={
                    <PrivateRoute>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <ActividadesCerradasPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />

            <Route
                path="/parametros/um"
                element={
                    <PrivateRoute roles={["admin"]}>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <UMPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/parametros/monedas"
                element={
                    <PrivateRoute roles={["admin"]}>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <MonedasPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/parametros/tipos-documentos"
                element={
                    <PrivateRoute roles={["admin"]}>
                        <Layout>
                            <ErrorBoundaryWrapper>
                                <TiposDocumentosPage/>
                            </ErrorBoundaryWrapper>
                        </Layout>
                    </PrivateRoute>
                }
            />

            {/* ✅ Ruta para acceso prohibido */}
            <Route path="/403" element={<ForbiddenPage/>}/>

            {/* ✅ Ruta para páginas inexistentes */}
            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    )
}

export default App
