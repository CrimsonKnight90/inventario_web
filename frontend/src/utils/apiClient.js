// ============================================================
// Archivo: frontend/src/utils/apiClient.js
// Descripción: Cliente centralizado para llamadas a la API.
//              Incluye métodos get/post/put/delete y adjunta token JWT.
// Autor: CrimsonKnight90
// ============================================================

const API_BASE = "http://localhost:8000"   // 👈 apunta al backend FastAPI

export const apiClient = {
  async request(url, options = {}) {
    // 👇 Ahora leemos el token desde sessionStorage (alineado con AuthContext)
    const token = sessionStorage.getItem("token")

    const defaultHeaders =
      options.body instanceof FormData ? {} : { "Content-Type": "application/json" }

    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })

    if (response.status === 401) {
      // Manejo de sesión expirada
      sessionStorage.removeItem("token")
      window.location.href = "/login"
      throw new Error("Sesión expirada. Vuelve a iniciar sesión.")
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Error HTTP ${response.status}: ${errorText}`)
    }

    return response.json()
  },

  get(url) {
    return this.request(url, { method: "GET" })
  },

  post(url, body) {
    return this.request(url, { method: "POST", body: JSON.stringify(body) })
  },

  put(url, body) {
    return this.request(url, { method: "PUT", body: JSON.stringify(body) })
  },

  patch(url, body) {
    return this.request(url, { method: "PATCH", body: JSON.stringify(body) })
  },

  delete(url) {
    return this.request(url, { method: "DELETE" })
  },
}
