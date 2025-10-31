//============================================================
// Archivo: src/layout/Sidebar.tsx
// Descripción: Componente de barra lateral de navegación. Incluye
//              logo, menú de navegación, estado colapsado y
//              funcionalidad responsive.
// Autor: CrimsonKnight90
//============================================================

import React, { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  Package,
  DollarSign,
  BarChart3,
  FileText,
} from 'lucide-react';
import { useSidebar, useConfig } from '../hooks/useConfig';

/**
 * Tipo para un item del menú
 */
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
  badge?: string | number;
  disabled?: boolean;
}

/**
 * Tipo para una sección del menú
 */
interface MenuSection {
  id: string;
  title?: string;
  items: MenuItem[];
}

/**
 * Componente Sidebar
 *
 * Características:
 * - Navegación principal de la aplicación
 * - Estado colapsado/expandido
 * - Indicador visual de ruta activa
 * - Badges para notificaciones
 * - Responsive (drawer en móvil)
 * - Tooltips en estado colapsado
 */
const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar } = useSidebar();
  const { config } = useConfig();
  const location = useLocation();

  /**
   * Estructura del menú
   * En una aplicación real, esto podría venir de un servicio
   * o basarse en los permisos del usuario
   */
  const menuSections = useMemo((): MenuSection[] => [
    {
      id: 'main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          path: '/dashboard',
        },
      ],
    },
    {
      id: 'modules',
      title: 'Módulos',
      items: [
        {
          id: 'inventory',
          label: 'Inventario',
          icon: Package,
          path: '/inventory',
          disabled: true,
        },
        {
          id: 'sales',
          label: 'Ventas',
          icon: DollarSign,
          path: '/sales',
          disabled: true,
        },
        {
          id: 'hr',
          label: 'RR.HH.',
          icon: Users,
          path: '/hr',
          disabled: true,
        },
        {
          id: 'reports',
          label: 'Reportes',
          icon: BarChart3,
          path: '/reports',
          disabled: true,
        },
        {
          id: 'documents',
          label: 'Documentos',
          icon: FileText,
          path: '/documents',
          disabled: true,
        },
      ],
    },
    {
      id: 'settings',
      title: 'Sistema',
      items: [
        {
          id: 'config',
          label: 'Configuración',
          icon: Settings,
          path: '/config',
        },
      ],
    },
  ], []);

  /**
   * Verificar si una ruta está activa
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Renderizar un item del menú
   */
  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    const content = (
      <>
        <div className="flex-shrink-0">
          <Icon
            size={20}
            className={`
              ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}
              ${!item.disabled && 'group-hover:text-blue-600 dark:group-hover:text-blue-400'}
            `}
          />
        </div>

        {!isSidebarCollapsed && (
          <>
            <span
              className={`
                flex-1 text-sm font-medium
                ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}
                ${!item.disabled && 'group-hover:text-blue-600 dark:group-hover:text-blue-400'}
              `}
            >
              {item.label}
            </span>

            {item.badge && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold text-white bg-red-500 rounded-full">
                {item.badge}
              </span>
            )}
          </>
        )}

        {item.disabled && !isSidebarCollapsed && (
          <span className="text-xs text-gray-400 dark:text-gray-600">
            Próximamente
          </span>
        )}
      </>
    );

    if (item.disabled) {
      return (
        <div
          key={item.id}
          className="flex items-center gap-3 px-4 py-3 opacity-50 cursor-not-allowed"
          title={isSidebarCollapsed ? item.label : undefined}
        >
          {content}
        </div>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path}
        className={`
          group flex items-center gap-3 px-4 py-3 transition-colors duration-200
          ${active
            ? 'bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-600'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }
        `}
        title={isSidebarCollapsed ? item.label : undefined}
      >
        {content}
      </NavLink>
    );
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          ${isSidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {/* Logo y nombre de la app */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <Home size={18} className="text-white" />
            </div>

            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {config.appName}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  v{config.version}
                </p>
              </div>
            )}
          </div>

          {/* Botón de colapsar (solo en desktop) */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isSidebarCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={18} className="text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft size={18} className="text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuSections.map((section) => (
            <div key={section.id} className="mb-6">
              {/* Título de la sección */}
              {section.title && !isSidebarCollapsed && (
                <h2 className="px-4 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {section.title}
                </h2>
              )}

              {/* Separador visual en modo colapsado */}
              {section.title && isSidebarCollapsed && (
                <div className="px-4 mb-2">
                  <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>
              )}

              {/* Items del menú */}
              <div className="space-y-1">
                {section.items.map(renderMenuItem)}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {!isSidebarCollapsed ? (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="font-medium">{config.companyName}</p>
              <p className="mt-1">{config.environment === 'production' ? '🟢 Producción' : '🟡 Desarrollo'}</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className={`
                  w-3 h-3 rounded-full
                  ${config.environment === 'production' ? 'bg-green-500' : 'bg-yellow-500'}
                `}
                title={config.environment === 'production' ? 'Producción' : 'Desarrollo'}
              ></div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;