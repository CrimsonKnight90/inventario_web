// ============================================================
// Archivo: frontend/src/main.jsx
// Descripción: Punto de entrada de la app React. Configura Router, AuthProvider e i18n.
//              Ahora incluye BrandingProvider para exponer configuración de branding global.
// Autor: CrimsonKnight90
// ============================================================

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import { BrandingProvider } from "./context/BrandingContext.jsx"
import { BrowserRouter } from "react-router-dom"

import "./i18n"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BrandingProvider>
          <App />
        </BrandingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
