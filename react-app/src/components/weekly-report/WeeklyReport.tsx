import React, { FC, useMemo } from "react";
import { WeeklySummary } from "../../types/interfaces";
import { formatDuration, getColorByIndex } from "../../utils/time";
import LanguageActivityList from "../shared/LanguageActivityList";
import PlatformActivityList from "../shared/PlatformActivityList";
import "./WeeklyReport.css";

interface WeeklyReportProps {
  weeklyData: WeeklySummary;
}

/**
 * Obtiene el nombre del día de la semana a partir de una fecha
 * @param dateString - Fecha en formato string
 * @returns Nombre del día en español
 */
const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  const days = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  return days[date.getDay()];
};

const WeeklyReport: FC<WeeklyReportProps> = ({ weeklyData }) => {
  // Ordenar los datos diarios por fecha
  const sortedDailyData = [...weeklyData.dailyDurationInSeconds].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Encontrar el máximo tiempo diario para escalar las barras
  const maxDailyTime = Math.max(
    ...sortedDailyData.map((day) => day.durationInSeconds),
    1
  );

  // Calcular el día más productivo
  const mostProductiveDay = useMemo(() => {
    if (sortedDailyData.length === 0) return null;

    const maxDay = sortedDailyData.reduce(
      (max, current) =>
        current.durationInSeconds > max.durationInSeconds ? current : max,
      sortedDailyData[0]
    );

    const dayName = getDayName(maxDay.date);

    return {
      dayName,
      durationInSeconds: maxDay.durationInSeconds,
    };
  }, [sortedDailyData]);

  return (
    <div className="weekly-report">
      <h2>Resumen semanal</h2>

      <div className="summary-info">
        <div className="total">
          <span>Tiempo total de la semana: </span>
          <span className="highlight-value">
            {formatDuration(weeklyData.totalDurationInSeconds)}
          </span>
        </div>

        {/* Añadir el día más productivo */}
        {mostProductiveDay && (
          <div className="total">
            <span>Día más productivo: </span>
            <span className="highlight-value">
              {mostProductiveDay.dayName} -{" "}
              {formatDuration(mostProductiveDay.durationInSeconds)}
            </span>
          </div>
        )}

        {weeklyData.byLanguage.length > 0 && (
          <div className="total">
            <span>Lenguaje más usado: </span>
            <span className="highlight-value">
              {weeklyData.byLanguage[0]?.language || "N/A"}
            </span>
          </div>
        )}
      </div>

      {sortedDailyData.length > 0 && (
        <div className="daily-activity-section">
          <h2>Actividad diaria</h2>
          <div className="daily-bars">
            {sortedDailyData.map((day, index) => {
              const barHeight = (day.durationInSeconds / maxDailyTime) * 100;

              return (
                <div key={day.date} className="daily-bar-container">
                  <div className="bar-label">
                    {formatDuration(day.durationInSeconds)}
                  </div>
                  <div className="bar-wrapper">
                    <div
                      className="daily-bar"
                      style={{
                        height: `${barHeight}%`,
                        backgroundColor: getColorByIndex(
                          index,
                          sortedDailyData.length - 1
                        ),
                      }}
                      title={`${getDayName(day.date)}: ${formatDuration(
                        day.durationInSeconds
                      )}`}
                    ></div>
                  </div>
                  <div className="day-label">
                    {getDayName(day.date).substring(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {weeklyData.byLanguage.length > 0 && (
        <div className="languages-section">
          <LanguageActivityList
            languages={weeklyData.byLanguage}
            title="Actividad por lenguaje"
            totalDuration={weeklyData.totalDurationInSeconds}
            maxItems={5}
          />
        </div>
      )}

      {weeklyData.byPlatform.length > 0 && (
        <div className="platforms-section">
          <PlatformActivityList
            platforms={weeklyData.byPlatform}
            title="Actividad por plataforma"
            totalDuration={weeklyData.totalDurationInSeconds}
          />
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;
