import React, { FC } from "react";
import DevTimerReport from "./components/dev-timer-report/DevTimerReport";
import "./styles/Globals.css";

const App: FC = () => {
  return (
    <div className="devtimer-app">
      <h1 className="title">Reporte de actividades</h1>
      <DevTimerReport />
    </div>
  );
};

export default App;
