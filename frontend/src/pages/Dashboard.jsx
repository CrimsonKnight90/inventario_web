import {useAuth} from "../context/AuthContext"
import {useApiClient} from "../utils/apiClient"
import {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"

export default function Dashboard() {
    const {user, logout} = useAuth()
    const {request} = useApiClient()
    const {t} = useTranslation()
    const [productos, setProductos] = useState([])

    useEffect(() => {
        request("/productos/")
            .then((res) => res.json())
            .then(setProductos)
            .catch((err) => console.error(err))
    }, [])

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-green-100">
            <h1 className="text-3xl font-bold text-green-800 mb-6">
                ✅ {t("dashboard.welcome")}
            </h1>

            {user && (
                <p className="text-lg text-gray-700 mb-4">
                    {t("dashboard.session_as")}:{" "}
                    <span className="font-semibold">{user.email}</span> ({user.role})
                </p>
            )}

            <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
                {t("dashboard.logout")}
            </button>

            <div className="mt-6">
                <h2 className="text-xl font-semibold">📦 {t("dashboard.products")}</h2>
                <ul>
                    {productos.map((p) => (
                        <li key={p.id}>{p.nombre}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
