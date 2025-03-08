import React, { FC } from "react";
import DevTimerReport from "./components/dev-timer-report/DevTimerReport";
import { DailySummary, WeeklySummary } from "./types/interfaces";

interface AppProps {
  dailyData: DailySummary;
  weeklyData: WeeklySummary;
}

const App: FC<AppProps> = ({ dailyData, weeklyData }) => {
  return (
    <div className="devtimer-app">
      <h1>Reporte de Actividades</h1>
      <p>¡Hola Mundo desde React!</p>
      <DevTimerReport dailyData={dailyData} weeklyData={weeklyData} />
    </div>
  );
};

export default App;
