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
import AppTable from "../components/AppTable"

export default function AdminPage() {
  const { t } = useTranslation()

  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState("")
  const [mensaje, setMensaje] = useState("")

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    role: "empleado",
  })

  const fetchData = async () => {
    try {
      const data = await apiClient.get("/usuarios/")
      setUsuarios(Array.isArray(data) ? data : data.results || [])
    } catch (err) {
      console.error("❌ Error en fetchData:", err)
      setError("❌ " + t("admin.error_load"))
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
      setMensaje("❌ " + t("admin.invalid_email"))
      return
    }
    if (!validarPassword(nuevoUsuario.password)) {
      setMensaje("❌ " + t("admin.invalid_password"))
      return
    }
    try {
      await apiClient.post("/usuarios/", nuevoUsuario)
      setMensaje(t("admin.user_created"))
      setNuevoUsuario({ nombre: "", email: "", password: "", role: "empleado" })
      fetchData()
    } catch (err) {
      console.error("❌ Error creando usuario:", err)
      setMensaje("❌ " + (err.message || t("admin.error_create_user")))
    }
  }

  const handleCambiarRol = async (id, nuevoRol) => {
    try {
      await apiClient.put(`/usuarios/${id}/rol`, { role: nuevoRol })
      setMensaje(t("admin.role_updated"))
      fetchData()
    } catch (err) {
      setMensaje("❌ " + (err.message || t("admin.error_change_role")))
    }
  }

  const handleEliminarUsuario = async (id) => {
    if (!window.confirm(t("admin.confirm_delete"))) return
    try {
      await apiClient.delete(`/usuarios/${id}`)
      setMensaje(t("admin.user_deleted"))
      fetchData()
    } catch (err) {
      setMensaje("❌ " + (err.message || t("admin.error_delete_user")))
    }
  }

  return (
    <AppPageContainer>
      <AppHeading level={1}>🛠️ {t("admin.title")}</AppHeading>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {mensaje && <p className="mb-4">{mensaje}</p>}

      <AppSection>
        <AppHeading level={2}>➕ {t("admin.create_user")}</AppHeading>
        <AppForm onSubmit={handleCrearUsuario} className="space-y-4">
          <AppInput
            type="text"
            placeholder={t("admin.name")}
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
            placeholder={t("admin.password")}
            value={nuevoUsuario.password}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
            required
          />

          <AppSelect
            value={nuevoUsuario.role}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
          >
            <option value="empleado">{t("admin.role_employee")}</option>
            <option value="admin">{t("admin.role_admin")}</option>
          </AppSelect>

          <AppButton type="submit" variant="primary" size="md" className="w-full">
            {t("admin.create_user_button")}
          </AppButton>
        </AppForm>
      </AppSection>

      <AppSection>
        <AppHeading level={2}>👥 {t("admin.user_management")}</AppHeading>
        <AppTable
          headers={["ID", t("admin.name"), "Email", t("admin.role"), t("admin.actions")]}
        >
          {Array.isArray(usuarios) &&
            usuarios.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{u.id}</td>
                <td className="px-4 py-2 border">{u.nombre}</td>
                <td className="px-4 py-2 border truncate max-w-[220px]">{u.email}</td>
                <td className="px-4 py-2 border">{u.role}</td>
                <td className="px-4 py-2 border">
                  <div className="inline-flex flex-col sm:flex-row gap-2 justify-center items-center">
                    <AppButton
                      variant="success"
                      size="sm"
                      className="w-40"
                      onClick={() =>
                        handleCambiarRol(u.id, u.role === "admin" ? "empleado" : "admin")
                      }
                    >
                      ♻️{t("admin.change_role_to", {
                        role:
                          u.role === "admin"
                            ? t("admin.role_employee")
                            : t("admin.role_admin"),
                      })}
                    </AppButton>

                    <AppButton
                      variant="danger"
                      size="sm"
                      className="w-40"
                      onClick={() => handleEliminarUsuario(u.id)}
                    >
                      🗑️{t("admin.delete")}
                    </AppButton>
                  </div>
                </td>
              </tr>
            ))}
        </AppTable>
      </AppSection>
    </AppPageContainer>
  )
}
