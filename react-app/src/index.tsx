import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  dailyDataSignal,
  updateSignalsFromExtension,
  weeklyDataSignal,
} from "./state/signals";
import { DailySummary, WeeklySummary } from "./types/interfaces";

declare global {
  interface Window {
    vscode: any;
    dailyData: DailySummary;
    weeklyData: WeeklySummary;
  }
}

// Inicializar signals con datos de window si están disponibles
if (window.dailyData) {
  dailyDataSignal.value = window.dailyData;
}

if (window.weeklyData) {
  weeklyDataSignal.value = window.weeklyData;
}

// Configurar listener para mensajes de la extensión
window.addEventListener("message", (event) => {
  const message = event.data;
  if (message.command === "updatedData") {
    updateSignalsFromExtension(message.dailyData, message.weeklyData);
  }
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
