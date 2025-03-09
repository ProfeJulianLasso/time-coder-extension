import React, { FC } from "react";
import { DailySummary } from "../../types/interfaces";
import LanguageActivityList from "../shared/LanguageActivityList";
import "./DailyReport.css";

interface LanguageActivityReportProps {
  dailyData: DailySummary;
}

/**
 * Componente que muestra la actividad por lenguaje en el reporte diario
 */
const LanguageActivityReport: FC<LanguageActivityReportProps> = ({
  dailyData,
}) => {
  return (
    <div className="daily-report">
      <LanguageActivityList
        languages={dailyData.byLanguage}
        title="Actividad por lenguaje"
        totalDuration={dailyData.totalDurationInSeconds}
      />
    </div>
  );
};

export default LanguageActivityReport;
