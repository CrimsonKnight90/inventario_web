// ============================================================
// Archivo: frontend/src/components/AppSelect.jsx
// Descripción: Select genérico reutilizable con estilos consistentes
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import clsx from "clsx"

export default function AppSelect({ className = "", children, ...props }) {
  return (
    <select
      className={clsx("w-full border px-3 py-2 rounded", className)}
      {...props}
    >
      {children}
    </select>
  )
}
