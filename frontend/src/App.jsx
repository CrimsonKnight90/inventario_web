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
import Layout from "./components/Layout"   // ✅ Usamos Layout, ya no Navbar aquí
import ProductosPage from "./pages/ProductosPage"

function App() {
  // App solo define rutas; el Router está en main.jsx para evitar duplicación.
  return (
    <Routes>
      {/* ✅ Redirección desde raíz */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Login no usa Layout para mantenerlo limpio */}
      <Route path="/login" element={<LoginPage />} />

      {/* Dashboard envuelto en Layout */}
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

      {/* Admin envuelto en Layout y restringido a rol admin */}
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
     {/* ✅ Nueva ruta de productos */}
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
    </Routes>
  )
}

export default App
