// src/pages/Dashboard.page.tsx

import { PageContainer } from "@layout/PageContainer";

export const DashboardPage = () => {
  return (
    <PageContainer
      title="Panel de Control"
      actions={
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Acción rápida
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tarjeta de métricas */}
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-sm font-semibold text-gray-500">Productos</h2>
          <p className="text-2xl font-bold text-gray-800">1,245</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-sm font-semibold text-gray-500">Inventario total</h2>
          <p className="text-2xl font-bold text-gray-800">32,890</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-sm font-semibold text-gray-500">Alertas críticas</h2>
          <p className="text-2xl font-bold text-red-600">5</p>
        </div>
      </div>

      {/* Sección de tabla o gráficos */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Movimientos recientes</h2>
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Producto</th>
              <th className="px-4 py-2">Cantidad</th>
              <th className="px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">MOV-001</td>
              <td className="px-4 py-2">Vacuna A</td>
              <td className="px-4 py-2">+500</td>
              <td className="px-4 py-2">2025-10-27</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">MOV-002</td>
              <td className="px-4 py-2">Medicamento B</td>
              <td className="px-4 py-2">-200</td>
              <td className="px-4 py-2">2025-10-27</td>
            </tr>
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
};
