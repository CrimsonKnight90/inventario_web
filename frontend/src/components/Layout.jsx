// ============================================================
// Archivo: frontend/src/components/Layout.jsx
// Descripción: Layout base con Topbar sticky y Navbar fixed
//              con ErrorBoundary aislando solo el contenido.
// Autor: CrimsonKnight90
// ============================================================

import Navbar from "./Navbar"
import Topbar from "./Topbar"
import ErrorBoundaryWrapper from "./ErrorBoundaryWrapper"
import { useBranding } from "../context/BrandingContext"

export default function Layout({ children }) {
  const { branding } = useBranding()

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: branding?.background_color || "#F8FAFC" }}
    >
      {/* Barra superior sticky */}
      <div className="sticky top-0">
        <Topbar />
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 overflow-y-auto ml-64 pt-14 px-6">
          <ErrorBoundaryWrapper>
            {children}
          </ErrorBoundaryWrapper>
        </main>
      </div>
    </div>
  )
}
