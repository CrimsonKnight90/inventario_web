//============================================================
// Archivo: src/branding/config.ts
// Descripción: Configuración centralizada de branding y apariencia
//              de la aplicación. Define colores, logos, nombres y
//              temas que pueden ser personalizados.
// Autor: CrimsonKnight90
//============================================================

/**
 * Tipos de datos para la configuración de branding
 */

/**
 * Configuración de colores del tema
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

/**
 * Configuración de tipografía
 */
export interface Typography {
  fontFamily: string;
  headingFontFamily: string;
  baseFontSize: string;
  fontWeights: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

/**
 * Configuración de logo
 */
export interface LogoConfig {
  url: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Configuración completa de branding
 */
export interface BrandingConfig {
  appName: string;
  appDescription: string;
  companyName: string;
  logo: LogoConfig;
  favicon: string;
  colors: ThemeColors;
  typography: Typography;
  version: string;
  environment: 'development' | 'staging' | 'production';
}

/**
 * Validador de colores hexadecimales
 */
const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * Validador de URL
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    // Si es una ruta relativa, también es válida
    return url.startsWith('/') || url.startsWith('./');
  }
};

/**
 * Configuración por defecto del tema claro
 */
export const defaultLightTheme: ThemeColors = {
  primary: '#3B82F6',      // Azul
  secondary: '#8B5CF6',    // Púrpura
  accent: '#10B981',       // Verde
  background: '#F9FAFB',   // Gris muy claro
  surface: '#FFFFFF',      // Blanco
  text: '#111827',         // Gris oscuro
  textSecondary: '#6B7280', // Gris medio
  border: '#E5E7EB',       // Gris claro
  error: '#EF4444',        // Rojo
  warning: '#F59E0B',      // Naranja
  success: '#10B981',      // Verde
  info: '#3B82F6',         // Azul
};

/**
 * Configuración por defecto del tema oscuro
 */
export const defaultDarkTheme: ThemeColors = {
  primary: '#60A5FA',      // Azul claro
  secondary: '#A78BFA',    // Púrpura claro
  accent: '#34D399',       // Verde claro
  background: '#111827',   // Gris muy oscuro
  surface: '#1F2937',      // Gris oscuro
  text: '#F9FAFB',         // Gris muy claro
  textSecondary: '#9CA3AF', // Gris medio
  border: '#374151',       // Gris oscuro
  error: '#F87171',        // Rojo claro
  warning: '#FBBF24',      // Naranja claro
  success: '#34D399',      // Verde claro
  info: '#60A5FA',         // Azul claro
};

/**
 * Tipografía por defecto
 */
export const defaultTypography: Typography = {
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headingFontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  baseFontSize: '16px',
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

/**
 * Configuración por defecto de la aplicación
 */
export const defaultBrandingConfig: BrandingConfig = {
  appName: 'Sistema Empresarial',
  appDescription: 'Plataforma integral de gestión empresarial',
  companyName: 'Empresa S.A.',
  logo: {
    url: '/logo.svg',
    alt: 'Logo de la Empresa',
    width: 180,
    height: 40,
  },
  favicon: '/favicon.ico',
  colors: defaultLightTheme,
  typography: defaultTypography,
  version: '1.0.0',
  environment: import.meta.env.MODE as 'development' | 'staging' | 'production' || 'development',
};

/**
 * Valida una configuración de branding completa
 *
 * @param config - Configuración a validar
 * @returns true si es válida, throws Error si no
 * @throws Error con detalles de validación
 */
export const validateBrandingConfig = (config: Partial<BrandingConfig>): void => {
  const errors: string[] = [];

  // Validar nombre de aplicación
  if (config.appName !== undefined) {
    if (typeof config.appName !== 'string' || config.appName.trim().length === 0) {
      errors.push('El nombre de la aplicación debe ser una cadena no vacía');
    }
    if (config.appName.length > 100) {
      errors.push('El nombre de la aplicación no puede exceder 100 caracteres');
    }
  }

  // Validar logo
  if (config.logo) {
    if (!isValidUrl(config.logo.url)) {
      errors.push('La URL del logo no es válida');
    }
    if (config.logo.width <= 0 || config.logo.height <= 0) {
      errors.push('Las dimensiones del logo deben ser positivas');
    }
    if (config.logo.width > 500 || config.logo.height > 200) {
      errors.push('Las dimensiones del logo son excesivamente grandes');
    }
  }

  // Validar colores
  if (config.colors) {
    Object.entries(config.colors).forEach(([key, value]) => {
      if (!isValidHexColor(value)) {
        errors.push(`El color '${key}' (${value}) no es un color hexadecimal válido`);
      }
    });
  }

  // Validar tipografía
  if (config.typography) {
    if (config.typography.fontWeights) {
      Object.entries(config.typography.fontWeights).forEach(([key, value]) => {
        if (value < 100 || value > 900 || value % 100 !== 0) {
          errors.push(`El peso de fuente '${key}' (${value}) debe estar entre 100-900 en incrementos de 100`);
        }
      });
    }
  }

  if (errors.length > 0) {
    throw new Error(`Errores de validación de configuración:\n${errors.join('\n')}`);
  }
};

/**
 * Combina la configuración por defecto con configuración personalizada
 *
 * @param customConfig - Configuración personalizada parcial
 * @returns Configuración completa validada
 */
export const mergeBrandingConfig = (
  customConfig: Partial<BrandingConfig>
): BrandingConfig => {
  // Validar antes de combinar
  validateBrandingConfig(customConfig);

  return {
    ...defaultBrandingConfig,
    ...customConfig,
    logo: {
      ...defaultBrandingConfig.logo,
      ...customConfig.logo,
    },
    colors: {
      ...defaultBrandingConfig.colors,
      ...customConfig.colors,
    },
    typography: {
      ...defaultBrandingConfig.typography,
      ...customConfig.typography,
      fontWeights: {
        ...defaultBrandingConfig.typography.fontWeights,
        ...customConfig.typography?.fontWeights,
      },
    },
  };
};

/**
 * Aplicar configuración de branding al documento
 * Modifica las CSS custom properties del documento
 *
 * @param config - Configuración de branding
 */
export const applyBrandingToDocument = (config: BrandingConfig): void => {
  const root = document.documentElement;

  // Aplicar colores como CSS custom properties
  Object.entries(config.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Aplicar tipografía
  root.style.setProperty('--font-family', config.typography.fontFamily);
  root.style.setProperty('--font-family-heading', config.typography.headingFontFamily);
  root.style.setProperty('--font-size-base', config.typography.baseFontSize);

  // Aplicar pesos de fuente
  Object.entries(config.typography.fontWeights).forEach(([key, value]) => {
    root.style.setProperty(`--font-weight-${key}`, value.toString());
  });

  // Actualizar título y favicon
  document.title = config.appName;

  const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
  if (favicon) {
    favicon.href = config.favicon;
  }
};

/**
 * Exportar configuración actual
 */
export { defaultBrandingConfig as brandingConfig };