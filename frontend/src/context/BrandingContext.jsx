// ============================================================
// Archivo: frontend/src/context/BrandingContext.jsx
// Descripción: Contexto global para gestionar configuración de branding desde backend
// Autor: CrimsonKnight90
// ============================================================

import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "../utils/apiClient"

const BrandingContext = createContext()

// 🎨 Colores por defecto (sobrios y profesionales)
const DEFAULT_BRANDING = {
  app_name: "Inventario Pro",
  logo_url: "/uploads/logo.png",
  primary_color: "#1E293B",     // Navbar
  secondary_color: "#3B82F6",   // Botones/acento
  background_color: "#F8FAFC",  // Fondo
  topbar_color: "#0F172A",      // 🔹 Nuevo: Topbar
}

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(DEFAULT_BRANDING)

  useEffect(() => {
    apiClient.get("/config").then((data) => {
      setBranding({
        app_name: data?.app_name || DEFAULT_BRANDING.app_name,
        logo_url: data?.logo_url || DEFAULT_BRANDING.logo_url,
        primary_color: data?.primary_color || DEFAULT_BRANDING.primary_color,
        secondary_color: data?.secondary_color || DEFAULT_BRANDING.secondary_color,
        background_color: data?.background_color || DEFAULT_BRANDING.background_color,
        topbar_color: data?.topbar_color || DEFAULT_BRANDING.topbar_color, // 🔹 Nuevo
      })
    }).catch(() => {
      // Fallback silencioso: mantener defaults si el backend falla
      setBranding(DEFAULT_BRANDING)
    })
  }, [])

  const updateBranding = async (newConfig) => {
    const payload = {
      app_name: newConfig.app_name,
      logo_url: newConfig.logo_url,
      primary_color: newConfig.primary_color,
      secondary_color: newConfig.secondary_color,
      background_color: newConfig.background_color,
      topbar_color: newConfig.topbar_color, // 🔹 Nuevo
    }
    const updated = await apiClient.put("/config", payload)
    setBranding({
      app_name: updated?.app_name || DEFAULT_BRANDING.app_name,
      logo_url: updated?.logo_url || DEFAULT_BRANDING.logo_url,
      primary_color: updated?.primary_color || DEFAULT_BRANDING.primary_color,
      secondary_color: updated?.secondary_color || DEFAULT_BRANDING.secondary_color,
      background_color: updated?.background_color || DEFAULT_BRANDING.background_color,
      topbar_color: updated?.topbar_color || DEFAULT_BRANDING.topbar_color, // 🔹 Nuevo
    })
    return updated
  }

  const uploadLogo = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    const updated = await apiClient.post("/config/logo", formData) // sin headers
    setBranding(prev => ({
      ...prev,
      logo_url: updated?.logo_url || DEFAULT_BRANDING.logo_url,
      app_name: updated?.app_name || prev.app_name,
      primary_color: updated?.primary_color || prev.primary_color,
      secondary_color: updated?.secondary_color || prev.secondary_color,
      background_color: updated?.background_color || prev.background_color,
      topbar_color: updated?.topbar_color || prev.topbar_color, // 🔹 Nuevo
    }))
    return updated
  }

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, uploadLogo }}>
      {children}
    </BrandingContext.Provider>
  )
}

export const useBranding = () => useContext(BrandingContext)
