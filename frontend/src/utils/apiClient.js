// ============================================================
// Archivo: frontend/src/utils/apiClient.js
// Descripción: Cliente centralizado para llamadas a la API.
//              Adjunta token JWT automáticamente y maneja 401.
// Autor: CrimsonKnight90
// ============================================================

import { useAuth } from "../context/AuthContext"

/**
 * Hook que devuelve un cliente API con headers de autenticación.
 * - Adjunta Authorization: Bearer <token>
 * - Si recibe 401, ejecuta logout automáticamente
 */
export function useApiClient() {
  const { token, logout, authHeader } = useAuth()

  const request = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
          ...options.headers,
        },
      })

      if (response.status === 401) {
        // Token inválido o expirado → cerrar sesión
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
