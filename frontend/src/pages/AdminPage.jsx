// ============================================================
// Archivo: frontend/src/pages/AdminPage.jsx
// Descripción: Panel de administración con gestión completa de usuarios
// Autor: CrimsonKnight90
// ============================================================

import {useEffect, useState} from "react"
import {useAuth} from "../context/AuthContext"
import {useApiClient} from "../utils/apiClient"

export default function AdminPage() {
    const {user, logout} = useAuth()
    const {request} = useApiClient()

    const [stats, setStats] = useState({productos: 0, actividades: 0, cerradas: 0, usuarios: 0})
    const [usuarios, setUsuarios] = useState([])
    const [empresas, setEmpresas] = useState([]) // 🔹 lista de empresas
    const [error, setError] = useState("")
    const [mensaje, setMensaje] = useState("")

    // Formulario de creación de usuario
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: "",
        email: "",
        password: "",
        role: "empleado",
        empresa_id: "",
    })

    // Cargar estadísticas, usuarios y empresas
    const fetchData = async () => {
        try {
            const [prodRes, actRes, cerrRes, usrRes, empRes] = await Promise.all([
                request("/productos/"),
                request("/actividades/"),
                request("/actividades/cerradas"),
                request("/usuarios/"),
                request("/empresas/"), // 🔹 cargar empresas
            ])

            const productos = await prodRes.json()
            const actividades = await actRes.json()
            const cerradas = await cerrRes.json()
            const usuarios = await usrRes.json()
            const empresas = await empRes.json()

            setStats({
                productos: productos.length,
                actividades: actividades.length,
                cerradas: cerradas.length,
                usuarios: usuarios.length,
            })
            setUsuarios(usuarios)
            setEmpresas(empresas)
        } catch (err) {
            setError("❌ Error al cargar datos administrativos")
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Crear usuario
    const handleCrearUsuario = async (e) => {
        e.preventDefault()
        try {
            const res = await request("/usuarios/", {
                method: "POST",
                body: JSON.stringify(nuevoUsuario),
            })
            if (!res.ok) throw new Error("Error al crear usuario")
            setMensaje("✅ Usuario creado correctamente")
            setNuevoUsuario({nombre: "", email: "", password: "", role: "empleado", empresa_id: ""})
            fetchData()
        } catch (err) {
            setMensaje("❌ " + err.message)
        }
    }

    // Cambiar rol
    const handleCambiarRol = async (id, nuevoRol) => {
        try {
            const res = await request(`/usuarios/${id}/rol`, {
                method: "PUT",
                body: JSON.stringify({role: nuevoRol}),
            })
            if (!res.ok) throw new Error("Error al cambiar rol")
            setMensaje("✅ Rol actualizado")
            fetchData()
        } catch (err) {
            setMensaje("❌ " + err.message)
        }
    }

    // Eliminar usuario
    const handleEliminarUsuario = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return
        try {
            const res = await request(`/usuarios/${id}`, {method: "DELETE"})
            if (!res.ok) throw new Error("Error al eliminar usuario")
            setMensaje("✅ Usuario eliminado")
            fetchData()
        } catch (err) {
            setMensaje("❌ " + err.message)
        }
    }

    return (
        <div className="min-h-screen bg-yellow-50 p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-yellow-800">🛠️ Panel de Administración</h1>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Cerrar sesión
                </button>
            </div>

            {user && (
                <p className="mb-6 text-gray-700">
                    Sesión iniciada como: <span className="font-semibold">{user.email}</span> ({user.role})
                </p>
            )}

            {error && <p className="text-red-600 mb-4">{error}</p>}
            {mensaje && <p className="mb-4">{mensaje}</p>}

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white shadow rounded p-4 text-center">
                    <p className="text-2xl font-bold">{stats.productos}</p>
                    <p className="text-gray-500">Productos</p>
                </div>
                <div className="bg-white shadow rounded p-4 text-center">
                    <p className="text-2xl font-bold">{stats.actividades}</p>
                    <p className="text-gray-500">Actividades</p>
                </div>
                <div className="bg-white shadow rounded p-4 text-center">
                    <p className="text-2xl font-bold">{stats.cerradas}</p>
                    <p className="text-gray-500">Cerradas</p>
                </div>
                <div className="bg-white shadow rounded p-4 text-center">
                    <p className="text-2xl font-bold">{stats.usuarios}</p>
                    <p className="text-gray-500">Usuarios</p>
                </div>
            </div>

            {/* Formulario de creación de usuario */}
            <h2 className="text-xl font-semibold mb-4">➕ Crear Usuario</h2>
            <form onSubmit={handleCrearUsuario} className="bg-white p-4 rounded shadow mb-8 space-y-3">
                <input
                    type="text"
                    placeholder="Nombre"
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
                    placeholder="Contraseña"
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
                    <option value="empleado">Empleado</option>
                    <option value="admin">Admin</option>
                </select>

                {/* 🔹 Selector de empresa */}
                <select
                    value={nuevoUsuario.empresa_id}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, empresa_id: parseInt(e.target.value)})}
                    className="w-full border px-3 py-2 rounded"
                    required
                >
                    <option value="">Seleccione una empresa</option>
                    {empresas.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                            {emp.nombre}
                        </option>
                    ))}
                </select>

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Crear Usuario
                </button>
            </form>

            {/* Tabla de usuarios */}
            <h2 className="text-xl font-semibold mb-4">👥 Gestión de Usuarios</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded shadow">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 border">ID</th>
                        <th className="px-4 py-2 border">Email</th>
                        <th className="px-4 py-2 border">Rol</th>
                        <th className="px-4 py-2 border">Empresa</th>
                        {/* ✅ ahora nombre */}
                        <th className="px-4 py-2 border">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border">{u.id}</td>
                            <td className="px-4 py-2 border">{u.email}</td>
                            <td className="px-4 py-2 border">{u.role}</td>
                            <td className="px-4 py-2 border">{u.empresa_nombre || "—"}</td>
                            {/* ✅ nombre */}
                            <td className="px-4 py-2 border space-x-2">
                                <button
                                    onClick={() =>
                                        handleCambiarRol(u.id, u.role === "admin" ? "empleado" : "admin")
                                    }
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                                >
                                    Cambiar a {u.role === "admin" ? "Empleado" : "Admin"}
                                </button>
                                <button
                                    onClick={() => handleEliminarUsuario(u.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Eliminar
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

