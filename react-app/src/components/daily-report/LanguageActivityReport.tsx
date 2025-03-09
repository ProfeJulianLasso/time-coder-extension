import React, { FC } from "react";
import { DailySummary } from "../../types/interfaces";
import "./DailyReport.css";

interface LanguageActivityReportProps {
  dailyData: DailySummary;
}

const LanguageActivityReport: FC<LanguageActivityReportProps> = ({
  dailyData,
}) => {
  // Extraer datos del dailyData o usar datos de ejemplo si no hay datos reales
  const languages =
    dailyData.byLanguage?.length > 0
      ? dailyData.byLanguage
      : [
          { language: "TypeScript", durationInSeconds: 4.2 },
          { language: "JavaScript", durationInSeconds: 2.8 },
          { language: "HTML/CSS", durationInSeconds: 1.5 },
        ];

  // Ordenar lenguajes por horas (de mayor a menor)
  const sortedLanguages = [...languages].sort(
    (a, b) => b.durationInSeconds - a.durationInSeconds
  );

  // Calcular total de horas
  const totalHours = languages.reduce(
    (sum, lang) => sum + lang.durationInSeconds,
    0
  );

  // Función para formatear horas
  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // Generar color basado en la posición en la lista (tonos de azul)
  const getLanguageColor = (index: number, total: number): string => {
    // Usar una base de color azul (HSL: 210)
    // Variar la saturación y luminosidad según la posición
    const baseHue = 210; // Azul
    const saturation = 80 - (index / total) * 40; // 80% a 40%
    const lightness = 45 + (index / total) * 25; // 45% a 70%

    return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="daily-report">
      <h2>Actividad por Lenguaje</h2>

      <div className="language-bars">
        {sortedLanguages.map((lang, index) => {
          const percentage = (lang.durationInSeconds / totalHours) * 100;
          return (
            <div key={lang.language} className="language-bar-item">
              <div className="language-header">
                <div className="language-name">{lang.language}</div>
                <div className="highlight-value">
                  {formatHours(lang.durationInSeconds)} (
                  {Math.round(percentage)}%)
                </div>
              </div>
              <div className="language-progress-bar">
                <div
                  className="language-progress"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getLanguageColor(
                      index,
                      sortedLanguages.length - 1
                    ),
                  }}
                  title={`${lang.language}: ${formatHours(
                    lang.durationInSeconds
                  )} (${Math.round(percentage)}%)`}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageActivityReport;
