import React, { FC } from "react";
import { DailySummary } from "../../types/interfaces";
import {
  calculatePercentage,
  formatDuration,
  getColorByIndex,
} from "../../utils/time";
import "./DailyReport.css";

interface LanguageActivityReportProps {
  dailyData: DailySummary;
}

const LanguageActivityReport: FC<LanguageActivityReportProps> = ({
  dailyData,
}) => {
  // Usar siempre los datos reales de dailyData
  const languages = dailyData.byLanguage || [];

  // Ordenar lenguajes por tiempo (de mayor a menor)
  const sortedLanguages = [...languages].sort(
    (a, b) => b.durationInSeconds - a.durationInSeconds
  );

  // Calcular total de tiempo
  const totalTime = languages.reduce(
    (sum, lang) => sum + lang.durationInSeconds,
    0
  );

  return (
    <div className="daily-report">
      <h2>Actividad por Lenguaje</h2>

      {sortedLanguages.length > 0 ? (
        <div className="language-bars">
          {sortedLanguages.map((lang, index) => {
            const percentage = calculatePercentage(
              lang.durationInSeconds,
              totalTime
            );
            return (
              <div key={lang.language} className="language-bar-item">
                <div className="language-header">
                  <div className="language-name">{lang.language}</div>
                  <div className="highlight-value">
                    {formatDuration(lang.durationInSeconds)} ({percentage}%)
                  </div>
                </div>
                <div className="language-progress-bar">
                  <div
                    className="language-progress"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getColorByIndex(
                        index,
                        sortedLanguages.length - 1
                      ),
                    }}
                    title={`${lang.language}: ${formatDuration(
                      lang.durationInSeconds
                    )} (${percentage}%)`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-data-message">
          No hay datos de lenguajes disponibles
        </div>
      )}
    </div>
  );
};

export default LanguageActivityReport;
