// ============================================================
// Archivo: frontend/src/components/NavItem.jsx
// Descripción: Link de navegación que usa la variable CSS --hover-bg para hover (sin manipulación DOM)
// Autor: CrimsonKnight90
// ============================================================

import { Link } from "react-router-dom";
import { useBranding } from "../context/BrandingContext";

export default function NavItem({ to, children }) {
  const { branding } = useBranding();
  const hoverBg = branding?.colors?.secondary || "#F59E0B";

  // Evitamos mutar DOM en eventos; seteamos la variable solo para compatibilidad si se usa fuera del aside.
  const style = { ["--hover-bg"]: hoverBg };

  return (
    <Link
      to={to}
      className="block px-3 py-2 rounded transition-colors duration-150 text-white hover:bg-[var(--hover-bg)] hover:text-black/90"
      style={style}
    >
      {children}
    </Link>
  );
}
