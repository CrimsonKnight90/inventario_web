// ============================================================
// Archivo: frontend/src/hooks/useNotification.js
// Descripción: Hook centralizado para manejar notificaciones con helpers
// Autor: CrimsonKnight90
// ============================================================

import { useState, useCallback } from "react"

export function useNotification() {
  const [notif, setNotif] = useState({ message: "", type: "info" })

  const notify = useCallback((message, type = "info") => {
    setNotif({ message, type })
  }, [])

  const clear = useCallback(() => {
    setNotif({ message: "", type: "info" })
  }, [])

  // Helpers para no repetir el tipo
  notify.success = (message) => notify(message, "success")
  notify.error   = (message) => notify(message, "error")
  notify.info    = (message) => notify(message, "info")
  notify.warning = (message) => notify(message, "warning")

  return { notif, notify, clear }
}
