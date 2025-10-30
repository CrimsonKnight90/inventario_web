import { useState } from "react";
import { Card } from "@ui/Card";
import { TextInput } from "@ui/TextInput";
import { Button } from "@ui/Button";
import { Alert } from "@ui/Alert";
import { useConfig } from "@hooks/useConfig";

/**
 * Página de configuración de branding (usa useConfigStore como fuente única)
 */
export default function ConfigBranding() {
  const { config, updateConfig, resetConfig } = useConfig();

  const [appName, setAppName] = useState(config.branding.appName);
  const [logoUrl, setLogoUrl] = useState(config.branding.logoUrl);
  const [primary] = useState(config.colors.primary); // leer pero delegar edición completa en AppConfig.page si hace falta

  function save() {
    updateConfig({
      branding: {
        ...config.branding,
        appName,
        logoUrl,
      },
    });
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Alert variant="info">Cambia el branding del sitio y guarda para aplicar al instante.</Alert>

        <Card title="Identidad">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Nombre de la app" value={appName} onChange={(e) => setAppName(e.target.value)} />
            <TextInput label="URL del logo" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button onClick={save}>Guardar</Button>
          <Button variant="outline" onClick={() => resetConfig()}>Restablecer</Button>
        </div>
      </div>
    </div>
  );
}