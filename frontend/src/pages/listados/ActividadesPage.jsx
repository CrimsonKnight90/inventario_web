// ============================================================
// Archivo: frontend/src/pages/listados/ActividadesPage.jsx
// Descripción: Listado de todas las actividades (creadas y cerradas)
// Autor: CrimsonKnight90
// ============================================================

import { useEffect, useState } from "react"
import { useApiClient } from "../../utils/apiClient"

export default function ActividadesPage() {
  const { request } = useApiClient()
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await request("/actividades")
        const data = await res.json()
        setActividades(data)
      } catch (err) {
        setError("Error al cargar actividades")
      } finally {
        setLoading(false)
      }
    }
    fetchActividades()
  }, [])

  if (loading) return <p className="p-6">⏳ Cargando actividades...</p>
  if (error) return <p className="p-6 text-red-500">{error}</p>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📋 Todas las Actividades</h1>
      <table className="min-w-full bg-white border border-gray-200 rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nombre</th>
            <th className="px-4 py-2 border">Fecha Inicio</th>
            <th className="px-4 py-2 border">Fecha Fin</th>
            <th className="px-4 py-2 border">Estado</th>
          </tr>
        </thead>
        <tbody>
          {actividades.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No hay actividades registradas
              </td>
            </tr>
          ) : (
            actividades.map((act) => (
              <tr key={act.codact} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{act.codact}</td>
                <td className="px-4 py-2 border">{act.nomact}</td>
                <td className="px-4 py-2 border">
                  {act.fechaini ? new Date(act.fechaini).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-2 border">
                  {act.fechafin ? new Date(act.fechafin).toLocaleString() : "-"}
                </td>
                <td className="px-4 py-2 border">
                  {act.actcerrada ? "🔒 Cerrada" : "✅ Abierta"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
