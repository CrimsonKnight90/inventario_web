// ============================================================
// Archivo: frontend/src/components/AppConfirmDialog.jsx
// Descripción: Diálogo de confirmación genérico basado en AppModal
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import AppModal from "./AppModal"
import AppButton from "./AppButton"
import { useTranslation } from "react-i18next"

export default function AppConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  confirmVariant = "danger", // por defecto rojo para acciones destructivas
  size = "sm",
}) {
  const { t } = useTranslation()

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onCancel}
      title={title || t("confirm.title", { defaultValue: "Confirmar acción" })}
      size={size}
      footer={
        <>
          <AppButton variant="secondary" onClick={onCancel}>
            {cancelText || t("confirm.cancel", { defaultValue: "Cancelar" })}
          </AppButton>
          <AppButton variant={confirmVariant} onClick={onConfirm}>
            {confirmText || t("confirm.accept", { defaultValue: "Aceptar" })}
          </AppButton>
        </>
      }
    >
      <p className="text-gray-700">{message}</p>
    </AppModal>
  )
}
