// ============================================================
// Archivo: frontend/src/components/AppTable.jsx
// Descripción: Tabla genérica limpia (sin tarjeta), con scroll horizontal
// Autor: CrimsonKnight90
// ============================================================

import React from "react"

export default function AppTable({ headers = [], children, className = "" }) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full border border-gray-200 text-center ${className}`}>
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-2 border text-center align-middle font-semibold text-gray-700 whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
