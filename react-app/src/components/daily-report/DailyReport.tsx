import React, { FC } from "react";
import { DailySummary } from "../../types/interfaces";
import "./DailyReport.css";

interface DailyReportProps {
  dailyData: DailySummary;
}

const DailyReport: FC<DailyReportProps> = ({ dailyData }) => {
  return (
    <div className="daily-report">
      <h2>Resumen diario</h2>
      <div className="summary-info">
        <div className="total">
          Total de hoy: {dailyData.totalHours?.toFixed(2) || 0} horas
        </div>
        {/* Aquí puedes agregar más información específica del día */}
      </div>
    </div>
  );
};

export default DailyReport;
