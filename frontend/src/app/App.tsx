//============================================================
// Archivo: src/app/App.tsx
// Descripción: Componente raíz de la aplicación. Configura el
//              enrutamiento principal, manejo de errores global
//              y providers necesarios.
// Autor: CrimsonKnight90
//============================================================

import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import { useConfigStore } from '../store/config.store';

/**
 * Lazy loading de páginas para optimización de rendimiento
 * Esto reduce el tamaño del bundle inicial
 */
const DashboardPage = lazy(() => import('../pages/Dashboard.page'));
const AppConfigPage = lazy(() => import('../pages/AppConfig.page'));

/**
 * Componente de carga mientras se cargan las páginas
 */
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 text-lg">Cargando...</p>
    </div>
  </div>
);

/**
 * Boundary de error para capturar errores de React
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Aquí podrías enviar el error a un servicio de logging
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-red-50 p-8">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0">
                <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Error en la Aplicación
                </h1>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
              </p>
              {this.state.error && (
                <details className="bg-gray-50 p-4 rounded border border-gray-200">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Detalles técnicos
                  </summary>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Componente principal de la aplicación
 *
 * Responsabilidades:
 * - Configurar enrutamiento
 * - Inicializar configuración global
 * - Proporcionar estructura de layout
 * - Manejar errores globales
 */
const App: React.FC = () => {
  const initializeConfig = useConfigStore((state) => state.initializeConfig);

  /**
   * Inicializar configuración al montar el componente
   * Esto carga la configuración guardada del localStorage
   */
  useEffect(() => {
    try {
      initializeConfig();
    } catch (error) {
      console.error('Error al inicializar configuración:', error);
      // No bloqueamos la aplicación, pero registramos el error
    }
  }, [initializeConfig]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Layout principal con rutas anidadas */}
            <Route path="/" element={<Layout />}>
              {/* Ruta por defecto redirige al dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* Dashboard principal */}
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Configuración de la aplicación */}
              <Route path="config" element={<AppConfigPage />} />

              {/* Ruta 404 - cualquier ruta no definida */}
              <Route
                path="*"
                element={
                  <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                      <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
                      <a
                        href="/dashboard"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                      >
                        Volver al Dashboard
                      </a>
                    </div>
                  </div>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;