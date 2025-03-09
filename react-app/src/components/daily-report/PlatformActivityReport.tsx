import React, { FC } from "react";
import { dailyDataSignal } from "../../state/signals";
import PlatformActivityList from "../shared/PlatformActivityList";
import "./DailyReport.css";

const PlatformActivityReport: FC = () => {
  const dailyData = dailyDataSignal.value;

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
