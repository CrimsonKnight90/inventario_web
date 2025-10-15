// ============================================================
// Archivo: frontend/src/hooks/useCatalogo.js
// Descripción: Hook genérico para catálogos con activar/desactivar (con i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { useApiClient } from "../utils/apiClient"
import { useNotification } from "./useNotification"
import { useTranslation } from "react-i18next"

export function useCatalogo(endpoint, { incluirInactivos = true } = {}) {
  const { request } = useApiClient()
  const { notify } = useNotification()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const fetchAll = async () => {
    setLoading(true)
    try {
      const res = await request(`${endpoint}/?incluir_inactivos=${incluirInactivos}`)
      const json = await res.json()
      setData(json)
    } catch {
      notify.error(t("catalogo.load_error", { endpoint }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [endpoint, incluirInactivos])

  const create = async (payload) => {
    try {
      const res = await request(`${endpoint}/`, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        notify.error(json.detail || t("catalogo.create_error", { endpoint }))
        return null
      }
      notify.success(t("catalogo.create_success"))
      fetchAll()
      return json.data
    } catch {
      notify.error(t("catalogo.server_error"))
      return null
    }
  }

  const deactivate = async (id) => {
    if (!window.confirm(t("catalogo.confirm_deactivate", { id }))) return
    try {
      const res = await request(`${endpoint}/${encodeURIComponent(id)}/desactivar`, { method: "PATCH" })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        notify.error(json.detail || t("catalogo.deactivate_error"))
        return
      }
      notify.warning(json.detail || t("catalogo.deactivate_success", { id }))
      fetchAll()
    } catch {
      notify.error(t("catalogo.server_error"))
    }
  }

  const activate = async (id) => {
    try {
      const res = await request(`${endpoint}/${encodeURIComponent(id)}/reactivar`, { method: "PATCH" })
      const json = await res.json()
      if (!res.ok) {
        notify.error(json.detail || t("catalogo.activate_error"))
        return
      }
      notify.success(t("catalogo.activate_success", { id }))
      fetchAll()
    } catch {
      notify.error(t("catalogo.server_error"))
    }
  }

  return { data, loading, fetchAll, create, deactivate, activate }
}
