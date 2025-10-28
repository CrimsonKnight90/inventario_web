// Theme tokens for branding and Tailwind integration
// Exports a strict type so components and styles read a stable contract

export type ColorScale = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
};

export type Theme = {
  name: string;
  primary: ColorScale;
  neutral: ColorScale;
  success: string;
  warning: string;
  danger: string;
  fonts: {
    sans: string;
    mono: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
};

export const defaultTheme: Theme = {
  name: "default",
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  neutral: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#eaeaea",
    300: "#d6d6d6",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626",
  fonts: {
    sans: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
};
