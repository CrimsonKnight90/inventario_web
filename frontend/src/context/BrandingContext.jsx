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
  primary_color: "#1E293B",   // gris azulado oscuro
  secondary_color: "#3B82F6", // azul medio moderno
  background_color: "#F8FAFC" // gris muy claro
}

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(DEFAULT_BRANDING)

  useEffect(() => {
    // Cargar configuración desde backend y aplicar fallbacks
    apiClient.get("/config").then(data => {
      setBranding({
        app_name: data.app_name || DEFAULT_BRANDING.app_name,
        logo_url: data.logo_url || DEFAULT_BRANDING.logo_url,
        primary_color: data.primary_color || DEFAULT_BRANDING.primary_color,
        secondary_color: data.secondary_color || DEFAULT_BRANDING.secondary_color,
        background_color: data.background_color || DEFAULT_BRANDING.background_color,
      })
    })
  }, [])

  const updateBranding = async (newConfig) => {
    const updated = await apiClient.put("/config", newConfig)
    setBranding({
      app_name: updated.app_name || DEFAULT_BRANDING.app_name,
      logo_url: updated.logo_url || DEFAULT_BRANDING.logo_url,
      primary_color: updated.primary_color || DEFAULT_BRANDING.primary_color,
      secondary_color: updated.secondary_color || DEFAULT_BRANDING.secondary_color,
      background_color: updated.background_color || DEFAULT_BRANDING.background_color,
    })
  }

  const uploadLogo = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    const res = await apiClient.post("/config/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    // Actualizar branding con la nueva URL del logo
    setBranding(prev => ({
      ...prev,
      logo_url: res.logo_url || DEFAULT_BRANDING.logo_url
    }))
  }

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, uploadLogo }}>
      {children}
    </BrandingContext.Provider>
  )
}

export const useBranding = () => useContext(BrandingContext)
