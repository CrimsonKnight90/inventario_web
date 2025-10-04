// ============================================================
// Archivo: frontend/src/components/Layout.jsx
// Descripción: Layout base que incluye la barra de navegación
//              y un contenedor central para las páginas.
// Autor: CrimsonKnight90
// ============================================================

import Navbar from "./Navbar"

/**
 * Layout
 * Envuelve las páginas con la barra de navegación y un contenedor principal.
 * @param {ReactNode} children - Contenido de la página
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra de navegación fija arriba */}
      <Navbar />

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>

      {/* Footer opcional */}
      <footer className="bg-gray-800 text-white text-center py-3 text-sm">
        Inventario Web © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
