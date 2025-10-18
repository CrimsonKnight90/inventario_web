// ============================================================
// Archivo: frontend/src/components/AppSection.jsx
// Descripción: Tarjeta genérica para bloques internos
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import clsx from "clsx"

export default function AppSection({ children, className = "", ...props }) {
  return (
    <div
      className={clsx(
        "bg-white shadow-md rounded-xl p-4 sm:p-6 lg:p-8 mb-8 last:mb-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
