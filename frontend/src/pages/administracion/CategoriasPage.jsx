// ============================================================
// Archivo: frontend/src/pages/administracion/CategoriasPage.jsx
// Descripción: Gestión de categorías (CRUD con soft delete) con tabla y formulario modal
// Autor: CrimsonKnight90
// ============================================================

import {useState} from "react"
import {useTranslation} from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppTable from "../../components/AppTable"
import AppButton from "../../components/AppButton"
import AppModal from "../../components/AppModal"
import AppInput from "../../components/AppInput"
import Notification from "../../components/Notification"
import {useCategorias} from "../../hooks/useCategorias"
import {useNotification} from "../../hooks/useNotification"

export default function CategoriasPage() {
    const {t} = useTranslation()
    const [mostrarInactivas, setMostrarInactivas] = useState(false)

    // Hook con flag incluirInactivos
    const {categorias, loading, create, update, deactivate, activate} =
        useCategorias({incluirInactivos: mostrarInactivas})

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editCategoria, setEditCategoria] = useState(null)
    const [form, setForm] = useState({nombre: "", descripcion: ""})

    const {notif, notify, clear} = useNotification()

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editCategoria) {
                await update(editCategoria.id, form)
            } else {
                await create(form)
            }
            setIsModalOpen(false)
            setForm({nombre: "", descripcion: ""})
            setEditCategoria(null)
        } catch (err) {
            notify.error(err.message || t("categorias.error_save", {defaultValue: "Error al guardar categoría"}))
        }
    }

    return (
        <AppPageContainer>
            <AppHeading level={1}>📂 {t("categorias.title", {defaultValue: "Categorías"})}</AppHeading>

            <AppSection>
                <div className="flex justify-between mb-4">
                    <AppButton
                        variant="primary"
                        onClick={() => {
                            setIsModalOpen(true)
                            setEditCategoria(null)
                            setForm({nombre: "", descripcion: ""})
                        }}
                    >
                        ➕ {t("categorias.add_button", {defaultValue: "Nueva Categoría"})}
                    </AppButton>

                    {/* 🔹 Botón toggle para mostrar inactivas */}
                    <AppButton
                        variant="secondary"
                        onClick={() => setMostrarInactivas(!mostrarInactivas)}
                    >
                        {mostrarInactivas
                            ? t("categorias.show_active", {defaultValue: "Ver solo activas"})
                            : t("categorias.show_all", {defaultValue: "Ver todas (incl. inactivas)"})}
                    </AppButton>
                </div>

                <AppTable
                    headers={[
                        "ID",
                        t("categorias.name", {defaultValue: "Nombre"}),
                        t("categorias.desc", {defaultValue: "Descripción"}),
                        t("categorias.status", {defaultValue: "Estado"}),
                        t("categorias.actions", {defaultValue: "Acciones"})
                    ]}
                >
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="py-4">⏳ {t("loading", {defaultValue: "Cargando..."})}</td>
                        </tr>
                    ) : categorias.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-4 text-gray-500">
                                {t("categorias.empty", {defaultValue: "No hay categorías"})}
                            </td>
                        </tr>
                    ) : (
                        categorias.map(cat => (
                            <tr key={cat.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">{cat.id}</td>
                                <td className="px-4 py-2 border">{cat.nombre}</td>
                                <td className="px-4 py-2 border">{cat.descripcion || "-"}</td>
                                <td className="px-4 py-2 border">
                                    {cat.activo
                                        ? t("categorias.active", {defaultValue: "Activa"})
                                        : t("categorias.inactive", {defaultValue: "Inactiva"})}
                                </td>
                                <td className="px-4 py-2 border space-x-2">
                                    <AppButton
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => {
                                            setEditCategoria(cat)
                                            setForm({nombre: cat.nombre, descripcion: cat.descripcion || ""})
                                            setIsModalOpen(true)
                                        }}
                                    >
                                        ✏️ {t("edit", {defaultValue: "Editar"})}
                                    </AppButton>

                                    {cat.activo ? (
                                        <AppButton size="sm" variant="danger" onClick={() => deactivate(cat.id)}>
                                            🗑️ {t("deactivate", {defaultValue: "Desactivar"})}
                                        </AppButton>
                                    ) : (
                                        <AppButton size="sm" variant="success" onClick={() => activate(cat.id)}>
                                            ♻️ {t("reactivate", {defaultValue: "Reactivar"})}
                                        </AppButton>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </AppTable>
            </AppSection>

            {/* Modal Crear/Editar */}
            <AppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editCategoria
                    ? t("categorias.edit_title", {defaultValue: "Editar Categoría"})
                    : t("categorias.create_title", {defaultValue: "Nueva Categoría"})}
                footer={
                    <>
                        <AppButton variant="secondary" onClick={() => setIsModalOpen(false)}>
                            {t("cancel", {defaultValue: "Cancelar"})}
                        </AppButton>
                        <AppButton variant="primary" type="submit" onClick={handleSubmit}>
                            {t("save", {defaultValue: "Guardar"})}
                        </AppButton>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm text-gray-600">
                            {t("categorias.name", {defaultValue: "Nombre"})}
                        </label>
                        <AppInput
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                            disabled={!!editCategoria && editCategoria.tieneProductos}
                        />
                        {editCategoria?.tieneProductos && (
                            <p className="mt-1 text-xs text-red-600">
                                ⚠️ {t("categorias.warning_edit_name", {
                                defaultValue: "No se puede cambiar el nombre de una categoría que ya tiene productos asociados."
                            })}
                            </p>
                        )}

                    </div>
                    <div>
                        <label className="block mb-1 text-sm text-gray-600">
                            {t("categorias.desc", {defaultValue: "Descripción"})}
                        </label>
                        <AppInput name="descripcion" value={form.descripcion} onChange={handleChange}/>
                    </div>
                </form>
            </AppModal>


            {/* Notificación global */}
            {notif.message && (
                <Notification
                    message={notif.message}
                    type={notif.type}
                    onClose={clear}
                />
            )}
        </AppPageContainer>
    )
}
