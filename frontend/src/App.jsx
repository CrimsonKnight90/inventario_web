// ============================================================
// Archivo: frontend/src/App.jsx
// Descripción: Configuración de rutas de la aplicación React (react-router-dom, páginas privadas y públicas).
//              Incluye BrandingProvider y la nueva página de Configuración de Branding.
// Autor: CrimsonKnight90
// ============================================================

import {Routes, Route, Navigate} from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import PrivateRoute from "./components/PrivateRoute"
import AdminPage from "./pages/AdminPage"
import Layout from "./components/Layout"
import ProductosPage from "./pages/ProductosPage"

// 🔹 Páginas de Operativo
import CrearActividadPage from "./pages/operativo/CrearActividadPage"
import CerrarActividadPage from "./pages/operativo/CerrarActividadPage"

// 🔹 Páginas de Listados
import ActividadesPage from "./pages/listados/ActividadesPage"
import ActividadesCreadasPage from "./pages/listados/ActividadesCreadasPage"
import ActividadesCerradasPage from "./pages/listados/ActividadesCerradasPage"

// 🔹 Páginas de Parámetros
import UMPage from "./pages/parametros/UMPage"
import MonedasPage from "./pages/parametros/MonedasPage"
import TiposDocumentosPage from "./pages/parametros/TiposDocumentosPage"

// 🔹 Página de Configuración de Branding
import ConfigPage from "./pages/ConfigPage"

// 🔹 Contexto de Branding
import {BrandingProvider} from "./context/BrandingContext"

function App() {
    return (
        <BrandingProvider>
            <Routes>
                {/* 🔹 Público */}
                <Route path="/" element={<Navigate to="/login"/>}/>
                <Route path="/login" element={<LoginPage/>}/>

                {/* 🔹 Admin */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute roles={["admin"]}>
                            <Layout>
                                <AdminPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />

                {/* 🔹 Configuración de Branding (solo admin) */}
                <Route
                    path="/config"
                    element={
                        <PrivateRoute roles={["admin"]}>
                            <Layout>
                                <ConfigPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />

                {/* 🔹 Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard/>
                            </Layout>
                        </PrivateRoute>
                    }
                />

                {/* 🔹 Productos */}
                <Route
                    path="/productos"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <ProductosPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />

                {/* 🔹 Operativo */}
                <Route
                    path="/operativo/actividades/crear"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <CrearActividadPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/operativo/actividades/cerrar"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <CerrarActividadPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />

                {/* 🔹 Listados */}
                <Route
                    path="/listados/actividades"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <ActividadesPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/listados/actividades/creadas"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <ActividadesCreadasPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/listados/actividades/cerradas"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <ActividadesCerradasPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />

                {/* 🔹 Parámetros (solo admin) */}
                <Route
                    path="/parametros/um"
                    element={
                        <PrivateRoute roles={["admin"]}>
                            <Layout>
                                <UMPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/parametros/monedas"
                    element={
                        <PrivateRoute roles={["admin"]}>
                            <Layout>
                                <MonedasPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/parametros/tipos-documentos"
                    element={
                        <PrivateRoute roles={["admin"]}>
                            <Layout>
                                <TiposDocumentosPage/>
                            </Layout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrandingProvider>
    )
}

export default App
