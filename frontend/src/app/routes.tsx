// src/app/routes.tsx

import { ReactNode } from "react";
import { DashboardPage } from "@pages/Dashboard.page";
import BrandingConfigPage from "@pages/BrandingConfig.page";
import LoginPage from "@pages/Login.page";
import { ChartBarIcon, Cog6ToothIcon, HomeIcon } from "@heroicons/react/24/outline";

export type AppRoute = {
  path: string;
  element: ReactNode;
  private?: boolean;
  roles?: string[];
  title?: string;
  icon?: ReactNode;
  breadcrumb?: string;       // Clave de traducción para migas de pan
  children?: AppRoute[];
};

export const routes: AppRoute[] = [
  {
    path: "/login",
    element: <LoginPage />,
    title: "Login",
    breadcrumb: "nav.login",
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
    ],
  },
  {
    path: "/branding",
    element: <BrandingConfigPage />,
    private: true,
    roles: ["admin"],
    title: "Branding",
    icon: <Cog6ToothIcon className="h-5 w-5" />,
    breadcrumb: "nav.branding",
  },
];
