// ============================================================
// Archivo: frontend/src/hooks/useConfig.ts
// Descripción: Hook personalizado para acceder al store de
//              configuración de forma tipada y conveniente.
// Autor: CrimsonKnight90
// ============================================================

import { useConfigStore } from "@store/config.store";
import { useShallow } from "zustand/react/shallow"; // Importar useShallow
import type { AppConfig, BrandingConfig } from "../types/config.types";

/**
 * Hook personalizado para acceder a la configuración
 */
export function useConfig() {
  const config = useConfigStore((s) => s.config);
  const updateConfig = useConfigStore((s) => s.updateConfig);
  const resetConfig = useConfigStore((s) => s.resetConfig);
  const exportConfig = useConfigStore((s) => s.exportConfig);
  const importConfig = useConfigStore((s) => s.importConfig);
  const error = useConfigStore((s) => s.error);

  return {
    config,
    updateConfig,
    resetConfig,
    exportConfig,
    importConfig,
    error,
  };
}

/**
 * Hook para acceder solo a los colores
 */
export function useColors() {
  return useConfigStore((s) => s.config.colors);
}

/**
 * Hook para acceder solo al branding (optimizado y tipado con shallow)
 */
export function useBranding(): BrandingConfig {
  return useConfigStore(
    useShallow((s) => s.config.branding)
  );
}

/**
 * Hook para acceder solo al layout
 */
export function useLayout() {
  return useConfigStore((s) => s.config.layout);
}

/**
 * Hook para verificar si una característica está habilitada
 */
export function useFeature(feature: keyof AppConfig["features"]) {
  return useConfigStore((s) => s.config.features[feature]);
}
