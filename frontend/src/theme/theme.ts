export type ThemeConfig = {
  appName: string;
  logoPath: string;
  colors: {
    primary: string;   // e.g. #4f46e5
    primaryHover: string; // e.g. #4338ca
    surface: string;   // e.g. #ffffff
    background: string;// e.g. #f3f4f6
    text: string;      // e.g. #111827
    muted: string;     // e.g. #6b7280
    danger: string;    // e.g. #dc2626
    warning: string;   // e.g. #f59e0b
    success: string;   // e.g. #16a34a
  };
  fonts: {
    sans: string; // e.g. Inter, ui-sans-serif, system-ui, ...
  };
};

export const defaultTheme: ThemeConfig = {
  appName: "Inventario Empresarial",
  logoPath: "/assets/logo.svg",
  colors: {
    primary: "#4f46e5",
    primaryHover: "#4338ca",
    surface: "#ffffff",
    background: "#f3f4f6",
    text: "#111827",
    muted: "#6b7280",
    danger: "#dc2626",
    warning: "#f59e0b",
    success: "#16a34a",
  },
  fonts: {
    sans: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
};
