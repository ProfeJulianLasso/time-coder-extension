import React, { FC } from "react";
import { LanguageSummary } from "../../types/interfaces";
import {
  calculatePercentage,
  formatDuration,
  getColorByIndex,
} from "../../utils/time";
import "./LanguageActivityList.css";

interface LanguageActivityListProps {
  languages: LanguageSummary[];
  title: string;
  totalDuration?: number;
  maxItems?: number;
}

/**
 * Componente reutilizable para mostrar la actividad por lenguaje
 */
const LanguageActivityList: FC<LanguageActivityListProps> = ({
  languages,
  title,
  totalDuration,
  maxItems = 5,
}) => {
  // Si no hay datos, mostrar mensaje adecuado
  if (languages.length === 0) {
    return (
      <div className="language-activity-container">
        <h2>{title}</h2>
        <div className="no-data-message">
          No hay datos de lenguajes disponibles
        </div>
      </div>
    );
  }

  // Ordenar lenguajes por tiempo (de mayor a menor)
  const sortedLanguages = [...languages].sort(
    (a, b) => b.durationInSeconds - a.durationInSeconds
  );

  // Si no se pasa una duración total, usar la suma de todos los lenguajes
  const totalTime =
    totalDuration ??
    sortedLanguages.reduce((acc, lang) => acc + lang.durationInSeconds, 0);

  return (
    <div className="language-activity-container">
      <h2>{title}</h2>

      <div className="language-activity-list">
        {sortedLanguages.slice(0, maxItems).map((language, index) => {
          const percentage = calculatePercentage(
            language.durationInSeconds,
            totalTime
          );
          return (
            <div key={language.language} className="language-item">
              <div className="language-header">
                <span className="language-name">{language.language}</span>
                <span className="language-time">
                  {formatDuration(language.durationInSeconds)} ({percentage}%)
                </span>
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
                  title={`${language.language}: ${formatDuration(
                    language.durationInSeconds
                  )} (${percentage}%)`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageActivityList;
