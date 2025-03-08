import React, { FC } from "react";
import { DailySummary } from "../../types/interfaces";
import "./DailyReport.css";

interface ActivityTypeReportProps {
  dailyData: DailySummary;
}

const ActivityTypeReport: FC<ActivityTypeReportProps> = ({ dailyData }) => {
  // Valores de ejemplo - estos deberían venir de dailyData
  const codingTime = 165; // 2h 45m en minutos
  const debugTime = 45; // 45m en minutos
  const totalTime = codingTime + debugTime;

  const codingPercentage = Math.round((codingTime / totalTime) * 100);
  const debugPercentage = 100 - codingPercentage;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="daily-report">
      <h2>Tipo de Actividad</h2>

      <div className="activity-bar-container">
        <div className="activity-bar">
          <div
            className="activity-coding"
            style={{ width: `${codingPercentage}%` }}
            title={`Codificación: ${formatTime(
              codingTime
            )} (${codingPercentage}%)`}
          ></div>
          <div
            className="activity-debug"
            style={{ width: `${debugPercentage}%` }}
            title={`Depuración: ${formatTime(debugTime)} (${debugPercentage}%)`}
          ></div>
        </div>
      </div>

      <div className="activity-legend">
        <div className="legend-item">
          <span className="legend-color coding-color"></span>
          <span className="legend-label">Codificación: </span>
          <span className="highlight-value">
            {formatTime(codingTime)} ({codingPercentage}%)
          </span>
        </div>
        <div className="legend-item">
          <span className="legend-color debug-color"></span>
          <span className="legend-label">Depuración: </span>
          <span className="highlight-value">
            {formatTime(debugTime)} ({debugPercentage}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityTypeReport;
