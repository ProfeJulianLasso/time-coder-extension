import React, { FC, useCallback, useState } from "react";
import DailyReport from "../daily-report/DailyReport";
import TabNavigation from "../tab-navigation/TabNavigation";
import WeeklyReport from "../weekly-report/WeeklyReport";
import "./TimeCoderReport.css";

const TimeCoderReport: FC = () => {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly">("daily");

  const handleRefresh = useCallback(() => {
    console.log("Refreshing data...", window.vscode);
    if (window.vscode) {
      window.vscode.postMessage({
        command: "refresh",
      });
    }
  }, []);

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

      <div className="content-wrapper">
        <div className="tab-content">
          {activeTab === "daily" ? <DailyReport /> : <WeeklyReport />}
        </div>
      </div>

      <div className="button-container">
        <button onClick={handleRefresh} className="vscode-button">
          Actualizar
        </button>
      </div>
    </div>
  );
};

export default TimeCoderReport;
