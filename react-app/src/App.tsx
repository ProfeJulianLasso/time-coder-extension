import React, { FC } from "react";
import DevTimerReport from "./components/dev-timer-report/DevTimerReport";
import "./styles/Globals.css";
import { DailySummary, WeeklySummary } from "./types/interfaces";

interface AppProps {
  dailyData: DailySummary;
  weeklyData: WeeklySummary;
}

const App: FC<AppProps> = ({ dailyData, weeklyData }) => {
  return (
    <div className="devtimer-app">
      <h1 className="title">Reporte de Actividades</h1>
      <DevTimerReport dailyData={dailyData} weeklyData={weeklyData} />
    </div>
  );
};

export default App;
