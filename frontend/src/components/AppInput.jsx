// ============================================================
// Archivo: frontend/src/components/AppInput.jsx
// Descripción: Input genérico reutilizable con estilos consistentes
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import clsx from "clsx"

export default function AppInput({ className = "", ...props }) {
  return (
    <input
      className={clsx("w-full border px-3 py-2 rounded", className)}
      {...props}
    />
  )
}
