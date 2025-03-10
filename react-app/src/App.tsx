import React, { FC } from "react";
import DevTimerReport from "./components/dev-timer-report/DevTimerReport";
import CustomScroll from "./components/custom-scroll/CustomScroll";
import "./styles/Globals.css";

const App: FC = () => {
  return (
    <CustomScroll>
      <div className="devtimer-app">
        <h1 className="title">Reporte de actividades</h1>
        <DevTimerReport />
      </div>
    </CustomScroll>
  );
};

export default App;