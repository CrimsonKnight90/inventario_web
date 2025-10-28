// src/layout/Layout.tsx

import { PropsWithChildren } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Topbar fijo */}
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fijo debajo del Topbar */}
        <Sidebar />

        {/* Contenido scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
