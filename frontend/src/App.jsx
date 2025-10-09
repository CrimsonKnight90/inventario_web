// ============================================================
// Archivo: frontend/src/App.jsx
// Descripción: Configuración de rutas de la aplicación React (react-router-dom, páginas privadas y públicas)
// Autor: CrimsonKnight90
// ============================================================

import { Routes, Route, Navigate } from "react-router-dom"
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

function App() {
  return (
    <Routes>
      {/* 🔹 Público */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />

      {/* 🔹 Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
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
              <ProductosPage />
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
              <CrearActividadPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/operativo/actividades/cerrar"
        element={
          <PrivateRoute>
            <Layout>
              <CerrarActividadPage />
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
              <ActividadesPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/listados/actividades/creadas"
        element={
          <PrivateRoute>
            <Layout>
              <ActividadesCreadasPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/listados/actividades/cerradas"
        element={
          <PrivateRoute>
            <Layout>
              <ActividadesCerradasPage />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* 🔹 Admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={["admin"]}>
            <Layout>
              <AdminPage />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default App
