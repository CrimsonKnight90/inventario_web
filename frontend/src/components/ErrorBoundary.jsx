// ============================================================
// Archivo: frontend/src/components/ErrorBoundary.jsx
// Descripción: Componente Error Boundary para capturar errores de renderizado
//              y mostrar un mensaje amigable en lugar de pantalla en blanco.
// Autor: CrimsonKnight90
// ============================================================

import React from "react"
import AppHeading from "./AppHeading"
import AppButton from "./AppButton"

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI alternativa
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Aquí podrías enviar el error a un servicio de logging
    console.error("❌ Error capturado por ErrorBoundary:", error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
          <AppHeading level={1}>⚠️ Algo salió mal</AppHeading>
          <p className="text-gray-600 mb-6">
            Ha ocurrido un error inesperado en esta sección.
          </p>
          <AppButton variant="primary" onClick={this.handleReload}>
            Recargar página
          </AppButton>
        </div>
      )
    }

    return this.props.children
  }
}
