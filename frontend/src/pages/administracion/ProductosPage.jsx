// ============================================================
// Archivo: frontend/src/pages/administracion/ProductosPage.jsx
// Descripción: Página de gestión de productos con tabla, modal y formulario.
//              Integra el hook useProductos y pasa onCreate/onUpdate al formulario
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import ProductoTable from "../../components/ProductoTable"
import AppButton from "../../components/AppButton"
import AppModal from "../../components/AppModal"
import Notification from "../../components/Notification"
import ProductoForm from "../../components/ProductoForm"
import { useProductos } from "../../hooks/useProductos"
import { useNotification } from "../../hooks/useNotification"

export default function ProductosPage() {
  const { t } = useTranslation()
  const [mostrarInactivos, setMostrarInactivos] = useState(false)
  const { productos, loading, create, update, deactivate, activate } =
    useProductos({ incluirInactivos: mostrarInactivos })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editProducto, setEditProducto] = useState(null)
  const { notif, clear } = useNotification()

  return (
    <AppPageContainer>
      <AppHeading level={1}>📦 {t("productos.title", { defaultValue: "Gestión de Productos" })}</AppHeading>

      <AppSection>
        <div className="flex justify-between mb-4">
          <AppButton
            variant="primary"
            onClick={() => {
              setIsModalOpen(true)
              setEditProducto(null)
            }}
          >
            ➕ {t("producto.create_button", { defaultValue: "Nuevo Producto" })}
          </AppButton>

          <AppButton
            variant="secondary"
            onClick={() => setMostrarInactivos(!mostrarInactivos)}
          >
            {mostrarInactivos
              ? t("productos.show_active", { defaultValue: "Ver solo activos" })
              : t("productos.show_all", { defaultValue: "Ver todos (incl. inactivos)" })}
          </AppButton>
        </div>

        <ProductoTable
          data={productos}
          onEdit={(p) => {
            setEditProducto(p)
            setIsModalOpen(true)
          }}
          onDeactivate={deactivate}
          onActivate={activate}
        />
      </AppSection>

      {/* Modal Crear/Editar */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editProducto
            ? t("producto.edit_title", { defaultValue: "Editar Producto" })
            : t("producto.create_title", { defaultValue: "Nuevo Producto" })
        }
      >
        <ProductoForm
          initialValues={editProducto}
          onCreated={() => {
            setIsModalOpen(false)
            setEditProducto(null)
          }}
          onCreate={create}
          onUpdate={update}
        />
      </AppModal>

      {/* Notificación global */}
      {notif.message && (
        <Notification message={notif.message} type={notif.type} onClose={clear} />
      )}
    </AppPageContainer>
  )
}
