//============================================================
// Archivo: src/pages/AppConfig.page.tsx
// Descripción: Página de configuración de la aplicación. Permite
//              personalizar branding, colores, tipografía y otras
//              opciones. Incluye vista previa en tiempo real.
// Autor: CrimsonKnight90
//============================================================

import React, { useState, useCallback } from 'react';
import {
  Save,
  RotateCcw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  Palette,
  Type,
  Info,
} from 'lucide-react';
import PageContainer, { PageSection, PageCard } from '../layout/PageContainer';
import ConfigPreview from '../components/ConfigPreview';
import { useConfig, useConfigIO } from '../hooks/useConfig';
import type { BrandingConfig } from '../branding/config';

/**
 * Página de configuración de la aplicación
 *
 * Características:
 * - Personalización de branding
 * - Editor de colores con picker
 * - Configuración de tipografía
 * - Vista previa en tiempo real
 * - Importar/Exportar configuración
 * - Validación de cambios
 * - Restaurar valores por defecto
 */
const AppConfigPage: React.FC = () => {
  const {
    config,
    updateConfig,
    resetConfig,
    isLoading,
    error,
    clearError,
  } = useConfig();

  const { downloadConfig, uploadConfig } = useConfigIO();

  // Estado local para cambios pendientes
  const [pendingConfig, setPendingConfig] = useState<Partial<BrandingConfig>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * Verificar si hay cambios pendientes
   */
  const hasChanges = Object.keys(pendingConfig).length > 0;

  /**
   * Actualizar valor en configuración pendiente
   */
  const handleChange = useCallback(
    (key: keyof BrandingConfig, value: any) => {
      setPendingConfig((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  /**
   * Actualizar color
   */
  const handleColorChange = useCallback(
    (colorKey: string, value: string) => {
      setPendingConfig((prev) => ({
        ...prev,
        colors: {
          ...(config.colors || {}),
          ...(prev.colors || {}),
          [colorKey]: value,
        },
      }));
    },
    [config.colors]
  );

  /**
   * Guardar cambios
   */
  const handleSave = useCallback(() => {
    try {
      updateConfig(pendingConfig);
      setPendingConfig({});
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error al guardar configuración:', err);
    }
  }, [pendingConfig, updateConfig]);

  /**
   * Descartar cambios
   */
  const handleDiscard = useCallback(() => {
    setPendingConfig({});
    clearError();
  }, [clearError]);

  /**
   * Restaurar configuración por defecto
   */
  const handleReset = useCallback(() => {
    if (confirm('¿Estás seguro de que deseas restaurar la configuración por defecto?')) {
      resetConfig();
      setPendingConfig({});
    }
  }, [resetConfig]);

  /**
   * Manejar subida de archivo
   */
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        setUploadError(null);
        await uploadConfig(file);
        setPendingConfig({});
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al importar configuración';
        setUploadError(message);
      }

      // Limpiar input
      event.target.value = '';
    },
    [uploadConfig]
  );

  // Configuración efectiva (con cambios pendientes aplicados)
  const effectiveConfig: BrandingConfig = {
    ...config,
    ...pendingConfig,
    colors: {
      ...config.colors,
      ...pendingConfig.colors,
    },
  };

  return (
    <PageContainer
      title="Configuración de la Aplicación"
      description="Personaliza la apariencia y comportamiento del sistema"
      actions={
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={handleDiscard}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              Descartar
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            Guardar Cambios
          </button>
        </div>
      }
    >
      {/* Alertas */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-800 dark:text-green-200">
            Configuración guardada exitosamente
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Error al guardar configuración
            </p>
            <p className="text-xs text-red-600 dark:text-red-300 mt-1">{error}</p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            ✕
          </button>
        </div>
      )}

      {uploadError && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} className="text-orange-600 dark:text-orange-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Error al importar configuración
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-300 mt-1">{uploadError}</p>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Vista previa */}
      <PageSection title="Vista Previa" description="Visualización en tiempo real de los cambios">
        <PageCard>
          <ConfigPreview config={effectiveConfig} scale={0.4} />
        </PageCard>
      </PageSection>

      {/* Información general */}
      <PageSection title="Información General">
        <PageCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la Aplicación
              </label>
              <input
                type="text"
                value={pendingConfig.appName ?? config.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre de la aplicación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                value={pendingConfig.companyName ?? config.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre de la empresa"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={pendingConfig.appDescription ?? config.appDescription}
                onChange={(e) => handleChange('appDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción de la aplicación"
              />
            </div>
          </div>
        </PageCard>
      </PageSection>

      {/* Colores */}
      <PageSection title="Colores del Tema" description="Personaliza la paleta de colores">
        <PageCard>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.entries(effectiveConfig.colors).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>
        </PageCard>
      </PageSection>

      {/* Acciones avanzadas */}
      <PageSection title="Acciones Avanzadas">
        <PageCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={downloadConfig}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
            >
              <Download size={18} />
              Exportar Configuración
            </button>

            <label className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors cursor-pointer">
              <Upload size={18} />
              Importar Configuración
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-lg transition-colors"
            >
              <RotateCcw size={18} />
              Restaurar por Defecto
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-3">
            <Info size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Importante:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                <li>Los cambios se aplican inmediatamente al guardar</li>
                <li>Puedes exportar tu configuración para respaldo</li>
                <li>La importación sobrescribirá la configuración actual</li>
                <li>Restaurar por defecto eliminará todas las personalizaciones</li>
              </ul>
            </div>
          </div>
        </PageCard>
      </PageSection>
    </PageContainer>
  );
};

export default AppConfigPage;