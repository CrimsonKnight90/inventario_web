// ============================================================
// Archivo: frontend/src/App.jsx
// Descripción: Configuración de rutas de la aplicación React (react-router-dom, páginas privadas y públicas).
//              Usa el BrandingProvider ya definido en main.jsx para evitar duplicados.
// Autor: CrimsonKnight90
// ============================================================

import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import AdminPage from "./pages/AdminPage"
import Layout from "./components/Layout"
import PrivateRoute from "./components/PrivateRoute"
import ErrorBoundaryWrapper from "./components/ErrorBoundaryWrapper"

import ActividadesPage from "./pages/listados/ActividadesPage"
import ActividadesCreadasPage from "./pages/listados/ActividadesCreadasPage"
import ActividadesCerradasPage from "./pages/listados/ActividadesCerradasPage"
import ProveedoresListPage from "./pages/listados/ProveedoresPage"

import ProveedoresPage from "./pages/administracion/ProveedoresPage"
import CategoriasPage from "./pages/administracion/CategoriasPage"
import ProductosPage from "./pages/administracion/ProductosPage"
import CentrosCostoPage from "./pages/administracion/CentrosCostoPage"
import ContrapartesPage from "./pages/administracion/ContrapartesPage"

import CrearActividadPage from "./pages/operativo/CrearActividadPage"
import CerrarActividadPage from "./pages/operativo/CerrarActividadPage"

import UMPage from "./pages/parametros/UMPage"
import MonedasPage from "./pages/parametros/MonedasPage"
import TiposDocumentosPage from "./pages/parametros/TiposDocumentosPage"

import ConfigPage from "./pages/ConfigPage"
import ForbiddenPage from "./pages/ForbiddenPage"
import NotFoundPage from "./pages/NotFoundPage"

// 🔹 Wrapper para no repetir Layout + ErrorBoundary + PrivateRoute
function ProtectedLayout({ roles }) {
  return (
    <PrivateRoute roles={roles}>
      <Layout>
        <ErrorBoundaryWrapper>
          <Outlet />
        </ErrorBoundaryWrapper>
      </Layout>
    </PrivateRoute>
  )
}

function App() {
  return (
    <Routes>
      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Admin y Config (solo admin) */}
      <Route element={<ProtectedLayout roles={["admin"]} />}>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/config" element={<ConfigPage />} />
      </Route>

      {/* Listados */}
      <Route element={<ProtectedLayout />}>
        <Route path="/listados/actividades" element={<ActividadesPage />} />
        <Route path="/listados/actividades/creadas" element={<ActividadesCreadasPage />} />
        <Route path="/listados/actividades/cerradas" element={<ActividadesCerradasPage />} />
        <Route path="/listados/proveedores" element={<ProveedoresListPage />} />
      </Route>

      {/* Administración (solo admin excepto productos) */}
      <Route element={<ProtectedLayout roles={["admin"]} />}>
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/centros-costo" element={<CentrosCostoPage />} />
        <Route path="/contrapartes" element={<ContrapartesPage />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/productos" element={<ProductosPage />} />
      </Route>

      {/* Operativo */}
      <Route element={<ProtectedLayout />}>
        <Route path="/operativo/actividades/crear" element={<CrearActividadPage />} />
        <Route path="/operativo/actividades/cerrar" element={<CerrarActividadPage />} />
      </Route>

      {/* Parámetros (solo admin) */}
      <Route element={<ProtectedLayout roles={["admin"]} />}>
        <Route path="/parametros/um" element={<UMPage />} />
        <Route path="/parametros/monedas" element={<MonedasPage />} />
        <Route path="/parametros/tipos-documentos" element={<TiposDocumentosPage />} />
      </Route>

      {/* Errores */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
