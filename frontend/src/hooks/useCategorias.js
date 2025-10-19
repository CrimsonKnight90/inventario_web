// ============================================================
// Archivo: frontend/src/hooks/useCategorias.js
// Descripción: Hook especializado para CRUD de Categorías con i18n y notificaciones
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { apiClient } from "../utils/apiClient"
import { useNotification } from "./useNotification"
import { useTranslation } from "react-i18next"
import { getErrorDetail } from "../utils/errorUtils"

export function useCategorias({ incluirInactivos = false, notify } = {}) {
  const internalNotify = useNotification().notify
  const notifyFn = notify || internalNotify
  const { t } = useTranslation()

  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get(`/categorias?incluir_inactivos=${incluirInactivos}`)
      setCategorias(data)
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("categorias.error_load", { defaultValue: "Error al cargar categorías" })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [incluirInactivos])

  const create = async (payload) => {
    try {
      const nueva = await apiClient.post("/categorias/", payload)
      notifyFn.success(t("categorias.create_success", { defaultValue: "Categoría creada correctamente" }))
      fetchAll()
      return nueva
    } catch (err) {
      let detail
      try {
        detail = JSON.parse(err.message.replace(/^Error HTTP \d+: /, ""))
      } catch {
        detail = null
      }
      if (detail?.code === "categoria_existente") {
        notifyFn.error(detail.message || t("categorias.duplicate", { defaultValue: "Ya existe una categoría con ese nombre" }))
      } else {
        notifyFn.error(getErrorDetail(err, t("categorias.error_save", { defaultValue: "Error al crear categoría" })))
      }
      return null
    }
  }

  const update = async (id, payload) => {
    try {
      const updated = await apiClient.put(`/categorias/${id}`, payload)
      notifyFn.success(t("categorias.update_success", { defaultValue: "Categoría actualizada correctamente" }))
      fetchAll()
      return updated
    } catch (err) {
      let detail
      try {
        detail = JSON.parse(err.message.replace(/^Error HTTP \d+: /, ""))
      } catch {
        detail = null
      }
      if (detail?.code === "categoria_existente") {
        notifyFn.error(detail.message || t("categorias.duplicate", { defaultValue: "Ya existe una categoría con ese nombre" }))
      } else {
        notifyFn.error(getErrorDetail(err, t("categorias.error_update", { defaultValue: "Error al actualizar categoría" })))
      }
      return null
    }
  }

  const deactivate = async (id) => {
    try {
      await apiClient.patch(`/categorias/${id}/desactivar`)
      notifyFn.warning(t("categorias.deactivate_success", { defaultValue: "Categoría desactivada" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("categorias.error_deactivate", { defaultValue: "Error al desactivar categoría" })))
    }
  }

  const activate = async (id) => {
    try {
      await apiClient.patch(`/categorias/${id}/reactivar`)
      notifyFn.success(t("categorias.activate_success", { defaultValue: "Categoría reactivada" }))
      fetchAll()
    } catch (err) {
      notifyFn.error(getErrorDetail(err, t("categorias.error_activate", { defaultValue: "Error al reactivar categoría" })))
    }
  }

  return { categorias, loading, fetchAll, create, update, deactivate, activate }
}
