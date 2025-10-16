// tailwind.config.js
import { branding } from "./src/config/branding.js"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: branding.colors.primary,
        secondary: branding.colors.secondary,
        background: branding.colors.background,
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
