// ============================================================
// Archivo: frontend/src/app/routes.tsx
// Descripción: Configuración centralizada de rutas.
//              CORREGIDO: Agregada propiedad children al tipo
//              para soportar rutas anidadas.
// Autor: CrimsonKnight90
// ============================================================

import { ReactNode } from "react";
import { DashboardPage } from "@pages/Dashboard.page";
import AppConfigPage from "@pages/AppConfig.page";
import LoginPage from "@pages/Login.page";
import {
  ChartBarIcon,
  Cog6ToothIcon,
  HomeIcon,
  PaintBrushIcon
} from "@heroicons/react/24/outline";

/**
 * ✅ CORREGIDO: Agregada propiedad children para soportar
 * rutas anidadas en el breadcrumb
 */
export type AppRoute = {
  path: string;
  element?: ReactNode;
  private?: boolean;
  roles?: string[];
  title?: string;
  icon?: ReactNode;
  breadcrumb?: string;
  children?: AppRoute[]; // ✅ AGREGADO
};

export const routes: AppRoute[] = [
  {
    path: "/login",
    element: <LoginPage />,
    title: "Login",
    breadcrumb: "auth.login",
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    private: true,
    title: "Dashboard",
    icon: <HomeIcon className="h-5 w-5" />,
    breadcrumb: "nav.dashboard",
    children: [
      {
        path: "reports",
        element: <div className="p-6"><h1 className="text-2xl font-bold">📊 Reportes</h1></div>,
        private: true,
        title: "Reportes",
        icon: <ChartBarIcon className="h-5 w-5" />,
        breadcrumb: "nav.reports",
      },
      {
        path: "settings",
        element: <div className="p-6"><h1 className="text-2xl font-bold">⚙️ Configuración</h1></div>,
        private: true,
        title: "Configuración",
        icon: <Cog6ToothIcon className="h-5 w-5" />,
        breadcrumb: "nav.settings",
      },
      {
        path: "app-config",
        element: <AppConfigPage />,
        private: true,
        roles: ["admin"],
        title: "Configuración de App",
        icon: <PaintBrushIcon className="h-5 w-5" />,
        breadcrumb: "nav.app_config",
      },
    ],
  },
 ];