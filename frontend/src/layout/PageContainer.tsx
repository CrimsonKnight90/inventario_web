//============================================================
// Archivo: src/layout/PageContainer.tsx
// Descripción: Contenedor reutilizable para páginas con padding,
//              espaciado consistente y opciones de personalización.
//              Proporciona estructura uniforme a todas las páginas.
// Autor: CrimsonKnight90
//============================================================

import React from 'react';

/**
 * Props del PageContainer
 */
interface PageContainerProps {
  /**
   * Contenido de la página
   */
  children: React.ReactNode;

  /**
   * Título de la página (opcional)
   */
  title?: string;

  /**
   * Descripción o subtítulo (opcional)
   */
  description?: string;

  /**
   * Acciones adicionales en el header (botones, etc.)
   */
  actions?: React.ReactNode;

  /**
   * Si true, reduce el padding interno
   */
  compact?: boolean;

  /**
   * Si true, el contenedor ocupa el ancho completo sin máximo
   */
  fullWidth?: boolean;

  /**
   * Clases CSS adicionales
   */
  className?: string;

  /**
   * Si true, muestra un separador después del header
   */
  divider?: boolean;
}

/**
 * Componente PageContainer
 *
 * Proporciona una estructura consistente para todas las páginas:
 * - Header con título, descripción y acciones
 * - Contenido con padding apropiado
 * - Opciones de personalización
 * - Responsive design
 *
 * @example
 * ```tsx
 * <PageContainer
 *   title="Dashboard"
 *   description="Vista general del sistema"
 *   actions={<Button>Nueva acción</Button>}
 * >
 *   <p>Contenido de la página...</p>
 * </PageContainer>
 * ```
 */
const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  description,
  actions,
  compact = false,
  fullWidth = false,
  className = '',
  divider = false,
}) => {
  // Determinar si hay header
  const hasHeader = title || description || actions;

  return (
    <div
      className={`
        min-h-full
        ${compact ? 'p-4' : 'p-6 md:p-8'}
        ${className}
      `}
    >
      {/* Contenedor con ancho máximo opcional */}
      <div className={fullWidth ? 'w-full' : 'max-w-7xl mx-auto'}>
        {/* Header de la página */}
        {hasHeader && (
          <div
            className={`
              ${compact ? 'mb-4' : 'mb-6 md:mb-8'}
              ${divider ? 'pb-4 md:pb-6 border-b border-gray-200 dark:border-gray-700' : ''}
            `}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Título y descripción */}
              <div className="flex-1 min-w-0">
                {title && (
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>

              {/* Acciones */}
              {actions && (
                <div className="flex-shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contenido de la página */}
        <div>{children}</div>
      </div>
    </div>
  );
};

/**
 * Componente auxiliar para secciones dentro de una página
 */
interface PageSectionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const PageSection: React.FC<PageSectionProps> = ({
  children,
  title,
  description,
  className = '',
}) => {
  return (
    <section className={`mb-8 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};

/**
 * Componente auxiliar para tarjetas dentro de una página
 */
interface PageCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: boolean;
  hoverable?: boolean;
}

export const PageCard: React.FC<PageCardProps> = ({
  children,
  title,
  className = '',
  padding = true,
  hoverable = false,
}) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        rounded-lg
        ${padding ? 'p-6' : ''}
        ${hoverable ? 'hover:shadow-lg transition-shadow duration-200' : ''}
        ${className}
      `}
    >
      {title && (
        <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${padding ? 'mb-4' : 'px-6 pt-6 pb-4'}`}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

/**
 * Componente auxiliar para grids responsivos
 */
interface PageGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PageGrid: React.FC<PageGridProps> = ({
  children,
  cols = 3,
  gap = 'md',
  className = '',
}) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[cols];

  const gapClass = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }[gap];

  return (
    <div className={`grid ${colsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;