// ============================================================
// Archivo: frontend/src/context/BrandingContext.jsx
// Descripción: Contexto global para gestionar configuración de branding desde backend
// Autor: CrimsonKnight90
// ============================================================

import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "../utils/apiClient"

// 🎨 Valores por defecto (contrato claro)
export const DEFAULT_BRANDING = {
  app_name: "Inventario Pro",
  appName: "Inventario Pro",
  logo_url: "/uploads/logo.png",
  logo: "/uploads/logo.png",
  // claves planas (compatibilidad)
  primary_color: "#111827",
  secondary_color: "#F59E0B",
  background_color: "#F8FAFC",
  topbar_color: "#0B1220",
  // objeto colors (compatibilidad con componentes que leen branding.colors.*)
  colors: {
    primary: "#111827",
    secondary: "#F59E0B",
    background: "#F8FAFC",
    topbar: "#0B1220",
  },
}

const BrandingContext = createContext()

function applyBrandingToCSSVars(b) {
  const root = document.documentElement
  const primary = b?.colors?.primary ?? b?.primary_color ?? DEFAULT_BRANDING.colors.primary
  const secondary = b?.colors?.secondary ?? b?.secondary_color ?? DEFAULT_BRANDING.colors.secondary
  const background = b?.colors?.background ?? b?.background_color ?? DEFAULT_BRANDING.colors.background
  const topbar = b?.colors?.topbar ?? b?.topbar_color ?? DEFAULT_BRANDING.colors.topbar

  root.style.setProperty("--sidebar-bg", primary)
  root.style.setProperty("--hover-bg", secondary)
  root.style.setProperty("--app-background", background)
  root.style.setProperty("--topbar-bg", topbar)
  // opcionales para compatibilidad
  root.style.setProperty("--primary-color", primary)
  root.style.setProperty("--secondary-color", secondary)
}

function normalizeBranding(raw = {}) {
  // Asegura que branding tenga tanto claves planas como objeto colors y aliases
  const app_name = raw.app_name ?? raw.appName ?? DEFAULT_BRANDING.app_name
  const appName = raw.appName ?? raw.app_name ?? DEFAULT_BRANDING.appName
  const logo_url = raw.logo_url ?? raw.logo ?? DEFAULT_BRANDING.logo_url
  const logo = raw.logo ?? raw.logo_url ?? DEFAULT_BRANDING.logo
  const primary_color = raw.primary_color ?? raw.colors?.primary ?? DEFAULT_BRANDING.primary_color
  const secondary_color = raw.secondary_color ?? raw.colors?.secondary ?? DEFAULT_BRANDING.secondary_color
  const background_color = raw.background_color ?? raw.colors?.background ?? DEFAULT_BRANDING.background_color
  const topbar_color = raw.topbar_color ?? raw.colors?.topbar ?? DEFAULT_BRANDING.topbar_color

  return {
    // aliases y canonical
    app_name,
    appName,
    logo_url,
    logo,
    primary_color,
    secondary_color,
    background_color,
    topbar_color,
    // objeto colors para compatibilidad
    colors: {
      primary: primary_color,
      secondary: secondary_color,
      background: background_color,
      topbar: topbar_color,
    },
  }
}

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(() => normalizeBranding(DEFAULT_BRANDING))

  // Inicializa desde backend al montar
  useEffect(() => {
    let mounted = true
    apiClient
      .get("/config")
      .then((data) => {
        if (!mounted) return
        const normalized = normalizeBranding(data || {})
        setBranding(normalized)
      })
      .catch(() => {
        // fallback silencioso, mantén defaults normalizados
        setBranding(normalizeBranding(DEFAULT_BRANDING))
      })
    return () => {
      mounted = false
    }
  }, [])

  // Sincroniza variables CSS en runtime cada vez que branding cambie
  useEffect(() => {
    if (branding) applyBrandingToCSSVars(branding)
  }, [branding])

  // updateBranding: persiste en backend y actualiza state normalizado
  const updateBranding = async (newConfig) => {
    const payload = {
      app_name: newConfig.app_name,
      logo_url: newConfig.logo_url,
      primary_color: newConfig.primary_color,
      secondary_color: newConfig.secondary_color,
      background_color: newConfig.background_color,
      topbar_color: newConfig.topbar_color,
    }
    const updated = await apiClient.put("/config", payload)
    const normalized = normalizeBranding(updated || payload || {})
    setBranding(normalized)
    // applyBrandingToCSSVars(normalized) // useEffect ya lo hará
    return normalized
  }

  const uploadLogo = async (file) => {
    const formData = new FormData()
    formData.append("file", file)
    const updated = await apiClient.post("/config/logo", formData)
    // API debería devolver el branding actualizado o al menos logo_url
    const merged = { ...branding, ...(updated || {}) }
    const normalized = normalizeBranding(merged)
    setBranding(normalized)
    return normalized
  }

  return (
    <BrandingContext.Provider value={{ branding, updateBranding, uploadLogo }}>
      {children}
    </BrandingContext.Provider>
  )
}

export const useBranding = () => useContext(BrandingContext)

