import React, { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "../src/App";
import { dailyDataSignal, weeklyDataSignal } from "../src/state/signals";
import ThemeToggle from "./components/theme-toggle/ThemeToggle";
import { vscodeAPI } from "./mock/vscode-mock";
import "./styles/vscode-theme.css";

// Inicializar el mock de VSCode
vscodeAPI.init();

// Componente wrapper para desarrollo
const DevApp = () => {
  useEffect(() => {
    // Escuchar cambios en los datos
    const handleMessage = (event: any) => {
      if (event.data?.command === "update") {
        // Ya no se usa setState, ahora actualizamos las signals
        dailyDataSignal.value = event.data.dailyData;
        weeklyDataSignal.value = event.data.weeklyData;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div
      className="dev-container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}
    >
      <ThemeToggle />

      <div
        style={{
          marginBottom: "20px",
          background: "var(--vscode-panel-border)",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        <h2 style={{ margin: "0 0 10px 0" }}>Modo Desarrollo Independiente</h2>
        <p style={{ margin: "0" }}>
          Esta interfaz simula el entorno de VSCode para pruebas. El botón
          "Actualizar" simula la comunicación con la extensión.
        </p>
      </div>

      {/* Ya no pasamos props a App */}
      <App />
    </div>
  );
};

// Crear root y renderizar DevApp
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <DevApp />
  </StrictMode>
);
