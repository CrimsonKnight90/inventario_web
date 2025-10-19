// ============================================================
// Archivo: frontend/src/utils/errorUtils.js
// Descripción: Utilidades para parsear y normalizar errores HTTP
// Autor: CrimsonKnight90
// ============================================================

/**
 * Extrae un mensaje de error legible desde un objeto Error lanzado por apiClient.
 * apiClient siempre lanza un Error con message tipo:
 *   "Error HTTP 400: {\"code\":\"X\",\"message\":\"Texto\"}"
 *
 * @param {Error} err - Error lanzado por apiClient
 * @param {string} fallback - Mensaje por defecto si no se puede parsear
 * @returns {string} - Mensaje de error legible
 */
export function getErrorDetail(err, fallback = "Error desconocido") {
  let detail
  try {
    // Quitar el prefijo "Error HTTP XXX: " y parsear JSON
    detail = JSON.parse(err.message.replace(/^Error HTTP \d+: /, ""))
  } catch {
    detail = null
  }

  if (detail?.message) return detail.message
  if (detail?.detail) {
    if (typeof detail.detail === "string") return detail.detail
    if (Array.isArray(detail.detail)) {
      // Caso típico de validación Pydantic: devolvemos el primer msg
      return detail.detail[0]?.msg || fallback
    }
    return JSON.stringify(detail.detail)
  }

  return err?.message || fallback
}
