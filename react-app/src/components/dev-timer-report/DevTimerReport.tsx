import React, { FC, useState } from "react";
import { DailySummary, WeeklySummary } from "../../types/interfaces";
import DailyReport from "../daily-report/DailyReport";
import TabNavigation from "../tab-navigation/TabNavigation";
import WeeklyReport from "../weekly-report/WeeklyReport";
import "./DevTimerReport.css";

interface DevTimerReportProps {
  dailyData: DailySummary;
  weeklyData: WeeklySummary;
}

const DevTimerReport: FC<DevTimerReportProps> = ({ dailyData, weeklyData }) => {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");

  const handleRefresh = () => {
    console.log("Refreshing data...", window.vscode);
    // Enviar mensaje al webview para actualizar datos
    if (window.vscode) {
      window.vscode.postMessage({
        command: "refresh",
      });
    }
  };

  const tabs = [
    { id: "daily", label: "Reporte Diario" },
    { id: "weekly", label: "Reporte Semanal" },
  ];

  return (
    <div className="report-container">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as "daily" | "weekly")}
      />

      <div className="tab-content">
        {activeTab === "daily" ? (
          <DailyReport dailyData={dailyData} />
        ) : (
          <WeeklyReport weeklyData={weeklyData} />
        )}
      </div>

      <div className="button-container">
        <button onClick={handleRefresh} className="vscode-button">
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default DevTimerReport;
