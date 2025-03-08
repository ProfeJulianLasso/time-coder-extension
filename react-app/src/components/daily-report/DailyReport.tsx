import React, { FC } from "react";
import { DailySummary } from "../../types/interfaces";
import ActivityTypeReport from "./ActivityTypeReport";
import "./DailyReport.css";

interface DailyReportProps {
  dailyData: DailySummary;
}

const DailyReport: FC<DailyReportProps> = ({ dailyData }) => {
  return (
    <>
      <div className="daily-report">
        <h2>Resumen diario</h2>
        <div className="summary-info">
          <div className="total">
            Tiempo Total: <span className="highlight-value">3h 30m</span>
          </div>
          <div className="total">
            Lenguaje más usado:{" "}
            <span className="highlight-value">TypeScript</span>
          </div>
        </div>
      </div>
      <ActivityTypeReport dailyData={dailyData} />
    </>
  );
};

export default DailyReport;
