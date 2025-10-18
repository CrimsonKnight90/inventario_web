// ============================================================
// Archivo: frontend/src/components/AppPageContainer.jsx
// Descripción: Contenedor genérico de página (centrado + ancho máximo)
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import clsx from "clsx"
import { useBranding } from "../context/BrandingContext"

export default function AppPageContainer({ children, className = "", ...props }) {
  const { branding } = useBranding()

  return (
    <div
      className="px-4 sm:px-6 lg:px-8" // 🔹 solo padding horizontal
      style={{ backgroundColor: branding?.background_color || "#F8FAFC" }}
    >
      <div className={clsx("w-full max-w-6xl mx-auto", className)} {...props}>
        {children}
      </div>
    </div>
  )
}
