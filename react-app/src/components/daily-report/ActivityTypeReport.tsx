import React, { FC, useMemo } from "react";
import { dailyDataSignal } from "../../state/signals";
import { formatDuration } from "../../utils/time";
import "./DailyReport.css";

const ActivityTypeReport: FC = () => {
  const dailyData = dailyDataSignal.value;

  const { debugTime, codingTime, totalTime } = useMemo(() => {
    let totalDebugTime = 0;

    dailyData.byPlatform.forEach((platform) => {
      platform.projects.forEach((project) => {
        totalDebugTime += project.debug.durationInSeconds;
      });
    });

    const total = dailyData.totalDurationInSeconds;
    const coding = total - totalDebugTime;

    return {
      debugTime: totalDebugTime,
      codingTime: coding,
      totalTime: total,
    };
  }, [dailyData]);

  const codingPercentage = Math.round((codingTime / totalTime) * 100) || 0;
  const debugPercentage = 100 - codingPercentage;

  return (
    <div className="daily-report">
      <h2>Tipo de actividad</h2>

      <div className="activity-bar-container">
        <div className="activity-bar">
          <div
            className="activity-coding"
            style={{ width: `${codingPercentage}%` }}
            title={`Codificación: ${formatDuration(
              codingTime
            )} (${codingPercentage}%)`}
          ></div>
          <div
            className="activity-debug"
            style={{ width: `${debugPercentage}%` }}
            title={`Depuración: ${formatDuration(
              debugTime
            )} (${debugPercentage}%)`}
          ></div>
        </div>
      </div>

      <div className="activity-legend">
        <div className="legend-item">
          <span className="legend-color coding-color"></span>
          <span className="legend-label">Codificación: </span>
          <span className="highlight-value">
            {formatDuration(codingTime)} ({codingPercentage}%)
          </span>
        </div>
        <div className="legend-item">
          <span className="legend-color debug-color"></span>
          <span className="legend-label">Depuración: </span>
          <span className="highlight-value">
            {formatDuration(debugTime)} ({debugPercentage}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityTypeReport;
