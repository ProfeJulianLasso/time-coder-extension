import React, { FC } from "react";
import { WeeklySummary } from "../../types/interfaces";
import { formatDuration, getColorByIndex } from "../../utils/time";
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

  // Ordenar lenguajes por tiempo
  const sortedLanguages = [...weeklyData.byLanguage].sort(
    (a, b) => b.durationInSeconds - a.durationInSeconds
  );

  // Encontrar el máximo tiempo diario para escalar las barras
  const maxDailyTime = Math.max(
    ...sortedDailyData.map((day) => day.durationInSeconds),
    1
  );

  return (
    <div className="weekly-report">
      <h2>Resumen semanal</h2>

      <div className="summary-info">
        <div className="total">
          <span>Total de la semana: </span>
          <span className="highlight-value">
            {formatDuration(weeklyData.totalDurationInSeconds)}
          </span>
        </div>

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
              const displayDate = new Date(day.date).toLocaleDateString(
                "es-ES",
                {
                  day: "2-digit",
                  month: "2-digit",
                }
              );

              return (
                <div key={day.date} className="daily-bar-container">
                  <div className="bar-label">
                    {formatDuration(day.durationInSeconds)}
                  </div>
                  <div
                    className="daily-bar"
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: getColorByIndex(
                        index,
                        sortedDailyData.length - 1
                      ),
                    }}
                    title={`${getDayName(
                      day.date
                    )} ${displayDate}: ${formatDuration(
                      day.durationInSeconds
                    )}`}
                  ></div>
                  <div className="day-label">
                    {getDayName(day.date).substring(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sortedLanguages.length > 0 && (
        <div className="languages-section">
          <h2>Lenguajes de la semana</h2>
          <div className="top-languages">
            {sortedLanguages.slice(0, 5).map((lang, index) => (
              <div key={lang.language} className="language-item">
                <div className="language-name">{lang.language}</div>
                <div className="language-time">
                  {formatDuration(lang.durationInSeconds)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReport;
