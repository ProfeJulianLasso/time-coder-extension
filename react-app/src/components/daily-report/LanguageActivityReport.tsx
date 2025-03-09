import React, { FC } from "react";
import { dailyDataSignal } from "../../state/signals";
import LanguageActivityList from "../shared/LanguageActivityList";
import "./DailyReport.css";

const LanguageActivityReport: FC = () => {
  const dailyData = dailyDataSignal.value;

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
