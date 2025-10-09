// ============================================================
// Archivo: frontend/src/components/Layout.jsx
// Descripción: Layout base con sidebar lateral y área de contenido.
// Autor: CrimsonKnight90
// ============================================================

import Navbar from "./Navbar"

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Navbar />

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  )
}
