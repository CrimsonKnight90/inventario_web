// ============================================================
// Archivo: frontend/src/utils/apiClient.js
// Descripción: Cliente HTTP centralizado (fetch) con base URL, auth, manejo de FormData y retorno consistente de JSON
// Autor: CrimsonKnight90
// ============================================================

import { API_URL } from "../config"

const isFormData = (body) => typeof FormData !== "undefined" && body instanceof FormData

async function request(method, url, body = null, extraHeaders = {}) {
  const headers = { ...extraHeaders }

  // 🔑 Inyectar token desde sessionStorage (consistente con AuthContext y LoginPage)
  const token = sessionStorage.getItem("token")
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  let fetchOptions = { method, headers }

  if (body !== null) {
    if (isFormData(body)) {
      fetchOptions.body = body
    } else {
      headers["Content-Type"] = "application/json"
      fetchOptions.body = JSON.stringify(body)
    }
  }

  const resp = await fetch(`${API_URL}${url}`, fetchOptions)
  const text = await resp.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  // Manejo de errores
  if (!resp.ok) {
    // Si es 401, limpiar sesión y redirigir a login
    if (resp.status === 401) {
      sessionStorage.removeItem("token")
      window.location.href = "/login"
    }
    const msg = typeof data === "object" ? JSON.stringify(data) : text || `HTTP ${resp.status}`
    throw new Error(`Error HTTP ${resp.status}: ${msg}`)
  }

  return data
}

export const apiClient = {
  get: (url, headers = {}) => request("GET", url, null, headers),
  post: (url, body, headers = {}) => request("POST", url, body, headers),
  put: (url, body, headers = {}) => request("PUT", url, body, headers),
  patch: (url, body, headers = {}) => request("PATCH", url, body, headers),
  delete: (url, headers = {}) => request("DELETE", url, null, headers),
}
