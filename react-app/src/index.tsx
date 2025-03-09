import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DailySummary, WeeklySummary } from "./types/interfaces";

declare global {
  interface Window {
    vscode: any;
    dailyData: DailySummary;
    weeklyData: WeeklySummary;
  }
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <StrictMode>
    <App
      dailyData={
        window.dailyData ?? {
          totalDurationInSeconds: 0,
          byLanguage: [],
          byPlatform: [],
        }
      }
      weeklyData={
        window.weeklyData ?? {
          totalDurationInSeconds: 0,
          dailyDurationInSeconds: [],
          byLanguage: [],
          byPlatform: [],
        }
      }
    />
  </StrictMode>
);
