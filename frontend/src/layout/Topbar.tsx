// ============================================================
// Archivo: frontend/src/layout/Topbar.tsx
// Descripción: Barra superior optimizada y memoizada para evitar
//              re-renders innecesarios.
// Autor: CrimsonKnight90
// ============================================================

import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@store/auth.store";
import { useConfigStore } from "@store/config.store";

/**
 * Seleccionadores mínimos: solo valores primitivos que lee Topbar.
 * Evitar seleccionar objetos enteros para prevenir re-renders.
 */
const selectUserEmail = (s: any) => s.user?.email;
const selectLogout = (s: any) => s.logout;
const selectLogoUrl = (s: any) => s.config.branding.logoUrl;
const selectAppName = (s: any) => s.config.branding.appName;
const selectCompanyName = (s: any) => s.config.branding.companyName;

function TopbarInner() {
  const { t } = useTranslation();

  // selectores mínimos desde la store
  const userEmail = useAuthStore(selectUserEmail);
  const logout = useAuthStore(selectLogout);

  const logoUrl = useConfigStore(selectLogoUrl);
  const appName = useConfigStore(selectAppName);
  const companyName = useConfigStore(selectCompanyName);

  const brandingInfo = useMemo(
    () => ({
      logoUrl: logoUrl || "/assets/logo.svg",
      companyName: companyName || "Empresa",
      appName: appName || "Inventario Empresarial",
    }),
    [logoUrl, companyName, appName]
  );

  return (
    <header className="flex items-center justify-between bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 py-3 shadow-sm">
      <div className="flex items-center space-x-3">
        <img
          src={brandingInfo.logoUrl}
          alt={brandingInfo.appName}
          className="h-10 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.src = "/assets/logo.svg";
          }}
        />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-[var(--color-text)]">
            {brandingInfo.companyName}
          </span>
          <span className="text-xs text-[var(--color-text-secondary)]">
            {brandingInfo.appName}
          </span>
        </div>
      </div>

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
}

// Memoizar el componente para estabilidad de render
export const Topbar = memo(TopbarInner);
Topbar.displayName = "Topbar";
