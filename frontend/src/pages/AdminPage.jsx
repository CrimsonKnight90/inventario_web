// ============================================================
// Archivo: frontend/src/pages/AdminPage.jsx
// Descripción: Panel de administración con gestión completa de usuarios (i18n)
// Autor: CrimsonKnight90
// ============================================================

import {useEffect, useState} from "react"
import {useAuth} from "../context/AuthContext"
import {apiClient} from "../utils/apiClient"
import {useTranslation} from "react-i18next"

export default function AdminPage() {
    const {user, logout} = useAuth()
    const {t} = useTranslation()

    const [stats, setStats] = useState({productos: 0, actividades: 0, cerradas: 0, usuarios: 0})
    const [usuarios, setUsuarios] = useState([])
    const [empresas, setEmpresas] = useState([])
    const [error, setError] = useState("")
    const [mensaje, setMensaje] = useState("")

    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: "",
        email: "",
        password: "",
        role: "empleado",
        empresa_id: ""
    })

    const fetchData = async () => {
        try {
            const [productos, actividades, cerradas, usuarios, empresas] = await Promise.all([
                apiClient.get("/productos/"),
                apiClient.get("/actividades/"),
                apiClient.get("/actividades/cerradas"),
                apiClient.get("/usuarios/"),
                apiClient.get("/empresas/")
            ])

            setStats({
                productos: productos.length,
                actividades: actividades.length,
                cerradas: cerradas.length,
                usuarios: usuarios.length
            })
            setUsuarios(usuarios)
            setEmpresas(empresas)
        } catch (err) {
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

        if (!nuevoUsuario.empresa_id) {
            setMensaje("❌ " + t("admin.no_company"))
            return
        }

        try {
            await apiClient.post("/usuarios/", nuevoUsuario)
            setMensaje(t("admin.user_created"))
            setNuevoUsuario({nombre: "", email: "", password: "", role: "empleado", empresa_id: ""})
            fetchData()
        } catch (err) {
            setMensaje("❌ " + (err.message || t("admin.error_create_user")))
        }
    }

    const handleCambiarRol = async (id, nuevoRol) => {
        try {
            await apiClient.put(`/usuarios/${id}/rol`, {role: nuevoRol})
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
        <div className="min-h-screen bg-yellow-50 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-yellow-800">🛠️ {t("admin.title")}</h1>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    {t("dashboard.logout")}
                </button>
            </div>

            {user && (
                <p className="mb-6 text-gray-700">
                    {t("dashboard.session_as")}: <span className="font-semibold">{user.email}</span> ({user.role})
                </p>
            )}

            {error && <p className="text-red-600 mb-4">{error}</p>}
            {mensaje && <p className="mb-4">{mensaje}</p>}

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white shadow rounded p-4 text-center">
                    <p className="text-2xl font-bold">{stats.productos}</p>
                    <p className="text-gray-500">{t("admin.stats.products")}</p>
                </div>
                <div className="bg-white shadow rounded p-4 text-center">
                    <p className="text-2xl font-bold">{stats.actividades}</p>
                    <p className="text-gray-500">{t("admin.stats.activities")}</p>
                </div>
                <div className="bg-white shadow rounded p-4 text-center">
                    <p className="text-2xl font-bold">{stats.cerradas}</p>
                    <p className="text-gray-500">{t("admin.stats.closed")}</p>
                </div>
                <div className="bg-white shadow rounded p-4 text-center">
                    <p className="text-2xl font-bold">{stats.usuarios}</p>
                    <p className="text-gray-500">{t("admin.stats.users")}</p>
                </div>
            </div>

            {/* Formulario de creación de usuario */}
            <h2 className="text-xl font-semibold mb-4">➕ {t("admin.create_user")}</h2>
            <form onSubmit={handleCrearUsuario} className="bg-white p-4 rounded shadow mb-8 space-y-3">
                <input
                    type="text"
                    placeholder={t("admin.name")}
                    value={nuevoUsuario.nombre}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={nuevoUsuario.email}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder={t("admin.password")}
                    value={nuevoUsuario.password}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <select
                    value={nuevoUsuario.role}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, role: e.target.value})}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="empleado">{t("admin.role_employee")}</option>
                    <option value="admin">{t("admin.role_admin")}</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={empresas.length === 0}
                >
                    {t("admin.create_user_button")}
                </button>
            </form>

            {/* Tabla de usuarios */}
            <h2 className="text-xl font-semibold mb-4">👥 {t("admin.user_management")}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded shadow">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">{t("admin.role")}</th>
                        <th className="px-4 py-2 border">{t("admin.actions")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{u.id}</td>
                            <td className="px-4 py-2 border">{u.email}</td>
                            <td className="px-4 py-2 border">{u.role}</td>
                            <td className="px-4 py-2 border space-x-2">
                                <button
                                    onClick={() =>
                                        handleCambiarRol(u.id, u.role === "admin" ? "empleado" : "admin")
                                    }
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                >
                                    {t("admin.change_role_to", {
                                        role: u.role === "admin"
                                            ? t("admin.role_employee")
                                            : t("admin.role_admin")
                                    })}
                                </button>
                                <button
                                    onClick={() => handleEliminarUsuario(u.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                >
                                    {t("admin.delete")}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
