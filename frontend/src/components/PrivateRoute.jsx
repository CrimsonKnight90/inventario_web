// ============================================================
// Archivo: frontend/src/components/PrivateRoute.jsx
// Descripción: Componente de ruta privada con soporte de roles.
//              Verifica autenticación y opcionalmente restringe
//              acceso según el rol del usuario.
// Autor: CrimsonKnight90
// ============================================================

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/**
 * PrivateRoute
 * @param {ReactNode} children - Componente hijo a renderizar si pasa validación
 * @param {Array<string>} roles - Lista opcional de roles permitidos
 */
export default function PrivateRoute({ children, roles = [] }) {
  const { isAuthenticated, user } = useAuth()

  // Si no hay sesión activa, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si se especifican roles y el usuario no cumple
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/403" replace /> // mejor UX que mandarlo al dashboard
  }

  // Si pasa validación, renderizar el hijo
  return children
}
