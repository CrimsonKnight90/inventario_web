//============================================================
// Archivo: src/store/config.store.ts
// Descripción: Store global de Zustand para gestionar la
//              configuración de la aplicación. Maneja estado,
//              persistencia en localStorage y sincronización.
// Autor: CrimsonKnight90
//============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  BrandingConfig,
  defaultBrandingConfig,
  mergeBrandingConfig,
  validateBrandingConfig,
  applyBrandingToDocument,
} from '../branding/config';

/**
 * Tipo para el tema de la aplicación
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Estado de la configuración
 */
interface ConfigState {
  // Configuración de branding
  config: BrandingConfig;

  // Tema actual
  themeMode: ThemeMode;

  // Estado de carga
  isLoading: boolean;

  // Errores
  error: string | null;

  // Sidebar colapsado
  isSidebarCollapsed: boolean;

  // Última actualización
  lastUpdated: string | null;
}

/**
 * Acciones del store
 */
interface ConfigActions {
  // Actualizar configuración completa
  updateConfig: (config: Partial<BrandingConfig>) => void;

  // Restaurar configuración por defecto
  resetConfig: () => void;

  // Cambiar tema
  setThemeMode: (mode: ThemeMode) => void;

  // Toggle sidebar
  toggleSidebar: () => void;

  // Establecer estado de sidebar
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Inicializar configuración
  initializeConfig: () => void;

  // Limpiar errores
  clearError: () => void;

  // Exportar configuración
  exportConfig: () => string;

  // Importar configuración
  importConfig: (jsonConfig: string) => void;
}

/**
 * Tipo completo del store
 */
type ConfigStore = ConfigState & ConfigActions;

/**
 * Clave para localStorage
 */
const STORAGE_KEY = 'app-config-store';

/**
 * Versión del storage (para migraciones futuras)
 */
const STORAGE_VERSION = 1;

/**
 * Logger de errores mejorado
 */
const logError = (context: string, error: unknown): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`[ConfigStore] Error en ${context}:`, errorMessage);

  // Aquí podrías enviar a un servicio de logging externo
  // sendToErrorTracking({ context, error: errorMessage });
};

/**
 * Detectar preferencia de tema del sistema
 */
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * Store de configuración con Zustand
 */
export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      config: defaultBrandingConfig,
      themeMode: 'auto',
      isLoading: false,
      error: null,
      isSidebarCollapsed: false,
      lastUpdated: null,

      /**
       * Actualizar configuración parcial o completa
       */
      updateConfig: (partialConfig: Partial<BrandingConfig>) => {
        try {
          set({ isLoading: true, error: null });

          // Validar configuración antes de aplicar
          validateBrandingConfig(partialConfig);

          // Combinar con configuración existente
          const currentConfig = get().config;
          const newConfig = mergeBrandingConfig({
            ...currentConfig,
            ...partialConfig,
          });

          // Aplicar al documento
          applyBrandingToDocument(newConfig);

          // Actualizar estado
          set({
            config: newConfig,
            lastUpdated: new Date().toISOString(),
            isLoading: false,
          });

          console.log('[ConfigStore] Configuración actualizada exitosamente');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          logError('updateConfig', error);

          set({
            error: `Error al actualizar configuración: ${errorMessage}`,
            isLoading: false,
          });
        }
      },

      /**
       * Restaurar configuración por defecto
       */
      resetConfig: () => {
        try {
          set({ isLoading: true, error: null });

          // Aplicar configuración por defecto
          applyBrandingToDocument(defaultBrandingConfig);

          set({
            config: defaultBrandingConfig,
            themeMode: 'auto',
            isSidebarCollapsed: false,
            lastUpdated: new Date().toISOString(),
            isLoading: false,
          });

          console.log('[ConfigStore] Configuración restaurada a valores por defecto');
        } catch (error) {
          logError('resetConfig', error);

          set({
            error: 'Error al restaurar configuración',
            isLoading: false,
          });
        }
      },

      /**
       * Cambiar modo de tema
       */
      setThemeMode: (mode: ThemeMode) => {
        try {
          set({ themeMode: mode });

          // Determinar tema efectivo
          const effectiveTheme = mode === 'auto' ? getSystemTheme() : mode;

          // Aplicar clase al documento
          if (effectiveTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }

          console.log(`[ConfigStore] Tema cambiado a: ${mode} (efectivo: ${effectiveTheme})`);
        } catch (error) {
          logError('setThemeMode', error);
        }
      },

      /**
       * Toggle del sidebar
       */
      toggleSidebar: () => {
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed,
        }));
      },

      /**
       * Establecer estado del sidebar
       */
      setSidebarCollapsed: (collapsed: boolean) => {
        set({ isSidebarCollapsed: collapsed });
      },

      /**
       * Inicializar configuración al cargar la app
       */
      initializeConfig: () => {
        try {
          const state = get();

          // Aplicar configuración cargada del localStorage
          applyBrandingToDocument(state.config);

          // Aplicar tema
          const effectiveTheme = state.themeMode === 'auto'
            ? getSystemTheme()
            : state.themeMode;

          if (effectiveTheme === 'dark') {
            document.documentElement.classList.add('dark');
          }

          // Escuchar cambios en preferencia del sistema
          if (state.themeMode === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e: MediaQueryListEvent) => {
              if (get().themeMode === 'auto') {
                if (e.matches) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              }
            };

            // Usar addEventListener en lugar de addListener (deprecated)
            mediaQuery.addEventListener('change', handleChange);
          }

          console.log('[ConfigStore] Configuración inicializada');
        } catch (error) {
          logError('initializeConfig', error);
        }
      },

      /**
       * Limpiar errores
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Exportar configuración como JSON
       */
      exportConfig: (): string => {
        try {
          const state = get();
          const exportData = {
            version: STORAGE_VERSION,
            config: state.config,
            themeMode: state.themeMode,
            exportedAt: new Date().toISOString(),
          };

          return JSON.stringify(exportData, null, 2);
        } catch (error) {
          logError('exportConfig', error);
          throw new Error('Error al exportar configuración');
        }
      },

      /**
       * Importar configuración desde JSON
       */
      importConfig: (jsonConfig: string) => {
        try {
          set({ isLoading: true, error: null });

          // Parsear JSON
          const importData = JSON.parse(jsonConfig);

          // Validar estructura
          if (!importData.config || !importData.version) {
            throw new Error('Formato de configuración inválido');
          }

          // Validar versión (para migraciones futuras)
          if (importData.version !== STORAGE_VERSION) {
            console.warn(`[ConfigStore] Versión de configuración diferente: ${importData.version}`);
          }

          // Validar y aplicar configuración
          validateBrandingConfig(importData.config);
          const newConfig = mergeBrandingConfig(importData.config);
          applyBrandingToDocument(newConfig);

          // Actualizar estado
          set({
            config: newConfig,
            themeMode: importData.themeMode || 'auto',
            lastUpdated: new Date().toISOString(),
            isLoading: false,
          });

          console.log('[ConfigStore] Configuración importada exitosamente');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          logError('importConfig', error);

          set({
            error: `Error al importar configuración: ${errorMessage}`,
            isLoading: false,
          });

          throw error;
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),

      // Solo persistir ciertos campos
      partialize: (state) => ({
        config: state.config,
        themeMode: state.themeMode,
        isSidebarCollapsed: state.isSidebarCollapsed,
        lastUpdated: state.lastUpdated,
      }),

      // Manejar errores de hidratación
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          logError('rehydrateStorage', error);
          console.warn('[ConfigStore] Error al cargar configuración guardada, usando valores por defecto');
        } else if (state) {
          console.log('[ConfigStore] Configuración cargada desde localStorage');
        }
      },
    }
  )
);

/**
 * Selector para obtener solo la configuración
 */
export const selectConfig = (state: ConfigStore) => state.config;

/**
 * Selector para obtener solo el tema
 */
export const selectThemeMode = (state: ConfigStore) => state.themeMode;

/**
 * Selector para obtener estado del sidebar
 */
export const selectSidebarCollapsed = (state: ConfigStore) => state.isSidebarCollapsed;