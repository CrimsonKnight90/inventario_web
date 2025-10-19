// ============================================================
// Archivo: frontend/src/pages/listados/ProveedoresPage.jsx
// Descripción: Página de listado de proveedores (solo lectura).
//              Usa CatalogoTable para mostrar datos con estado.
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import CatalogoTable from "../../components/CatalogoTable"
import { useProveedores } from "../../hooks/useProveedores"

export default function ProveedoresPage() {
  const { t } = useTranslation()
  const [mostrarInactivos, setMostrarInactivos] = useState(false)
  const { proveedores, loading } = useProveedores({ incluirInactivos: mostrarInactivos })

  return (
    <AppPageContainer>
      <AppHeading level={1}>
        🧑‍💼 {t("proveedores.list_title", { defaultValue: "Listado de Proveedores" })}
      </AppHeading>

      <AppSection>
        <div className="flex justify-end mb-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            onClick={() => setMostrarInactivos(!mostrarInactivos)}
          >
            {mostrarInactivos
              ? t("proveedores.show_active", { defaultValue: "Ver solo activos" })
              : t("proveedores.show_all", { defaultValue: "Ver todos (incl. inactivos)" })}
          </button>
        </div>

        <CatalogoTable
          data={proveedores}
          columns={[
            { key: "id", label: "ID" },
            { key: "nombre", label: t("proveedor.name", { defaultValue: "Nombre" }) },
          ]}
        />

        {loading && (
          <p className="text-center text-gray-500 mt-4">
            {t("proveedores.loading", { defaultValue: "Cargando proveedores..." })}
          </p>
        )}
      </AppSection>
    </AppPageContainer>
  )
}
