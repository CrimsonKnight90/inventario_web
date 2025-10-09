// ============================================================
// Archivo: frontend/src/utils/apiClient.js
// Descripción: Cliente centralizado para llamadas a la API.
//              Adjunta token JWT automáticamente y maneja 401.
// Autor: CrimsonKnight90
// ============================================================

import { useAuth } from "../context/AuthContext"

const API_BASE = "http://localhost:8000"   // 👈 apunta al backend FastAPI

export function useApiClient() {
  const { logout, authHeader } = useAuth()

  const request = async (url, options = {}) => {
    try {
      const defaultHeaders =
        options.body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }

      // 👇 prepend baseURL siempre
      const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...authHeader(),
          ...options.headers,
        },
      })

      if (response.status === 401) {
        logout()
        throw new Error("Sesión expirada. Vuelve a iniciar sesión.")
      }

      return response
    } catch (err) {
      console.error("Error en apiClient:", err)
      throw err
    }
  }

  return { request }
}
