// ============================================================
// Archivo: frontend/src/components/NavItem.jsx
// Descripción: Link de navegación con hover dinámico según branding
// Autor: CrimsonKnight90
// ============================================================

import { Link } from "react-router-dom"
import { useBranding } from "../context/BrandingContext"

export default function NavItem({ to, children }) {
  const { branding } = useBranding()
  const hoverColor = branding?.secondary_color || "#3B82F6"

  return (
    <Link
      to={to}
      className="block px-3 py-2 rounded transition"
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {children}
    </Link>
  )
}
