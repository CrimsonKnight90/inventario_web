// ============================================================
// Archivo: frontend/src/pages/parametros/TiposDocumentosPage.jsx
// Descripción: Gestión de Tipos de Documento (CRUD con activación/desactivación) (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useCatalogo } from "../../hooks/useCatalogo"
import CatalogoTable from "../../components/CatalogoTable"
import Notification from "../../components/Notification"
import { useTranslation } from "react-i18next"

export default function TiposDocumentosPage() {
  const { data: tipos, create, activate, deactivate } = useCatalogo("/tipos-documentos")
  const { t } = useTranslation()
  const [form, setForm] = useState({ clave: "", nombre: "", factor: 1 })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await create(form)
    setForm({ clave: "", nombre: "", factor: 1 })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <Notification />
      <h1 className="text-2xl font-bold mb-4">📑 {t("tipos_doc.title")}</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-2 mb-6">
        <input
          type="text"
          placeholder={t("tipos_doc.key_placeholder")}
          value={form.clave}
          onChange={(e) => setForm({ ...form, clave: e.target.value })}
          required
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder={t("tipos_doc.name_placeholder")}
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
          className="border px-3 py-2 rounded"
        />
        <select
          value={form.factor}
          onChange={(e) => setForm({ ...form, factor: parseInt(e.target.value) })}
          className="border px-3 py-2 rounded"
        >
          <option value={1}>{t("tipos_doc.factor_in")}</option>
          <option value={-1}>{t("tipos_doc.factor_out")}</option>
        </select>
        <button className="col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {t("tipos_doc.create_button")}
        </button>
      </form>

      {/* Tabla genérica */}
      <CatalogoTable
        data={tipos}
        columns={[
          { key: "clave", label: t("tipos_doc.key") },
          { key: "nombre", label: t("tipos_doc.name") },
          { key: "factor", label: t("tipos_doc.factor") }
        ]}
        onActivate={(t) => activate(t.clave)}
        onDeactivate={(t) => deactivate(t.clave)}
      />
    </div>
  )
}
