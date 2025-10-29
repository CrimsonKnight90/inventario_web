// ============================================================
// Archivo: frontend/src/pages/AppConfig.page.tsx
// Descripción: Página principal de configuración de la aplicación.
//              Permite editar branding, colores, fuentes, layout
//              y características. Incluye previsualización en vivo.
// Autor: CrimsonKnight90
// ============================================================

import { useState, useRef } from "react";
import { useConfigStore } from "@store/config.store";
import { PageContainer } from "@layout/PageContainer";
import { Button } from "@ui/Button";
import { Alert } from "@ui/Alert";
import { Card } from "@ui/Card";
import {
  Cog6ToothIcon,
  PaintBrushIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

type TabType = "branding" | "colors" | "layout" | "features";

import { ConfigPreview } from "@components/ConfigPreview";
export default function AppConfigPage() {
  const { config, updateConfig, resetConfig, exportConfig, importConfig, error } =
    useConfigStore();

  const [activeTab, setActiveTab] = useState<TabType>("branding");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers para actualización
  const handleBrandingChange = (field: string, value: string) => {
    updateConfig({
      branding: {
        ...config.branding,
        [field]: value,
      },
    });
    showSuccess("Branding actualizado");
  };

  const handleColorChange = (field: string, value: string) => {
    updateConfig({
      colors: {
        ...config.colors,
        [field]: value,
      },
    });
  };

  const handleLayoutChange = (field: string, value: string) => {
    updateConfig({
      layout: {
        ...config.layout,
        [field]: value,
      },
    });
    showSuccess("Layout actualizado");
  };

  const handleFeatureToggle = (feature: keyof typeof config.features) => {
    updateConfig({
      features: {
        ...config.features,
        [feature]: !config.features[feature],
      },
    });
    showSuccess("Característica actualizada");
  };

  const handleExport = () => {
    const json = exportConfig();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess("Configuración exportada");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = importConfig(content);
      if (success) {
        showSuccess("Configuración importada correctamente");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de restablecer toda la configuración?")) {
      resetConfig();
      showSuccess("Configuración restablecida");
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const tabs = [
    { id: "branding" as TabType, label: "Identidad", icon: PhotoIcon },
    { id: "colors" as TabType, label: "Colores", icon: PaintBrushIcon },
    { id: "layout" as TabType, label: "Layout", icon: DocumentTextIcon },
    { id: "features" as TabType, label: "Características", icon: Cog6ToothIcon },
  ];

  return (
    <PageContainer
      title="Configuración de la Aplicación"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <ArrowUpTrayIcon className="w-4 h-4 mr-1" />
            Importar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
            Exportar
          </Button>
          <Button variant="danger" size="sm" onClick={handleReset}>
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            Restablecer
          </Button>
        </div>
      }
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Branding */}
      {activeTab === "branding" && (
        <BrandingTab config={config} onChange={handleBrandingChange} />
      )}

      {/* Tab: Colors */}
      {activeTab === "colors" && (
        <ColorsTab config={config} onChange={handleColorChange} />
      )}

      {/* Tab: Layout */}
      {activeTab === "layout" && (
        <LayoutTab config={config} onChange={handleLayoutChange} />
      )}

      {/* Tab: Features */}
      {activeTab === "features" && (
        <FeaturesTab config={config} onToggle={handleFeatureToggle} />
      )}
    </PageContainer>
  );
}

// ============================================================
// Sub-componentes para cada tab
// ============================================================

function BrandingTab({
  config,
  onChange,
}: {
  config: any;
  onChange: (field: string, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Información General">
        <div className="space-y-4">
          <InputField
            label="Nombre de la Aplicación"
            value={config.branding.appName}
            onChange={(v) => onChange("appName", v)}
            placeholder="Inventario Empresarial"
          />
          <InputField
            label="Nombre Corto"
            value={config.branding.shortName}
            onChange={(v) => onChange("shortName", v)}
            placeholder="Inventario"
          />
          <InputField
            label="Nombre de la Empresa"
            value={config.branding.companyName}
            onChange={(v) => onChange("companyName", v)}
            placeholder="Tu Empresa S.A."
          />
          <InputField
            label="URL de la Empresa"
            value={config.branding.companyUrl}
            onChange={(v) => onChange("companyUrl", v)}
            placeholder="https://tuempresa.com"
          />
          <InputField
            label="Email de Soporte"
            value={config.branding.supportEmail}
            onChange={(v) => onChange("supportEmail", v)}
            placeholder="soporte@tuempresa.com"
            type="email"
          />
        </div>
      </Card>

      <Card title="Recursos Visuales">
        <div className="space-y-4">
          <InputField
            label="URL del Logo"
            value={config.branding.logoUrl}
            onChange={(v) => onChange("logoUrl", v)}
            placeholder="/assets/logo.svg"
          />
          <InputField
            label="URL del Favicon"
            value={config.branding.faviconUrl}
            onChange={(v) => onChange("faviconUrl", v)}
            placeholder="/favicon.ico"
          />
          <div className="mt-4 p-4 bg-gray-50 rounded border">
            <p className="text-sm text-gray-600 mb-2">Vista previa del logo:</p>
            <img
              src={config.branding.logoUrl}
              alt="Logo preview"
              className="h-12 object-contain"
              onError={(e) => {
                e.currentTarget.src = "/assets/logo.svg";
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function ColorsTab({
  config,
  onChange,
}: {
  config: any;
  onChange: (field: string, value: string) => void;
}) {
  const colorGroups = [
    {
      title: "Colores Principales",
      colors: [
        { key: "primary", label: "Primario" },
        { key: "primaryHover", label: "Primario Hover" },
        { key: "secondary", label: "Secundario" },
        { key: "secondaryHover", label: "Secundario Hover" },
      ],
    },
    {
      title: "Colores de Fondo",
      colors: [
        { key: "surface", label: "Superficie" },
        { key: "background", label: "Fondo" },
        { key: "border", label: "Borde" },
      ],
    },
    {
      title: "Colores de Texto",
      colors: [
        { key: "text", label: "Texto Principal" },
        { key: "textSecondary", label: "Texto Secundario" },
        { key: "muted", label: "Texto Muted" },
      ],
    },
    {
      title: "Colores de Estado",
      colors: [
        { key: "danger", label: "Peligro" },
        { key: "dangerHover", label: "Peligro Hover" },
        { key: "warning", label: "Advertencia" },
        { key: "warningHover", label: "Advertencia Hover" },
        { key: "success", label: "Éxito" },
        { key: "successHover", label: "Éxito Hover" },
        { key: "info", label: "Información" },
        { key: "infoHover", label: "Información Hover" },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {colorGroups.map((group) => (
        <Card key={group.title} title={group.title}>
          <div className="space-y-3">
            {group.colors.map((color) => (
              <ColorPicker
                key={color.key}
                label={color.label}
                value={config.colors[color.key]}
                onChange={(v) => onChange(color.key, v)}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function LayoutTab({
  config,
  onChange,
}: {
  config: any;
  onChange: (field: string, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Dimensiones">
        <div className="space-y-4">
          <InputField
            label="Ancho del Sidebar"
            value={config.layout.sidebarWidth}
            onChange={(v) => onChange("sidebarWidth", v)}
            placeholder="240px"
          />
          <InputField
            label="Alto del Topbar"
            value={config.layout.topbarHeight}
            onChange={(v) => onChange("topbarHeight", v)}
            placeholder="64px"
          />
        </div>
      </Card>

      <Card title="Border Radius">
        <div className="space-y-4">
          {Object.entries(config.layout.borderRadius).map(([key, value]) => (
            <InputField
              key={key}
              label={`Radius ${key.toUpperCase()}`}
              value={value as string}
              onChange={(v) =>
                onChange(`borderRadius.${key}`, v)
              }
              placeholder="0.5rem"
            />
          ))}
        </div>
      </Card>

      <Card title="Espaciado">
        <div className="space-y-4">
          {Object.entries(config.layout.spacing).map(([key, value]) => (
            <InputField
              key={key}
              label={`Spacing ${key.toUpperCase()}`}
              value={value as string}
              onChange={(v) =>
                onChange(`spacing.${key}`, v)
              }
              placeholder="1rem"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

function FeaturesTab({
  config,
  onToggle,
}: {
  config: any;
  onToggle: (feature: any) => void;
}) {
  const features = [
    {
      key: "darkMode",
      label: "Modo Oscuro",
      description: "Permite alternar entre tema claro y oscuro",
    },
    {
      key: "multiLanguage",
      label: "Multi-idioma",
      description: "Soporte para múltiples idiomas",
    },
    {
      key: "notifications",
      label: "Notificaciones",
      description: "Sistema de notificaciones push",
    },
    {
      key: "analytics",
      label: "Analytics",
      description: "Seguimiento de eventos y métricas",
    },
  ];

  return (
    <Card title="Características de la Aplicación">
      <div className="space-y-4">
        {features.map((feature) => (
          <div
            key={feature.key}
            className="flex items-center justify-between p-4 bg-gray-50 rounded border"
          >
            <div>
              <h4 className="font-medium text-gray-900">{feature.label}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.features[feature.key]}
                onChange={() => onToggle(feature.key)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================
// Componentes auxiliares reutilizables
// ============================================================

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
      />
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm font-mono"
          pattern="^#[0-9A-Fa-f]{6}$"
        />
      </div>
      <div
        className="w-10 h-10 rounded border border-gray-300"
        style={{ backgroundColor: value }}
      />
    </div>
  );
}