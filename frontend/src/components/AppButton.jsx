// ============================================================
// Archivo: frontend/src/components/AppButton.jsx
// Descripción: Botón genérico centralizado para toda la app
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import clsx from "clsx"

export default function AppButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseStyles =
    "rounded font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1"

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    text: "bg-transparent text-blue-600 hover:underline focus:ring-blue-500",
  }

  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}
