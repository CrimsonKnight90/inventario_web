// ============================================================
// Archivo: frontend/src/pages/parametros/MonedasPage.jsx
// Descripción: Gestión de Monedas (CRUD con activación/desactivación) (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useCatalogo } from "../../hooks/useCatalogo"
import CatalogoTable from "../../components/CatalogoTable"
import Notification from "../../components/Notification"
import { useTranslation } from "react-i18next"

export default function MonedasPage() {
  const { data: monedas, create, activate, deactivate } = useCatalogo("/monedas")
  const { t } = useTranslation()
  const [form, setForm] = useState({ nombre: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await create(form)
    setForm({ nombre: "" })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <Notification />
      <h1 className="text-2xl font-bold mb-4">💱 {t("monedas.title")}</h1>

      <form onSubmit={handleSubmit} className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder={t("monedas.name_placeholder")}
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
          className="border px-3 py-2 rounded w-48"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {t("monedas.create_button")}
        </button>
      </form>

      <CatalogoTable
        data={monedas}
        columns={[{ key: "nombre", label: t("monedas.name") }]}
        onActivate={(m) => activate(m.nombre)}
        onDeactivate={(m) => deactivate(m.nombre)}
      />
    </div>
  )
}
