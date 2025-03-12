import React, { FC } from "react";
import CustomScroll from "./components/custom-scroll/CustomScroll";
import TimeCoderReport from "./components/time-coder-report/TimeCoderReport";
import "./styles/Globals.css";

const App: FC = () => {
  return (
    <CustomScroll>
      <div className="timecoder-app">
        <h1 className="title">Reporte de actividades</h1>
        <TimeCoderReport />
      </div>
    </CustomScroll>
  );
};

export default App;
