// ============================================================
// Archivo: frontend/src/components/ConfigPreview.tsx
// Descripción: Componente que muestra vista previa en tiempo real
//              de los cambios de configuración aplicados.
// Autor: CrimsonKnight90
// ============================================================

import { useConfig } from "@hooks/useConfig";
import { Button } from "@ui/Button";
import { Card } from "@ui/Card";
import { Alert } from "@ui/Alert";

export function ConfigPreview() {
  const { config } = useConfig();

  return (
    <Card title="Vista Previa">
      <div className="space-y-4">
        {/* Preview de colores */}
        <div>
          <h4 className="text-sm font-medium mb-2">Paleta de Colores</h4>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(config.colors).map(([key, value]) => (
              <div key={key} className="text-center">
                <div
                  className="h-12 rounded border mb-1"
                  style={{ backgroundColor: value }}
                />
                <span className="text-xs text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Preview de botones */}
        <div>
          <h4 className="text-sm font-medium mb-2">Botones</h4>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm">Primario</Button>
            <Button variant="outline" size="sm">Outline</Button>
            <Button variant="danger" size="sm">Danger</Button>
            <Button variant="ghost" size="sm">Ghost</Button>
          </div>
        </div>

        {/* Preview de alertas */}
        <div>
          <h4 className="text-sm font-medium mb-2">Alertas</h4>
          <div className="space-y-2">
            <Alert variant="info">Mensaje informativo</Alert>
            <Alert variant="success">Operación exitosa</Alert>
            <Alert variant="warning">Advertencia importante</Alert>
            <Alert variant="danger">Error crítico</Alert>
          </div>
        </div>

        {/* Preview de tipografía */}
        <div>
          <h4 className="text-sm font-medium mb-2">Tipografía</h4>
          <div className="space-y-1">
            <p style={{ fontSize: config.fonts.sizes["3xl"] }}>
              Título Grande
            </p>
            <p style={{ fontSize: config.fonts.sizes["2xl"] }}>
              Título Mediano
            </p>
            <p style={{ fontSize: config.fonts.sizes.xl }}>
              Título Pequeño
            </p>
            <p style={{ fontSize: config.fonts.sizes.base }}>
              Texto normal del cuerpo
            </p>
            <p style={{ fontSize: config.fonts.sizes.sm }}>
              Texto pequeño
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}