// ============================================================
// Archivo: frontend/src/components/ErrorBoundaryWrapper.jsx
// Descripción: Wrapper que resetea ErrorBoundary al cambiar de ruta
// Autor: CrimsonKnight90
// ============================================================

import { useLocation } from "react-router-dom"
import ErrorBoundary from "./ErrorBoundary"

export default function ErrorBoundaryWrapper({ children }) {
  const location = useLocation()

  return (
    // 👇 la key cambia con la ruta → fuerza un remount del ErrorBoundary
    <ErrorBoundary key={location.pathname}>
      {children}
    </ErrorBoundary>
  )
}
