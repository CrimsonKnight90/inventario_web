// ============================================================
// Archivo: frontend/src/components/CategoriaForm.jsx
// Descripción: Formulario para crear/editar categorías con validación especial
// Autor: CrimsonKnight90
// ============================================================

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import AppInput from "./AppInput"
import AppButton from "./AppButton"

export default function CategoriaForm({ initialValues, onCreate, onUpdate, onCreated }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ nombre: "", descripcion: "" })

  // 🔹 Resetear formulario cuando cambien los valores iniciales
  useEffect(() => {
    setForm({
      nombre: initialValues?.nombre || "",
      descripcion: initialValues?.descripcion || "",
    })
  }, [initialValues])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (initialValues?.id) {
      await onUpdate(initialValues.id, form)
    } else {
      await onCreate(form)
    }
    onCreated?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block mb-1 text-sm text-gray-600">
          {t("categorias.name", { defaultValue: "Nombre" })}
        </label>
        <AppInput
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          disabled={!!initialValues?.tieneProductos}
        />
        {initialValues?.tieneProductos && (
          <p className="mt-1 text-xs text-red-600">
            ⚠️{" "}
            {t("categorias.warning_edit_name", {
              defaultValue:
                "No se puede cambiar el nombre de una categoría que ya tiene productos asociados.",
            })}
          </p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block mb-1 text-sm text-gray-600">
          {t("categorias.desc", { defaultValue: "Descripción" })}
        </label>
        <AppInput
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-2">
        <AppButton type="submit" variant="primary">
          {t("save", { defaultValue: "Guardar" })}
        </AppButton>
      </div>
    </form>
  )
}
