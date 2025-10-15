// ============================================================
// Archivo: frontend/src/pages/ProductosPage.jsx
// Descripción: Página de productos (i18n).
// Autor: CrimsonKnight90
// ============================================================

import {useEffect, useState} from "react"
import {useApiClient} from "../utils/apiClient"
import ProductoForm from "../components/ProductoForm"
import MovimientoForm from "../components/MovimientoForm"
import {useTranslation} from "react-i18next"

export default function ProductosPage() {
    const {request} = useApiClient()
    const {t} = useTranslation()
    const [productos, setProductos] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        request("/productos/")
            .then((res) => res.json())
            .then(setProductos)
            .catch((err) => {
                console.error(err)
                setError(t("productos.load_error"))
            })
    }, [])

    return (
        <div className="p-6 bg-white rounded shadow space-y-6">
            <h1 className="text-2xl font-bold">📦 {t("productos.title")}</h1>

            <ProductoForm onCreated={(nuevo) => setProductos([...productos, nuevo])}/>

            {error && <p className="text-red-600">{error}</p>}

            {productos.length === 0 ? (
                <p className="text-gray-600">{t("productos.empty")}</p>
            ) : (
                <ul className="space-y-4">
                    {productos.map((p) => (
                        <li key={p.id} className="border p-3 rounded flex flex-col space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{p.nombre}</span>
                                <span className="text-gray-500">
                  {t("productos.stock")}: {p.stock}
                </span>
                            </div>
                            <MovimientoForm
                                productoId={p.id}
                                onCreated={(mov) => {
                                    setProductos((prev) =>
                                        prev.map((prod) =>
                                            prod.id === p.id
                                                ? {
                                                    ...prod,
                                                    stock:
                                                        mov.tipo === "entrada"
                                                            ? prod.stock + mov.cantidad
                                                            : prod.stock - mov.cantidad,
                                                }
                                                : prod
                                        )
                                    )
                                }}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
