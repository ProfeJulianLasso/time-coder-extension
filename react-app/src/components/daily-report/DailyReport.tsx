import React, { FC } from "react";
import {
  topDailyLanguageSignal,
  totalDailyTimeSignal,
} from "../../state/signals";
import ActivityTypeReport from "./ActivityTypeReport";
import "./DailyReport.css";
import LanguageActivityReport from "./LanguageActivityReport";
import PlatformActivityReport from "./PlatformActivityReport";

const DailyReport: FC = () => {
  return (
    <>
      <div className="daily-report">
        <h2>Resumen diario</h2>
        <div className="summary-info">
          <div className="total">
            Tiempo total:{" "}
            <span className="highlight-value">
              {totalDailyTimeSignal.value}
            </span>
          </div>
          <div className="total">
            Lenguaje más usado:{" "}
            <span className="highlight-value">
              {topDailyLanguageSignal.value}
            </span>
          </div>
        </div>
      </div>
      <ActivityTypeReport />
      <LanguageActivityReport />
      <PlatformActivityReport />
    </>
  );
};

export default DailyReport;
