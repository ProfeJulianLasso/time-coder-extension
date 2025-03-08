import React, { FC } from "react";
import { WeeklySummary } from "../../types/interfaces";
import "./WeeklyReport.css";

interface WeeklyReportProps {
  weeklyData: WeeklySummary;
}

const WeeklyReport: FC<WeeklyReportProps> = ({ weeklyData }) => {
  return (
    <div className="weekly-report">
      <h2>Resumen semanal</h2>
      <div className="summary-info">
        <div className="total">
          Total de la semana: {weeklyData.totalHours?.toFixed(2) || 0} horas
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
