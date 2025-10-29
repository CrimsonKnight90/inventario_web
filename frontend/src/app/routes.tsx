// ============================================================
// Archivo: frontend/src/app/routes.tsx
// Descripción: Configuración centralizada de rutas.
//              VERSIÓN PLANA: Sin anidamiento
// Autor: CrimsonKnight90
// ============================================================

import { ReactNode } from "react";
import { DashboardPage } from "@pages/Dashboard.page";
import AppConfigPage from "@pages/AppConfig.page";
import LoginPage from "@pages/Login.page";
import { ChartBarIcon, Cog6ToothIcon, HomeIcon, PaintBrushIcon } from "@heroicons/react/24/outline";

export type AppRoute = {
  path: string;
  element?: ReactNode;
  private?: boolean;
  roles?: string[];
  title?: string;
  icon?: ReactNode;
  breadcrumb?: string;
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
  },
  {
    path: "/dashboard/reports",
    element: <div>📊 Reportes</div>,
    private: true,
    title: "Reportes",
    icon: <ChartBarIcon className="h-5 w-5" />,
    breadcrumb: "nav.reports",
  },
  {
    path: "/dashboard/settings",
    element: <div>⚙️ Configuración</div>,
    private: true,
    title: "Configuración",
    icon: <Cog6ToothIcon className="h-5 w-5" />,
    breadcrumb: "nav.settings",
  },
  {
    path: "/dashboard/app-config",
    element: <AppConfigPage />,
    private: true,
    roles: ["admin"],
    title: "Configuración de App",
    icon: <PaintBrushIcon className="h-5 w-5" />,
    breadcrumb: "nav.app_config",
  },
];