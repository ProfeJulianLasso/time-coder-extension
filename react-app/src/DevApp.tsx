import React, { StrictMode, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ThemeToggle from "./components/theme-toggle/ThemeToggle";
import { vscodeAPI } from "./mock/vscode-mock";
import "./styles/vscode-theme.css";
import { DailySummary, WeeklySummary } from "./types/interfaces";

// Inicializar el mock de VSCode
vscodeAPI.init();

// Componente wrapper para desarrollo
const DevApp = () => {
  const [dailyData, setDailyData] = useState<DailySummary>(window.dailyData);
  const [weeklyData, setWeeklyData] = useState<WeeklySummary>(
    window.weeklyData
  );

  useEffect(() => {
    // Escuchar cambios en los datos
    const handleMessage = (event: any) => {
      if (event.data?.command === "update") {
        setDailyData(event.data.dailyData);
        setWeeklyData(event.data.weeklyData);
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

      <App dailyData={dailyData} weeklyData={weeklyData} />
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
