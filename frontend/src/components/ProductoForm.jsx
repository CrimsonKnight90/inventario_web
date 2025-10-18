// ============================================================
// Archivo: frontend/src/components/ProductoForm.jsx
// Descripción: Formulario controlado para crear/editar productos (con i18n).
//              Reutilizable en modo creación y edición.
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { apiClient } from "../utils/apiClient"
import { useTranslation } from "react-i18next"
import AppForm from "./AppForm"
import AppInput from "./AppInput"
import AppButton from "./AppButton"
import AppHeading from "./AppHeading"
import AppSelect from "./AppSelect"

export default function ProductoForm({ onCreated, initialValues, onCreate, onUpdate }) {
  const { t } = useTranslation()
  const [nombre, setNombre] = useState(initialValues?.nombre || "")
  const [descripcion, setDescripcion] = useState(initialValues?.descripcion || "")
  const [existenciaMin, setExistenciaMin] = useState(initialValues?.existencia_min || "")
  const [existenciaMax, setExistenciaMax] = useState(initialValues?.existencia_max || "")
  const [categoriaId, setCategoriaId] = useState(initialValues?.categoria_id || "")
  const [umId, setUmId] = useState(initialValues?.um_id || "")
  const [monedaId, setMonedaId] = useState(initialValues?.moneda_id || "")

  const [categorias, setCategorias] = useState([])
  const [ums, setUms] = useState([])
  const [monedas, setMonedas] = useState([])

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // 🔹 Cargar catálogos activos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, umsData, monedasData] = await Promise.all([
          apiClient.get("/categorias/"),
          apiClient.get("/um/"),
          apiClient.get("/monedas/")
        ])
        setCategorias((cats || []).filter(c => c.activo))
        setUms((umsData || []).filter(u => u.activo))
        setMonedas((monedasData || []).filter(m => m.activo))
      } catch (err) {
        console.error("❌ Error cargando catálogos:", err)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // 🔹 Validación de existencias
    if (parseFloat(existenciaMin) > parseFloat(existenciaMax)) {
      setError(t("producto.error_existencias", { defaultValue: "La existencia mínima no puede ser mayor que la máxima" }))
      setLoading(false)
      return
    }

    try {
      const payload = {
        nombre,
        descripcion,
        existencia_min: parseFloat(existenciaMin),
        existencia_max: parseFloat(existenciaMax),
        categoria_id: categoriaId ? parseInt(categoriaId) : null,
        um_id: umId || null,
        moneda_id: monedaId || null,
      }

      if (initialValues?.id) {
        await onUpdate(initialValues.id, payload)
      } else {
        await onCreate(payload)
      }

      if (onCreated) onCreated()

      if (!initialValues) {
        setNombre("")
        setDescripcion("")
        setExistenciaMin("")
        setExistenciaMax("")
        setCategoriaId("")
        setUmId("")
        setMonedaId("")
      }
    } catch (err) {
      setError(err.message || t("producto.error_save", { defaultValue: "Error al guardar producto" }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppForm onSubmit={handleSubmit} className="space-y-4">
      <AppHeading level={2}>
        {initialValues?.id
          ? t("producto.edit_title", { defaultValue: "Editar producto" })
          : t("producto.create_title", { defaultValue: "Crear producto" })}
      </AppHeading>

      {error && <p className="text-red-600">{error}</p>}

      <AppInput
        type="text"
        placeholder={t("producto.name", { defaultValue: "Nombre" })}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <AppInput
        type="text"
        placeholder={t("producto.description", { defaultValue: "Descripción" })}
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      {/* Existencias */}
      <AppInput
        type="number"
        placeholder={t("producto.existencia_min", { defaultValue: "Existencia mínima" })}
        value={existenciaMin}
        onChange={(e) => setExistenciaMin(e.target.value)}
        required
      />

      <AppInput
        type="number"
        placeholder={t("producto.existencia_max", { defaultValue: "Existencia máxima" })}
        value={existenciaMax}
        onChange={(e) => setExistenciaMax(e.target.value)}
        required
      />

      {/* UM */}
      <AppSelect value={umId} onChange={(e) => setUmId(e.target.value)} disabled={ums.length === 0}>
        {ums.length === 0 ? (
          <option value="">{t("producto.no_um_moneda", { defaultValue: "Debe crear primero una UM y una Moneda" })}</option>
        ) : (
          <>
            <option value="">{t("producto.select_um", { defaultValue: "Selecciona una UM" })}</option>
            {ums.map((u) => (
              <option key={u.um} value={u.um}>{u.um}</option>
            ))}
          </>
        )}
      </AppSelect>

      {/* Moneda */}
      <AppSelect value={monedaId} onChange={(e) => setMonedaId(e.target.value)} disabled={monedas.length === 0}>
        {monedas.length === 0 ? (
          <option value="">{t("producto.no_um_moneda", { defaultValue: "Debe crear primero una UM y una Moneda" })}</option>
        ) : (
          <>
            <option value="">{t("producto.select_moneda", { defaultValue: "Selecciona una Moneda" })}</option>
            {monedas.map((m) => (
              <option key={m.nombre} value={m.nombre}>{m.nombre}</option>
            ))}
          </>
        )}
      </AppSelect>

      {/* Categoría */}
      <AppSelect value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} disabled={categorias.length === 0}>
        {categorias.length === 0 ? (
          <option value="">{t("producto.no_categoria", { defaultValue: "Debe crear primero una categoría" })}</option>
        ) : (
          <>
            <option value="">{t("producto.select_category", { defaultValue: "Selecciona una categoría" })}</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </>
        )}
      </AppSelect>

      <AppButton type="submit" variant="primary" size="md" className="w-full">
        {loading
          ? t("producto.saving", { defaultValue: "Guardando..." })
          : initialValues?.id
          ? t("producto.update_button", { defaultValue: "Actualizar" })
          : t("producto.create_button", { defaultValue: "Crear" })}
      </AppButton>
    </AppForm>
  )
}
