// src/app/main.tsx

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@i18n/i18n"; // inicialización de i18n
import "@app/index.css"; // estilos globales
import { ThemeProvider } from "@theme/ThemeContext";
import App from "@app/App";

createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
