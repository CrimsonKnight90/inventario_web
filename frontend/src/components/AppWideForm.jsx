// ============================================================
// Archivo: frontend/src/components/AppWideForm.jsx
// Descripción: Formulario genérico ancho, pensado para páginas
//              de configuración o administración.
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import clsx from "clsx"

export default function AppWideForm({ children, onSubmit, className = "", ...props }) {
  return (
    <form
      onSubmit={onSubmit}
      className={clsx(
        // 🔹 Base: ancho completo, centrado, con sombra y padding
        "bg-white p-6 shadow-md rounded-xl mb-8 w-full max-w-6xl mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </form>
  )
}
