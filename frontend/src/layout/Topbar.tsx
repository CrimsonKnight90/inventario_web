//============================================================
// Archivo: src/layout/Topbar.tsx
// Descripción: Barra superior de la aplicación. Incluye toggle del
//              sidebar, breadcrumbs, búsqueda, notificaciones,
//              selector de tema y menú de usuario.
// Autor: CrimsonKnight90
//============================================================

import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useSidebar, useTheme } from '../hooks/useConfig';

/**
 * Componente Topbar
 *
 * Características:
 * - Toggle del sidebar (móvil y desktop)
 * - Breadcrumbs de navegación
 * - Barra de búsqueda
 * - Notificaciones
 * - Selector de tema (claro/oscuro/auto)
 * - Menú de usuario
 */
const Topbar: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  const { themeMode, setThemeMode, isDarkMode } = useTheme();
  const location = useLocation();

  // Estados para dropdowns
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Refs para detectar clicks fuera
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  /**
   * Generar breadcrumbs desde la ruta actual
   */
  const breadcrumbs = React.useMemo(() => {
    const paths = location.pathname.split('/').filter(Boolean);

    const breadcrumbItems = paths.map((path, index) => {
      const url = '/' + paths.slice(0, index + 1).join('/');
      const label = path.charAt(0).toUpperCase() + path.slice(1);

      return { label, url };
    });

    // Agregar "Inicio" al principio
    return [{ label: 'Inicio', url: '/' }, ...breadcrumbItems];
  }, [location.pathname]);

  /**
   * Cerrar menús al hacer click fuera
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Opciones del menú de tema
   */
  const themeOptions = [
    { value: 'light' as const, label: 'Claro', icon: Sun },
    { value: 'dark' as const, label: 'Oscuro', icon: Moon },
    { value: 'auto' as const, label: 'Automático', icon: Monitor },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
      <div className="flex items-center justify-between h-full px-4">
        {/* Lado izquierdo */}
        <div className="flex items-center gap-4">
          {/* Toggle Sidebar */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.url}>
                {index > 0 && (
                  <ChevronRight size={16} className="mx-2 text-gray-400" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-gray-900 dark:text-white">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.url}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Lado derecho */}
        <div className="flex items-center gap-2">
          {/* Búsqueda */}
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Buscar..."
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`
                w-64 px-4 py-2 pl-10 text-sm border rounded-lg
                bg-gray-50 dark:bg-gray-700
                border-gray-200 dark:border-gray-600
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200
                ${isSearchFocused ? 'w-80' : 'w-64'}
              `}
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Notificaciones */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            {/* Badge de notificaciones */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Selector de tema */}
          <div className="relative" ref={themeMenuRef}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Cambiar tema"
            >
              {isDarkMode ? (
                <Moon size={20} className="text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun size={20} className="text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Dropdown de tema */}
            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setThemeMode(option.value);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2 text-sm text-left
                        transition-colors
                        ${themeMode === option.value
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span>{option.label}</span>
                      {themeMode === option.value && (
                        <span className="ml-auto text-blue-600 dark:text-blue-400">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Menú de usuario */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Menú de usuario"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                Usuario
              </span>
            </button>

            {/* Dropdown de usuario */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
                {/* Información del usuario */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Usuario Administrador
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    admin@empresa.com
                  </p>
                </div>

                {/* Opciones del menú */}
                <Link
                  to="/config"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings size={18} />
                  <span>Configuración</span>
                </Link>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    // Aquí iría la lógica de logout
                    console.log('Cerrar sesión');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;