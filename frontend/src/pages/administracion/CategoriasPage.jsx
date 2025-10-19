// ============================================================
// Archivo: frontend/src/pages/administracion/CategoriasPage.jsx
// Descripción: Gestión de categorías (CRUD con soft delete) usando CatalogoTable y CategoriaForm
// Autor: CrimsonKnight90
// ============================================================

import { useState } from "react"
import { useTranslation } from "react-i18next"
import AppPageContainer from "../../components/AppPageContainer"
import AppSection from "../../components/AppSection"
import AppHeading from "../../components/AppHeading"
import AppButton from "../../components/AppButton"
import AppModal from "../../components/AppModal"
import Notification from "../../components/Notification"
import AppConfirmDialog from "../../components/AppConfirmDialog"
import CatalogoTable from "../../components/CatalogoTable"
import CategoriaForm from "../../components/CategoriaForm"
import { useCategorias } from "../../hooks/useCategorias"
import { useNotification } from "../../hooks/useNotification"

export default function CategoriasPage() {
  const { t } = useTranslation()
  const [mostrarInactivas, setMostrarInactivas] = useState(false)

  // 🔹 Notificación global
  const { notif, notify, clear } = useNotification()

  // 🔹 Hook de categorías
  const { categorias, loading, create, update, deactivate, activate } =
    useCategorias({ incluirInactivos: mostrarInactivas, notify })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editCategoria, setEditCategoria] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, action: null, payload: null })

  return (
    <AppPageContainer>
      {/* 🔹 Notificación global */}
      <Notification message={notif.message} type={notif.type} onClose={clear} />

      <AppHeading level={1}>
        📂 {t("categorias.title", { defaultValue: "Categorías" })}
      </AppHeading>

      <AppSection>
        <div className="flex justify-between mb-4">
          <AppButton
            variant="primary"
            onClick={() => {
              setIsModalOpen(true)
              setEditCategoria(null)
            }}
          >
            ➕ {t("categorias.add_button", { defaultValue: "Nueva Categoría" })}
          </AppButton>

          <AppButton variant="secondary" onClick={() => setMostrarInactivas(!mostrarInactivas)}>
            {mostrarInactivas
              ? t("categorias.show_active", { defaultValue: "Ver solo activas" })
              : t("categorias.show_all", { defaultValue: "Ver todas (incl. inactivas)" })}
          </AppButton>
        </div>

        {/* 🔹 Tabla genérica */}
        <CatalogoTable
          data={categorias}
          loading={loading}
          columns={[
            { key: "id", label: "ID" },
            { key: "nombre", label: t("categorias.name", { defaultValue: "Nombre" }) },
            { key: "descripcion", label: t("categorias.desc", { defaultValue: "Descripción" }) },
          ]}
          onEdit={(c) => {
            setEditCategoria(c)
            setIsModalOpen(true)
          }}
          onDeactivate={(c) =>
            setConfirm({
              open: true,
              action: "deactivate",
              payload: { id: c.id, nombre: c.nombre },
            })
          }
          onActivate={(c) =>
            setConfirm({
              open: true,
              action: "activate",
              payload: { id: c.id, nombre: c.nombre },
            })
          }
        />
      </AppSection>

      {/* 🔹 Modal Crear/Editar */}
      <AppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editCategoria
            ? t("categorias.edit_title", { defaultValue: "Editar Categoría" })
            : t("categorias.create_title", { defaultValue: "Nueva Categoría" })
        }
      >
        <CategoriaForm
          initialValues={editCategoria}
          onCreated={() => {
            setIsModalOpen(false)
            setEditCategoria(null)
          }}
          onCreate={create}
          onUpdate={update}
        />
      </AppModal>

      {/* 🔹 Confirmación de acciones */}
      <AppConfirmDialog
        isOpen={confirm.open}
        message={
          confirm.action === "deactivate"
            ? t("categorias.confirm_deactivate", {
                id: confirm.payload?.id,
                nombre: confirm.payload?.nombre,
                defaultValue: `¿Seguro que deseas desactivar la categoría "${confirm.payload?.id}" con nombre "${confirm.payload?.nombre}"?`,
              })
            : t("categorias.confirm_activate", {
                id: confirm.payload?.id,
                nombre: confirm.payload?.nombre,
                defaultValue: `¿Seguro que deseas reactivar la categoría "${confirm.payload?.id}" con nombre "${confirm.payload?.nombre}"?`,
              })
        }
        onCancel={() => setConfirm({ open: false, action: null, payload: null })}
        onConfirm={async () => {
          if (confirm.action === "deactivate") {
            await deactivate(confirm.payload.id)
          } else {
            await activate(confirm.payload.id)
          }
          setConfirm({ open: false, action: null, payload: null })
        }}
      />
    </AppPageContainer>
  )
}
