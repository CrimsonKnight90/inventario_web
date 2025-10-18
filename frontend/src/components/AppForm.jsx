// ============================================================
// Archivo: frontend/src/components/AppForm.jsx
// Descripción: Formulario genérico con estilos consistentes
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import clsx from "clsx"

export default function AppForm({ children, onSubmit, className = "", ...props }) {
  return (
    <form
      onSubmit={onSubmit}
      className={clsx(
        "bg-white p-4 shadow-md rounded-xl mb-8 space-y-3 max-w-md mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </form>
  )
}
