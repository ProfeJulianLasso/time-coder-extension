import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DailySummary, WeeklySummary } from "./types/interfaces";

// Declarar interfaz global para la ventana
declare global {
  interface Window {
    vscode: any;
    dailyData: DailySummary;
    weeklyData: WeeklySummary;
  }
}

// Crear root y renderizar App
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <App
      dailyData={
        window.dailyData ?? {
          totalHours: 0,
          byLanguage: [],
          byPlatform: [],
        }
      }
      weeklyData={
        window.weeklyData ?? {
          totalHours: 0,
          dailyHours: [],
          byLanguage: [],
          byPlatform: [],
        }
      }
    />
  </StrictMode>
);
