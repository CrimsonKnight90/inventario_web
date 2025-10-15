import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import { BrowserRouter } from "react-router-dom"   // ✅ Importar Router aquí

import "./i18n"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>        {/* ✅ Router envuelve todo */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
