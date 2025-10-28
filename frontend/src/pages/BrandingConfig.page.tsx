// src/pages/BrandingConfig.page.tsx

import { useState } from "react";
import { useTheme } from "@theme/ThemeContext";
import { Card } from "@ui/Card";
import { TextInput } from "@ui/TextInput";
import { Button } from "@ui/Button";
import { Alert } from "@ui/Alert";

/**
 * Página de configuración de branding.
 * - Permite modificar nombre de la app, logo y colores principales.
 * - Aplica los cambios al tema global mediante ThemeContext.
 */
export default function ConfigBranding() {
  const { theme, setTheme, resetTheme } = useTheme();

  // Estados locales para los campos editables
  const [appName, setAppName] = useState(theme.appName);
  const [logoPath, setLogoPath] = useState(theme.logoPath);
  const [primary, setPrimary] = useState(theme.colors.primary);
  const [primaryHover, setPrimaryHover] = useState(theme.colors.primaryHover);
  const [background, setBackground] = useState(theme.colors.background);
  const [text, setText] = useState(theme.colors.text);

  // Guardar cambios en el tema global
  function save() {
    setTheme({
      ...theme,
      appName,
      logoPath,
      colors: {
        ...theme.colors,
        primary,
        primaryHover,
        background,
        text,
      },
    });
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Mensaje informativo */}
        <Alert variant="info">
          Cambia el branding del sitio y guarda para aplicar al instante.
        </Alert>

        {/* Sección de identidad: nombre y logo */}
        <Card title="Identidad">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Nombre de la app"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
            <TextInput
              label="Ruta del logo"
              value={logoPath}
              onChange={(e) => setLogoPath(e.target.value)}
            />
          </div>
        </Card>

        {/* Sección de colores */}
        <Card title="Colores">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Primario"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
            />
            <TextInput
              label="Primario hover"
              value={primaryHover}
              onChange={(e) => setPrimaryHover(e.target.value)}
            />
            <TextInput
              label="Fondo"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
            <TextInput
              label="Texto"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button onClick={save}>Guardar</Button>
          <Button variant="outline" onClick={resetTheme}>
            Restablecer
          </Button>
        </div>
      </div>
    </div>
  );
}
