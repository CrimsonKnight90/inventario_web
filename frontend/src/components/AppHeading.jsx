// ============================================================
// Archivo: frontend/src/components/AppHeading.jsx
// Descripción: Encabezados genéricos reutilizables (H1, H2, ...)
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import clsx from "clsx"

export default function AppHeading({ level = 1, children, className = "" }) {
  const Tag = `h${level}` // dinámico: h1, h2, h3...

  const baseStyles = {
    1: "text-3xl font-bold text-gray-800 mb-6",
    2: "text-xl font-semibold mb-4",
    3: "text-lg font-medium mb-3",
  }

  return (
    <Tag className={clsx(baseStyles[level] || baseStyles[2], className)}>
      {children}
    </Tag>
  )
}
