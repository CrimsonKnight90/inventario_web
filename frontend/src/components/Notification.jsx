// ============================================================
// Archivo: frontend/src/components/Notification.jsx
// Descripción: Componente de notificación tipo toast/snackbar
// Autor: CrimsonKnight90
// ============================================================

import { useEffect } from "react"

export default function Notification({ message, type = "info", onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000) // se oculta automáticamente en 4 segundos
      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-600",
  }

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-3 rounded shadow-lg text-white flex items-center space-x-2 ${colors[type]}`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 font-bold hover:text-gray-200 focus:outline-none"
      >
        ×
      </button>
    </div>
  )
}
