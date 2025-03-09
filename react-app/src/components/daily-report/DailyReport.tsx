import React, { FC } from "react";
import { DailySummary } from "../../types/interfaces";
import { formatDuration } from "../../utils/time";
import ActivityTypeReport from "./ActivityTypeReport";
import "./DailyReport.css";
import LanguageActivityReport from "./LanguageActivityReport";
import PlatformActivityReport from "./PlatformActivityReport";

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
            Tiempo Total:{" "}
            <span className="highlight-value">
              {formatDuration(dailyData.totalDurationInSeconds)}
            </span>
          </div>
          <div className="total">
            Lenguaje más usado:{" "}
            <span className="highlight-value">
              {dailyData.byLanguage[0]?.language || "N/A"}
            </span>
          </div>
        </div>
      </div>
      <ActivityTypeReport dailyData={dailyData} />
      <LanguageActivityReport dailyData={dailyData} />
      <PlatformActivityReport dailyData={dailyData} />
    </>
  );
};

export default DailyReport;
