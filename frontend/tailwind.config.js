/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // azul principal
          light: "#3b82f6",
          dark: "#1e40af",
        },
        secondary: {
          DEFAULT: "#64748b", // gris azulado
          light: "#94a3b8",
          dark: "#334155",
        },
        accent: {
          DEFAULT: "#f59e0b", // naranja
          light: "#fbbf24",
          dark: "#b45309",
        },
        success: {
          DEFAULT: "#16a34a", // verde
          light: "#22c55e",
          dark: "#166534",
        },
        danger: {
          DEFAULT: "#dc2626", // rojo
          light: "#ef4444",
          dark: "#991b1b",
        },
        neutral: {
          DEFAULT: "#f3f4f6", // gris claro
          dark: "#1f2937",    // gris oscuro
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        card: "0 4px 6px rgba(0,0,0,0.1)",
        soft: "0 2px 4px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl: "1rem",
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
}
