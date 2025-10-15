// ============================================================
// Archivo: frontend/src/pages/parametros/UMPage.jsx
// Descripción: Gestión de UM (CRUD con activación/desactivación) (i18n)
// Autor: CrimsonKnight90
// ============================================================

import {useState} from "react"
import {useCatalogo} from "../../hooks/useCatalogo"
import CatalogoTable from "../../components/CatalogoTable"
import Notification from "../../components/Notification"
import {useTranslation} from "react-i18next"

export default function UMPage() {
    const {data: ums, create, activate, deactivate} = useCatalogo("/um")
    const {t} = useTranslation()
    const [form, setForm] = useState({um: "", factor: 1})

    const handleSubmit = async (e) => {
        e.preventDefault()
        await create(form)
        setForm({um: "", factor: 1})
    }

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
            <Notification/>
            <h1 className="text-2xl font-bold mb-4">⚖️ {t("um.title")}</h1>

            <form onSubmit={handleSubmit} className="flex space-x-2 mb-6">
                <input
                    type="text"
                    placeholder={t("um.key_placeholder")}
                    value={form.um}
                    onChange={(e) => setForm({...form, um: e.target.value})}
                    required
                    className="border px-3 py-2 rounded w-32"
                />
                <input
                    type="number"
                    placeholder={t("um.factor_placeholder")}
                    value={form.factor}
                    onChange={(e) => setForm({...form, factor: parseInt(e.target.value) || 0})}
                    className="border px-3 py-2 rounded w-32"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {t("um.create_button")}
                </button>
            </form>

            <CatalogoTable
                data={ums}
                columns={[
                    {key: "um", label: "UM"},
                    {key: "factor", label: t("um.factor")}
                ]}
                onActivate={(u) => activate(u.um)}
                onDeactivate={(u) => deactivate(u.um)}
            />
        </div>
    )
}
