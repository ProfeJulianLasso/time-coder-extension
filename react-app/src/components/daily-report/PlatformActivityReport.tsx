import React, { FC } from "react";
import { DailySummary } from "../../types/interfaces";
import PlatformActivityList from "../shared/PlatformActivityList";
import "./DailyReport.css";

interface PlatformActivityReportProps {
  dailyData: DailySummary;
}

/**
 * Componente que muestra la actividad por plataforma en el reporte diario
 */
const PlatformActivityReport: FC<PlatformActivityReportProps> = ({
  dailyData,
}) => {
  return (
    <div className="daily-report">
      <PlatformActivityList
        platforms={dailyData.byPlatform}
        title="Actividad por plataforma"
        totalDuration={dailyData.totalDurationInSeconds}
      />
    </div>
  );
};

export default PlatformActivityReport;
