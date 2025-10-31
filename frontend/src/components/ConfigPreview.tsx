//============================================================
// Archivo: src/components/ConfigPreview.tsx
// Descripción: Componente de vista previa en tiempo real de la
//              configuración de la aplicación. Muestra cómo se
//              verán los cambios antes de aplicarlos.
// Autor: CrimsonKnight90
//============================================================

import React from 'react';
import { Home, Menu, Search, Bell, Sun, User } from 'lucide-react';
import type { BrandingConfig } from '../branding/config';

/**
 * Props del ConfigPreview
 */
interface ConfigPreviewProps {
  /**
   * Configuración a previsualizar
   */
  config: BrandingConfig;

  /**
   * Escala del preview (porcentaje)
   */
  scale?: number;

  /**
   * Mostrar controles interactivos
   */
  interactive?: boolean;
}

/**
 * Componente ConfigPreview
 *
 * Muestra una vista previa miniatura de cómo se verá la aplicación
 * con la configuración proporcionada.
 *
 * Características:
 * - Preview responsive
 * - Actualización en tiempo real
 * - Muestra colores, logos y tipografía
 * - Versión no interactiva para mejor rendimiento
 */
const ConfigPreview: React.FC<ConfigPreviewProps> = ({
  config,
  scale = 0.5,
  interactive = false,
}) => {
  return (
    <div
      className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
      }}
    >
      {/* Container del preview */}
      <div className="w-full h-full flex" style={{ minHeight: '600px' }}>
        {/* Sidebar Preview */}
        <aside
          className="w-64 flex-shrink-0 border-r"
          style={{
            backgroundColor: config.colors.surface,
            borderColor: config.colors.border,
          }}
        >
          {/* Header del sidebar */}
          <div
            className="h-16 px-4 flex items-center justify-between border-b"
            style={{ borderColor: config.colors.border }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: config.colors.primary }}
              >
                <Home size={18} className="text-white" />
              </div>
              <div>
                <div
                  className="text-sm font-bold"
                  style={{
                    color: config.colors.text,
                    fontFamily: config.typography.headingFontFamily,
                  }}
                >
                  {config.appName}
                </div>
                <div
                  className="text-xs"
                  style={{ color: config.colors.textSecondary }}
                >
                  v{config.version}
                </div>
              </div>
            </div>
          </div>

          {/* Items del menú */}
          <nav className="py-4">
            {/* Item activo */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-r-4"
              style={{
                backgroundColor: config.colors.primary + '10',
                borderColor: config.colors.primary,
              }}
            >
              <div style={{ color: config.colors.primary }}>
                <Menu size={20} />
              </div>
              <span
                className="text-sm font-medium"
                style={{
                  color: config.colors.primary,
                  fontFamily: config.typography.fontFamily,
                }}
              >
                Dashboard
              </span>
            </div>

            {/* Items inactivos */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  color: config.colors.textSecondary,
                }}
              >
                <Menu size={20} />
                <span
                  className="text-sm"
                  style={{ fontFamily: config.typography.fontFamily }}
                >
                  Menú {i}
                </span>
              </div>
            ))}
          </nav>
        </aside>

        {/* Área principal */}
        <div className="flex-1 flex flex-col">
          {/* Topbar Preview */}
          <header
            className="h-16 px-6 flex items-center justify-between border-b"
            style={{
              backgroundColor: config.colors.surface,
              borderColor: config.colors.border,
            }}
          >
            {/* Lado izquierdo */}
            <div className="flex items-center gap-4">
              <button
                className="p-2 rounded-lg"
                style={{
                  color: config.colors.textSecondary,
                  backgroundColor: config.colors.background,
                }}
              >
                <Menu size={20} />
              </button>
              <div
                className="text-sm"
                style={{
                  color: config.colors.text,
                  fontFamily: config.typography.fontFamily,
                }}
              >
                Inicio / Dashboard
              </div>
            </div>

            {/* Lado derecho */}
            <div className="flex items-center gap-2">
              {/* Búsqueda */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: config.colors.background,
                  borderColor: config.colors.border,
                }}
              >
                <Search
                  size={16}
                  style={{ color: config.colors.textSecondary }}
                />
                <span
                  className="text-xs"
                  style={{ color: config.colors.textSecondary }}
                >
                  Buscar...
                </span>
              </div>

              {/* Iconos */}
              <button
                className="p-2 rounded-lg"
                style={{
                  color: config.colors.textSecondary,
                  backgroundColor: config.colors.background,
                }}
              >
                <Bell size={18} />
              </button>
              <button
                className="p-2 rounded-lg"
                style={{
                  color: config.colors.textSecondary,
                  backgroundColor: config.colors.background,
                }}
              >
                <Sun size={18} />
              </button>
              <button
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: config.colors.primary,
                }}
              >
                <User size={18} className="text-white" />
              </button>
            </div>
          </header>

          {/* Contenido */}
          <main
            className="flex-1 p-6"
            style={{ backgroundColor: config.colors.background }}
          >
            {/* Título */}
            <h1
              className="text-3xl font-bold mb-6"
              style={{
                color: config.colors.text,
                fontFamily: config.typography.headingFontFamily,
                fontWeight: config.typography.fontWeights.bold,
              }}
            >
              Dashboard
            </h1>

            {/* Grid de tarjetas */}
            <div className="grid grid-cols-3 gap-6">
              {/* Tarjetas de estadísticas */}
              {[
                { label: 'Total', value: '1,234', color: config.colors.primary },
                { label: 'Activos', value: '856', color: config.colors.success },
                { label: 'Pendientes', value: '378', color: config.colors.warning },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: config.colors.surface,
                    borderColor: config.colors.border,
                    border: `1px solid ${config.colors.border}`,
                  }}
                >
                  <div
                    className="text-sm mb-2"
                    style={{ color: config.colors.textSecondary }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="text-2xl font-bold"
                    style={{
                      color: stat.color,
                      fontFamily: config.typography.headingFontFamily,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Tarjeta de contenido */}
            <div
              className="mt-6 p-6 rounded-lg"
              style={{
                backgroundColor: config.colors.surface,
                borderColor: config.colors.border,
                border: `1px solid ${config.colors.border}`,
              }}
            >
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  color: config.colors.text,
                  fontFamily: config.typography.headingFontFamily,
                }}
              >
                Actividad Reciente
              </h2>

              {/* Líneas de contenido simulado */}
              <div className="space-y-3">
                {[100, 80, 60, 90].map((width, index) => (
                  <div
                    key={index}
                    className="h-3 rounded"
                    style={{
                      backgroundColor: config.colors.border,
                      width: `${width}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ConfigPreview;