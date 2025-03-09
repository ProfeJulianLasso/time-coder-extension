import React, { FC, useState } from "react";
import { PlatformSummary, ProjectSummary } from "../../types/interfaces";
import {
  calculatePercentage,
  formatDuration,
  getColorByIndex,
} from "../../utils/time";
import "./PlatformActivityList.css";

interface PlatformActivityListProps {
  platforms: PlatformSummary[];
  title: string;
  totalDuration?: number;
}

/**
 * Componente reutilizable que muestra la actividad por plataforma
 */
const PlatformActivityList: FC<PlatformActivityListProps> = ({
  platforms,
  title,
  totalDuration,
}) => {
  // Estado para controlar qué plataformas están expandidas
  const [expandedPlatforms, setExpandedPlatforms] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedProjects, setExpandedProjects] = useState<{
    [key: string]: boolean;
  }>({});

  // Ordenar plataformas por tiempo (de mayor a menor)
  const sortedPlatforms = [...platforms].sort(
    (a, b) => b.durationInSeconds - a.durationInSeconds
  );

  // Si no se pasa una duración total, usar la suma de todas las plataformas
  const totalTime =
    totalDuration ??
    sortedPlatforms.reduce(
      (acc, platform) => acc + platform.durationInSeconds,
      0
    );

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
   * Renderiza la gráfica de actividad para un proyecto
   * @param project - Datos del proyecto
   */
  const renderActivityBar = (project: ProjectSummary): JSX.Element => {
    const totalProjectTime = project.durationInSeconds;
    const debugTime = project.debug.durationInSeconds;
    const codingTime = totalProjectTime - debugTime;

    const codingPercentage =
      Math.round((codingTime / totalProjectTime) * 100) || 0;
    const debugPercentage = 100 - codingPercentage;

    return (
      <div className="project-activity">
        <div className="project-activity-bar">
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
        <div className="project-activity-legend">
          <div className="mini-legend-item">
            <span className="mini-legend-color coding-color"></span>
            <span className="mini-legend-text">
              {formatDuration(codingTime)} ({codingPercentage}%)
            </span>
          </div>
          <div className="mini-legend-item">
            <span className="mini-legend-color debug-color"></span>
            <span className="mini-legend-text">
              {formatDuration(debugTime)} ({debugPercentage}%)
            </span>
          </div>
        </div>
      </div>
    );
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

              {renderActivityBar(project)}

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
      <div className="platform-activity-container">
        <h2>{title}</h2>
        <div className="no-data-message">
          No hay datos de plataformas disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="platform-activity-container">
      <h2>{title}</h2>

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

export default PlatformActivityList;
