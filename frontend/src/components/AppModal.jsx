// ============================================================
// Archivo: frontend/src/components/AppModal.jsx
// Descripción: Modal genérico con tamaños, scroll interno y footer opcional con soporte asíncrono
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import clsx from "clsx"

export default function AppModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md", // sm | md | lg
  className = "",
  footer = null, // contenido opcional para el pie
}) {
  if (!isOpen) return null

  const sizes = {
    sm: "max-w-sm",   // ~24rem
    md: "max-w-lg",   // ~32rem
    lg: "max-w-3xl",  // ~48rem
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={clsx(
          "bg-white rounded-xl shadow-lg w-full relative flex flex-col",
          sizes[size],
          className
        )}
        style={{ maxHeight: "90vh" }}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>

        {/* Cabecera */}
        {title && (
          <div className="px-6 pt-6 pb-2 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        )}

        {/* Contenido con scroll */}
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>

        {/* Footer opcional */}
        {footer && (
          <div className="px-6 py-3 border-t flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
