// ============================================================
// Archivo: frontend/src/layout/Topbar.tsx
// Descripción: Barra superior SIMPLIFICADA.
//              Solo muestra logo y nombre de empresa (configurables).
//              Sin breadcrumb para mantener UI limpia.
// Autor: CrimsonKnight90
// ============================================================

import { useAuthStore } from "@store/auth.store";
import { useBranding } from "@hooks/useConfig";
import { useTranslation } from "react-i18next";

export const Topbar = () => {
  const userEmail = useAuthStore((s) => s.user?.email);
  const logout = useAuthStore((s) => s.logout);
  const branding = useBranding();
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 py-3 shadow-sm">
      {/* ✅ Sección izquierda: Logo + Nombre de Empresa */}
      <div className="flex items-center space-x-3">
        <img
          src={branding.logoUrl}
          alt={branding.appName}
          className="h-10 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.src = "/assets/logo.svg";
          }}
        />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-[var(--color-text)]">
            {branding.companyName}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)]">
            {branding.appName}
          </span>
        </div>
      </div>

      {/* ✅ Sección derecha: Usuario + Logout */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-[var(--color-text)]">
            {userEmail || "Usuario"}
          </p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Administrador
          </p>
        </div>
        <button
          onClick={logout}
          className="text-sm bg-[var(--color-danger)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-danger-hover)] transition-colors font-medium"
        >
          {t("nav.logout")}
        </button>
      </div>
    </header>
  );
};