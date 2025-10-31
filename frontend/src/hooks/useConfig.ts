//============================================================
// Archivo: src/hooks/useConfig.ts
// Descripción: Hook personalizado para acceder y modificar la
//              configuración de la aplicación. Proporciona una
//              interfaz simplificada sobre el store de Zustand.
// Autor: CrimsonKnight90
//============================================================

import { useCallback, useMemo } from 'react';
import { useConfigStore } from '../store/config.store';
import type { BrandingConfig, ThemeColors } from '../branding/config';
import type { ThemeMode } from '../store/config.store';

/**
 * Tipo de retorno del hook useConfig
 */
interface UseConfigReturn {
  // Estado actual
  config: BrandingConfig;
  themeMode: ThemeMode;
  isSidebarCollapsed: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;

  // Acciones
  updateConfig: (config: Partial<BrandingConfig>) => void;
  resetConfig: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  clearError: () => void;
  exportConfig: () => string;
  importConfig: (jsonConfig: string) => void;

  // Utilidades computadas
  colors: ThemeColors;
  appName: string;
  effectiveTheme: 'light' | 'dark';
}

/**
 * Hook personalizado para gestionar la configuración
 *
 * Este hook proporciona:
 * - Acceso al estado global de configuración
 * - Métodos para actualizar la configuración
 * - Valores computados útiles
 * - Manejo de errores
 *
 * @returns Objeto con estado y métodos de configuración
 *
 * @example
 * ```tsx
 * const { config, updateConfig, themeMode, setThemeMode } = useConfig();
 *
 * // Actualizar nombre de la app
 * updateConfig({ appName: 'Nueva App' });
 *
 * // Cambiar tema
 * setThemeMode('dark');
 * ```
 */
export const useConfig = (): UseConfigReturn => {
  // Seleccionar estado del store
  const config = useConfigStore((state) => state.config);
  const themeMode = useConfigStore((state) => state.themeMode);
  const isSidebarCollapsed = useConfigStore((state) => state.isSidebarCollapsed);
  const isLoading = useConfigStore((state) => state.isLoading);
  const error = useConfigStore((state) => state.error);
  const lastUpdated = useConfigStore((state) => state.lastUpdated);

  // Seleccionar acciones del store
  const updateConfig = useConfigStore((state) => state.updateConfig);
  const resetConfig = useConfigStore((state) => state.resetConfig);
  const setThemeMode = useConfigStore((state) => state.setThemeMode);
  const toggleSidebar = useConfigStore((state) => state.toggleSidebar);
  const setSidebarCollapsed = useConfigStore((state) => state.setSidebarCollapsed);
  const clearError = useConfigStore((state) => state.clearError);
  const exportConfig = useConfigStore((state) => state.exportConfig);
  const importConfig = useConfigStore((state) => state.importConfig);

  /**
   * Obtener tema efectivo (resolver 'auto')
   */
  const effectiveTheme = useMemo((): 'light' | 'dark' => {
    if (themeMode === 'auto') {
      // Verificar preferencia del sistema
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      return 'light';
    }
    return themeMode;
  }, [themeMode]);

  /**
   * Acceso rápido a colores
   */
  const colors = useMemo(() => config.colors, [config.colors]);

  /**
   * Acceso rápido al nombre de la app
   */
  const appName = useMemo(() => config.appName, [config.appName]);

  return {
    // Estado
    config,
    themeMode,
    isSidebarCollapsed,
    isLoading,
    error,
    lastUpdated,

    // Acciones
    updateConfig,
    resetConfig,
    setThemeMode,
    toggleSidebar,
    setSidebarCollapsed,
    clearError,
    exportConfig,
    importConfig,

    // Computadas
    colors,
    appName,
    effectiveTheme,
  };
};

/**
 * Hook para acceder solo a los colores del tema
 * Optimización para componentes que solo necesitan colores
 *
 * @returns Colores del tema actual
 */
export const useThemeColors = (): ThemeColors => {
  return useConfigStore((state) => state.config.colors);
};

/**
 * Hook para acceder solo al estado del sidebar
 * Optimización para componentes del layout
 *
 * @returns Estado y métodos del sidebar
 */
export const useSidebar = () => {
  const isSidebarCollapsed = useConfigStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useConfigStore((state) => state.toggleSidebar);
  const setSidebarCollapsed = useConfigStore((state) => state.setSidebarCollapsed);

  return {
    isSidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
  };
};

/**
 * Hook para gestionar el tema
 * Proporciona métodos adicionales para trabajar con temas
 *
 * @returns Información y métodos del tema
 */
export const useTheme = () => {
  const themeMode = useConfigStore((state) => state.themeMode);
  const setThemeMode = useConfigStore((state) => state.setThemeMode);
  const colors = useConfigStore((state) => state.config.colors);

  /**
   * Determinar si el tema actual es oscuro
   */
  const isDarkMode = useMemo((): boolean => {
    if (themeMode === 'auto') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      return false;
    }
    return themeMode === 'dark';
  }, [themeMode]);

  /**
   * Alternar entre modo claro y oscuro
   */
  const toggleTheme = useCallback(() => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setThemeMode(newMode);
  }, [isDarkMode, setThemeMode]);

  /**
   * Establecer modo automático
   */
  const setAutoTheme = useCallback(() => {
    setThemeMode('auto');
  }, [setThemeMode]);

  return {
    themeMode,
    isDarkMode,
    colors,
    setThemeMode,
    toggleTheme,
    setAutoTheme,
  };
};

/**
 * Hook para gestión de errores de configuración
 *
 * @returns Información y métodos de errores
 */
export const useConfigError = () => {
  const error = useConfigStore((state) => state.error);
  const clearError = useConfigStore((state) => state.clearError);
  const isLoading = useConfigStore((state) => state.isLoading);

  const hasError = useMemo(() => error !== null, [error]);

  return {
    error,
    hasError,
    isLoading,
    clearError,
  };
};

/**
 * Hook para importar/exportar configuración
 *
 * @returns Métodos de importación/exportación
 */
export const useConfigIO = () => {
  const exportConfig = useConfigStore((state) => state.exportConfig);
  const importConfig = useConfigStore((state) => state.importConfig);
  const isLoading = useConfigStore((state) => state.isLoading);
  const error = useConfigStore((state) => state.error);

  /**
   * Exportar configuración y descargar como archivo
   */
  const downloadConfig = useCallback(() => {
    try {
      const configJson = exportConfig();
      const blob = new Blob([configJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `app-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar configuración:', error);
      throw error;
    }
  }, [exportConfig]);

  /**
   * Importar configuración desde archivo
   */
  const uploadConfig = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          importConfig(content);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsText(file);
    });
  }, [importConfig]);

  return {
    exportConfig,
    importConfig,
    downloadConfig,
    uploadConfig,
    isLoading,
    error,
  };
};

export default useConfig;