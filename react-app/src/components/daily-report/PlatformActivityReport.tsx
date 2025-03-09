import React, { FC, useState } from "react";
import { DailySummary, ProjectSummary } from "../../types/interfaces";
import {
  calculatePercentage,
  formatDuration,
  getColorByIndex,
} from "../../utils/time";
import "./DailyReport.css";

interface PlatformActivityReportProps {
  dailyData: DailySummary;
}

/**
 * Componente que muestra la actividad por plataforma
 */
const PlatformActivityReport: FC<PlatformActivityReportProps> = ({
  dailyData,
}) => {
  // Estado para controlar qué plataformas están expandidas
  const [expandedPlatforms, setExpandedPlatforms] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedProjects, setExpandedProjects] = useState<{
    [key: string]: boolean;
  }>({});

  // Ordenar plataformas por tiempo (de mayor a menor)
  const sortedPlatforms = [...dailyData.byPlatform].sort(
    (a, b) => b.durationInSeconds - a.durationInSeconds
  );

  // Calcular total de tiempo
  const totalTime = dailyData.totalDurationInSeconds;

  /**
   * Maneja el cambio de estado de expansión de una plataforma
   * @param platform - Nombre de la plataforma
   */
  const togglePlatformExpansion = (platform: string): void => {
    setExpandedPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  /**
   * Maneja el cambio de estado de expansión de un proyecto
   * @param projectKey - Clave única del proyecto
   */
  const toggleProjectExpansion = (projectKey: string): void => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectKey]: !prev[projectKey],
    }));
  };

  /**
   * Renderiza la lista de proyectos para una plataforma
   * @param projects - Lista de proyectos
   * @param platformDuration - Duración total de la plataforma
   * @param platformKey - Clave única de la plataforma
   */
  const renderProjects = (
    projects: ProjectSummary[],
    platformDuration: number,
    platformKey: string
  ): JSX.Element => {
    // Ordenar proyectos por tiempo
    const sortedProjects = [...projects].sort(
      (a, b) => b.durationInSeconds - a.durationInSeconds
    );

    return (
      <div className="platform-projects">
        {sortedProjects.map((project, projectIndex) => {
          const projectPercentage = calculatePercentage(
            project.durationInSeconds,
            platformDuration
          );
          const projectKey = `${platformKey}-${project.project}`;
          const isProjectExpanded = expandedProjects[projectKey];

          const hasBranches = project.branches && project.branches.length > 0;

          return (
            <div key={projectKey} className="project-item">
              <div
                className="project-header"
                onClick={() =>
                  hasBranches ? toggleProjectExpansion(projectKey) : null
                }
                style={{ cursor: hasBranches ? "pointer" : "default" }}
              >
                <div className="project-name">
                  {hasBranches && (
                    <span className="platform-toggle">
                      {isProjectExpanded ? "▼" : "►"}
                    </span>
                  )}
                  {project.project}
                </div>
                <div className="project-time">
                  {formatDuration(project.durationInSeconds)} (
                  {projectPercentage}%)
                </div>
              </div>
              <div className="project-bar">
                <div
                  className="project-progress"
                  style={{
                    width: `${projectPercentage}%`,
                    backgroundColor: getColorByIndex(
                      projectIndex,
                      sortedProjects.length - 1
                    ),
                  }}
                  title={`${project.project}: ${formatDuration(
                    project.durationInSeconds
                  )} (${projectPercentage}%)`}
                ></div>
              </div>

              {/* Mostrar ramas si el proyecto está expandido */}
              {isProjectExpanded && hasBranches && (
                <div className="branch-container">
                  {project.branches
                    .sort((a, b) => b.durationInSeconds - a.durationInSeconds)
                    .map((branch) => {
                      const branchPercentage = calculatePercentage(
                        branch.durationInSeconds,
                        project.durationInSeconds
                      );
                      return (
                        <div
                          key={`${projectKey}-${branch.branch}`}
                          className="branch-item"
                        >
                          <span className="branch-name">{branch.branch}</span>
                          <span>
                            {formatDuration(branch.durationInSeconds)} (
                            {branchPercentage}%)
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Si no hay datos, mostrar mensaje adecuado
  if (sortedPlatforms.length === 0) {
    return (
      <div className="daily-report">
        <h2>Actividad por plataforma</h2>
        <div className="no-data-message">
          No hay datos de plataformas disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="daily-report">
      <h2>Actividad por plataforma</h2>

      <div className="platform-bars">
        {sortedPlatforms.map((platform, index) => {
          const percentage = calculatePercentage(
            platform.durationInSeconds,
            totalTime
          );
          const platformKey = `${platform.platform}-${platform.machine}`;
          const isPlatformExpanded = expandedPlatforms[platformKey];

          return (
            <div key={platformKey} className="platform-bar-item">
              <div
                className="platform-header"
                onClick={() => togglePlatformExpansion(platformKey)}
                style={{ cursor: "pointer" }}
              >
                <div className="platform-header-container">
                  <span className="platform-toggle">
                    {isPlatformExpanded ? "▼" : "►"}
                  </span>
                  <span className="platform-name">
                    {platform.platform} ({platform.machine})
                  </span>
                </div>
                <div className="highlight-value">
                  {formatDuration(platform.durationInSeconds)} ({percentage}%)
                </div>
              </div>
              <div className="platform-progress-bar">
                <div
                  className="platform-progress"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getColorByIndex(
                      index,
                      sortedPlatforms.length - 1
                    ),
                  }}
                  title={`${platform.platform}: ${formatDuration(
                    platform.durationInSeconds
                  )} (${percentage}%)`}
                ></div>
              </div>

              {/* Mostrar proyectos si la plataforma está expandida */}
              {isPlatformExpanded &&
                renderProjects(
                  platform.projects,
                  platform.durationInSeconds,
                  platformKey
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformActivityReport;
