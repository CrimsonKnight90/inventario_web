import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { defaultTheme, type ThemeConfig } from "./theme";

const STORAGE_KEY = "branding_theme_v1";

type ThemeContextType = {
  theme: ThemeConfig;
  setTheme: (next: ThemeConfig) => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

function applyCssVars(theme: ThemeConfig) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.colors.primary);
  root.style.setProperty("--color-primary-hover", theme.colors.primaryHover);
  root.style.setProperty("--color-surface", theme.colors.surface);
  root.style.setProperty("--color-background", theme.colors.background);
  root.style.setProperty("--color-text", theme.colors.text);
  root.style.setProperty("--color-muted", theme.colors.muted);
  root.style.setProperty("--color-danger", theme.colors.danger);
  root.style.setProperty("--color-warning", theme.colors.warning);
  root.style.setProperty("--color-success", theme.colors.success);
  root.style.setProperty("--font-sans", theme.fonts.sans);
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as ThemeConfig : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  useEffect(() => {
    applyCssVars(theme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {
      /* ignore */
    }
  }, [theme]);

  const value = useMemo<ThemeContextType>(() => ({
    theme,
    setTheme: setThemeState,
    resetTheme: () => setThemeState(defaultTheme),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}