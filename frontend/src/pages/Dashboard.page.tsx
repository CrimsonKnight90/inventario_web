//============================================================
// Archivo: src/pages/Dashboard.page.tsx
// Descripción: Página principal del dashboard. Muestra métricas,
//              estadísticas y resumen de actividades del sistema.
//              Dashboard responsivo con componentes modulares.
// Autor: CrimsonKnight90
//============================================================

import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import PageContainer, { PageCard, PageGrid, PageSection } from '../layout/PageContainer';
import { useConfig } from '../hooks/useConfig';

/**
 * Tipo para una tarjeta de estadística
 */
interface StatCardData {
  id: string;
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
}

/**
 * Tipo para una actividad reciente
 */
interface RecentActivity {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
}

/**
 * Página Dashboard
 *
 * Características:
 * - Métricas clave del sistema
 * - Gráficos y estadísticas
 * - Actividad reciente
 * - Alertas y notificaciones
 * - Responsive design
 */
const DashboardPage: React.FC = () => {
  const { config } = useConfig();

  /**
   * Datos de tarjetas de estadísticas
   * En producción, estos datos vendrían de una API
   */
  const statsCards = useMemo((): StatCardData[] => [
    {
      id: 'users',
      label: 'Total Usuarios',
      value: '2,543',
      change: 12.5,
      changeLabel: 'vs mes anterior',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 'inventory',
      label: 'Productos',
      value: '8,234',
      change: -3.2,
      changeLabel: 'vs mes anterior',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 'revenue',
      label: 'Ingresos',
      value: '$54,239',
      change: 8.1,
      changeLabel: 'vs mes anterior',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'activity',
      label: 'Actividad',
      value: '1,234',
      change: 5.7,
      changeLabel: 'vs semana anterior',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ], []);

  /**
   * Actividades recientes
   * En producción, estos datos vendrían de una API
   */
  const recentActivities = useMemo((): RecentActivity[] => [
    {
      id: '1',
      type: 'success',
      title: 'Nueva venta registrada',
      description: 'Venta #VT-2024-001 por $1,250.00 completada exitosamente',
      timestamp: 'Hace 5 minutos',
    },
    {
      id: '2',
      type: 'info',
      title: 'Usuario registrado',
      description: 'Juan Pérez se ha registrado en el sistema',
      timestamp: 'Hace 15 minutos',
    },
    {
      id: '3',
      type: 'warning',
      title: 'Stock bajo',
      description: '3 productos están por debajo del nivel mínimo de inventario',
      timestamp: 'Hace 1 hora',
    },
    {
      id: '4',
      type: 'error',
      title: 'Error en sincronización',
      description: 'La sincronización con el sistema externo falló',
      timestamp: 'Hace 2 horas',
    },
    {
      id: '5',
      type: 'success',
      title: 'Respaldo completado',
      description: 'Respaldo automático de base de datos completado',
      timestamp: 'Hace 3 horas',
    },
  ], []);

  /**
   * Renderizar icono de actividad según tipo
   */
  const getActivityIcon = (type: RecentActivity['type']) => {
    const iconProps = { size: 20, className: 'flex-shrink-0' };

    switch (type) {
      case 'success':
        return <CheckCircle {...iconProps} className="text-green-600" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="text-yellow-600" />;
      case 'error':
        return <AlertCircle {...iconProps} className="text-red-600" />;
      case 'info':
        return <Activity {...iconProps} className="text-blue-600" />;
    }
  };

  /**
   * Obtener color de fondo según tipo de actividad
   */
  const getActivityBg = (type: RecentActivity['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <PageContainer
      title="Dashboard"
      description={`Bienvenido a ${config.appName}`}
      actions={
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          Generar Reporte
        </button>
      }
    >
      {/* Tarjetas de estadísticas */}
      <PageSection>
        <PageGrid cols={4} gap="md">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            const isPositive = stat.change > 0;

            return (
              <PageCard key={stat.id} padding={false} hoverable>
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon size={24} className={stat.color} />
                    </div>
                    <div className="flex items-center gap-1">
                      {isPositive ? (
                        <ArrowUpRight size={16} className="text-green-600" />
                      ) : (
                        <ArrowDownRight size={16} className="text-red-600" />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {Math.abs(stat.change)}%
                      </span>
                    </div>
                  </div>

                  {/* Valor */}
                  <div className="mb-2">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>

                  {/* Cambio */}
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {stat.changeLabel}
                  </div>
                </div>
              </PageCard>
            );
          })}
        </PageGrid>
      </PageSection>

      {/* Segunda fila: Actividad y Alertas */}
      <PageSection>
        <PageGrid cols={2} gap="md">
          {/* Actividad Reciente */}
          <PageCard title="Actividad Reciente" padding={false}>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`p-4 ${getActivityBg(activity.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-500">
                        <Clock size={12} />
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PageCard>

          {/* Resumen Rápido */}
          <PageCard title="Resumen del Sistema">
            <div className="space-y-4">
              {/* Barra de progreso ejemplo */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Uso de almacenamiento
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    68%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '68%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Tareas completadas
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    85%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '85%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Rendimiento del servidor
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    92%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: '92%' }}
                  />
                </div>
              </div>

              {/* Estado del sistema */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Estado del Sistema
                  </span>
                  <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                    Operacional
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Todos los servicios funcionando correctamente
                </p>
              </div>
            </div>
          </PageCard>
        </PageGrid>
      </PageSection>
    </PageContainer>
  );
};

export default DashboardPage;