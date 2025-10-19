// ============================================================
// Archivo: frontend/src/pages/AdminPage.jsx
// Descripción: Panel de administración con gestión de usuarios (i18n)
// Autor: CrimsonKnight90
// ============================================================

import { useEffect, useState } from "react"
import { apiClient } from "../utils/apiClient"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../components/AppPageContainer"
import AppSection from "../components/AppSection"
import AppHeading from "../components/AppHeading"
import AppForm from "../components/AppForm"
import AppInput from "../components/AppInput"
import AppSelect from "../components/AppSelect"
import AppButton from "../components/AppButton"
import Notification from "../components/Notification"
import { useNotification } from "../hooks/useNotification"
import AppConfirmDialog from "../components/AppConfirmDialog"
import CatalogoTable from "../components/CatalogoTable"

export default function AdminPage() {
  const { t } = useTranslation()

  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)

  // 🔹 Notificación global
  const { notif, notify, clear } = useNotification()

  // 🔹 Confirmación de acciones
  const [confirm, setConfirm] = useState({ open: false, action: null, payload: null })

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    role: "empleado",
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await apiClient.get("/usuarios/")
      setUsuarios(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      notify.error(t("admin.error_load", { defaultValue: "Error al cargar usuarios" }))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const validarPassword = (pwd) =>
    pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[^A-Za-z0-9]/.test(pwd)

  const handleCrearUsuario = async (e) => {
    e.preventDefault()
    if (!emailRegex.test(nuevoUsuario.email)) {
      notify.error(t("admin.invalid_email", { defaultValue: "Email inválido" }))
      return
    }
    if (!validarPassword(nuevoUsuario.password)) {
      notify.error(t("admin.invalid_password", { defaultValue: "Contraseña inválida" }))
      return
    }
    try {
      await apiClient.post("/usuarios/", nuevoUsuario)
      notify.success(t("admin.user_created", { defaultValue: "Usuario creado correctamente" }))
      setNuevoUsuario({ nombre: "", email: "", password: "", role: "empleado" })
      fetchData()
    } catch (err) {
      notify.error(err.message || t("admin.error_create_user", { defaultValue: "Error al crear usuario" }))
    }
  }

  const handleCambiarRol = async (id, nuevoRol) => {
    try {
      await apiClient.put(`/usuarios/${id}/rol`, { role: nuevoRol })
      notify.success(t("admin.role_updated", { defaultValue: "Rol actualizado" }))
      fetchData()
    } catch (err) {
      notify.error(err.message || t("admin.error_change_role", { defaultValue: "Error al cambiar rol" }))
    }
  }

  const handleEliminarUsuario = async (id) => {
    try {
      await apiClient.delete(`/usuarios/${id}`)
      notify.warning(t("admin.user_deleted", { defaultValue: "Usuario eliminado" }))
      fetchData()
    } catch (err) {
      notify.error(err.message || t("admin.error_delete_user", { defaultValue: "Error al eliminar usuario" }))
    }
  }

  return (
    <AppPageContainer>
      {/* 🔹 Notificación global */}
      <Notification message={notif.message} type={notif.type} onClose={clear} />

      <AppHeading level={1}>🛠️ {t("admin.title", { defaultValue: "Administración" })}</AppHeading>

      {/* Crear usuario */}
      <AppSection>
        <AppHeading level={2}>➕ {t("admin.create_user", { defaultValue: "Crear usuario" })}</AppHeading>
        <AppForm onSubmit={handleCrearUsuario} className="space-y-4">
          <AppInput
            type="text"
            placeholder={t("admin.name", { defaultValue: "Nombre" })}
            value={nuevoUsuario.nombre}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
            required
          />

          <AppInput
            type="email"
            placeholder="Email"
            value={nuevoUsuario.email}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
            required
          />

          <AppInput
            type="password"
            placeholder={t("admin.password", { defaultValue: "Contraseña" })}
            value={nuevoUsuario.password}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
            required
          />

          <AppSelect
            value={nuevoUsuario.role}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
          >
            <option value="empleado">{t("admin.role_employee", { defaultValue: "Empleado" })}</option>
            <option value="admin">{t("admin.role_admin", { defaultValue: "Administrador" })}</option>
          </AppSelect>

          <AppButton type="submit" variant="primary" size="md" className="w-full">
            {t("admin.create_user_button", { defaultValue: "Crear usuario" })}
          </AppButton>
        </AppForm>
      </AppSection>

      {/* Gestión de usuarios */}
      <AppSection>
        <AppHeading level={2}>👥 {t("admin.user_management", { defaultValue: "Gestión de usuarios" })}</AppHeading>
        <CatalogoTable
          data={usuarios}
          loading={loading}
          showEstado={false} // 🔹 no aplica estado activo/inactivo en usuarios
          columns={[
            { key: "id", label: "ID" },
            { key: "nombre", label: t("admin.name", { defaultValue: "Nombre" }) },
            { key: "email", label: "Email" },
            { key: "role", label: t("admin.role", { defaultValue: "Rol" }) },
          ]}
          renderActions={(u) => (
            <div className="inline-flex flex-col sm:flex-row gap-2 justify-center items-center">
              <AppButton
                variant="success"
                size="sm"
                className="w-40"
                onClick={() =>
                  handleCambiarRol(u.id, u.role === "admin" ? "empleado" : "admin")
                }
              >
                ♻️ {t("admin.change_role_to", {
                  role: u.role === "admin"
                    ? t("admin.role_employee", { defaultValue: "Empleado" })
                    : t("admin.role_admin", { defaultValue: "Administrador" }),
                })}
              </AppButton>

              <AppButton
                variant="danger"
                size="sm"
                className="w-40"
                onClick={() => setConfirm({ open: true, action: "delete", payload: u })}
              >
                🗑️ {t("admin.delete", { defaultValue: "Eliminar" })}
              </AppButton>
            </div>
          )}
        />
      </AppSection>

      {/* Confirmación de eliminación */}
      <AppConfirmDialog
        isOpen={confirm.open}
        message={
          confirm.action === "delete"
            ? t("admin.confirm_delete_user", {
                nombre: confirm.payload?.nombre,
                defaultValue: `¿Seguro que deseas eliminar al usuario "${confirm.payload?.nombre}"?`,
              })
            : ""
        }
        onCancel={() => setConfirm({ open: false, action: null, payload: null })}
        onConfirm={async () => {
          if (confirm.action === "delete") {
            await handleEliminarUsuario(confirm.payload.id)
          }
          setConfirm({ open: false, action: null, payload: null })
        }}
      />
    </AppPageContainer>
  )
}
