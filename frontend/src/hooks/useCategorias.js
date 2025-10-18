// ============================================================
// Archivo: frontend/src/hooks/useCategorias.js
// Descripción: Hook especializado para CRUD de Categorías con i18n y notificaciones
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { apiClient } from "../utils/apiClient"
import { useNotification } from "./useNotification"
import { useTranslation } from "react-i18next"

export function useCategorias({ incluirInactivos = false } = {}) {
  const { notify } = useNotification()
  const { t } = useTranslation()

  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)

  // 🔹 Cargar todas las categorías (activas o todas según flag)
  const fetchAll = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get(`/categorias?incluir_inactivos=${incluirInactivos}`)
      setCategorias(data)
    } catch (err) {
      notify.error(t("categorias.error_load", { defaultValue: "Error al cargar categorías" }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [incluirInactivos])

  // 🔹 Crear categoría
  const create = async (payload) => {
    try {
      const nueva = await apiClient.post("/categorias/", payload)
      notify.success(t("categorias.create_success", { defaultValue: "Categoría creada correctamente" }))
      fetchAll()
      return nueva
    } catch (err) {
      notify.error(err.message || t("categorias.error_save", { defaultValue: "Error al crear categoría" }))
      return null
    }
  }

  // 🔹 Actualizar categoría
  const update = async (id, payload) => {
    try {
      const updated = await apiClient.put(`/categorias/${id}`, payload)
      notify.success(t("categorias.update_success", { defaultValue: "Categoría actualizada correctamente" }))
      fetchAll()
      return updated
    } catch (err) {
      notify.error(err.message || t("categorias.error_update", { defaultValue: "Error al actualizar categoría" }))
      return null
    }
  }

  // 🔹 Desactivar categoría (soft delete)
  const deactivate = async (id) => {
    if (!window.confirm(t("categorias.confirm_deactivate", { defaultValue: "¿Desactivar esta categoría?" }))) return
    try {
      await apiClient.patch(`/categorias/${id}/desactivar`)
      notify.warning(t("categorias.deactivate_success", { defaultValue: "Categoría desactivada" }))
      fetchAll()
    } catch (err) {
      notify.error(err.message || t("categorias.error_deactivate", { defaultValue: "Error al desactivar categoría" }))
    }
  }

  // 🔹 Reactivar categoría
  const activate = async (id) => {
    try {
      await apiClient.patch(`/categorias/${id}/reactivar`)
      notify.success(t("categorias.activate_success", { defaultValue: "Categoría reactivada" }))
      fetchAll()
    } catch (err) {
      notify.error(err.message || t("categorias.error_activate", { defaultValue: "Error al reactivar categoría" }))
    }
  }

  return { categorias, loading, fetchAll, create, update, deactivate, activate }
}
