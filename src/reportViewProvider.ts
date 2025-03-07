import * as vscode from "vscode";
import { ApiService } from "./apiService";

interface LanguageStats {
  language: string;
  hours: number;
}

interface BranchStats {
  branch: string;
  hours: number;
}

interface ProjectStats {
  project: string;
  hours: number;
  branches: BranchStats[];
}

interface DailySummary {
  totalHours: number;
  byLanguage: LanguageStats[];
  byProject: ProjectStats[];
}

interface DailyHours {
  date: string;
  hours: number;
}

interface WeeklySummary {
  totalHours: number;
  dailyHours: DailyHours[];
  byLanguage: LanguageStats[];
  byProject: ProjectStats[];
}

export class ReportViewProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly apiService: ApiService
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView
  ): void | Thenable<void> {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    // Agregar contenido inicial mientras se cargan los datos
    webviewView.webview.html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    padding: 10px;
                }
            </style>
        </head>
        <body>
            <h3>Cargando datos...</h3>
        </body>
        </html>
    `;

    // Usar setTimeout para asegurar que la vista está lista
    setTimeout(() => {
      this.refreshReport();
    }, 100);

    // Manejar mensajes del webview
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === "refresh") {
        this.refreshReport();
      }
    });

    // Manejar cuando la vista se hace visible
    webviewView.onDidChangeVisibility(() => {
      if (webviewView.visible) {
        this.refreshReport();
      }
    });
  }

  public async refreshReport() {
    if (!this.view) {
      console.error("La vista no está inicializada");
      return;
    }

    try {
      console.log("Obteniendo datos...");
      const dailyData = await this.apiService.getDailySummary();
      const weeklyData = await this.apiService.getWeeklySummary();

      console.log("Datos obtenidos:", { dailyData, weeklyData });

      console.log("Actualizando HTML...", this.view);

      // Verificar que la vista aún existe antes de actualizar
      if (this.view) {
        const html = this.getHtmlForWebview(dailyData, weeklyData);
        this.view.webview.html = html;
        console.log("HTML actualizado");
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      if (this.view) {
        this.view.webview.html = this.getErrorHtml();
      }
    }
  }

  private getHtmlForWebview(
    dailyData: DailySummary,
    weeklyData: WeeklySummary
  ): string {
    // Formatear datos para mostrar
    const dailyTotal = dailyData?.totalHours || 0;
    const weeklyTotal = weeklyData?.totalHours || 0;

    // Datos para las gráficas
    const dailyByLanguage = dailyData?.byLanguage || [];
    const dailyByProject = dailyData?.byProject || [];
    const weeklyByLanguage = weeklyData?.byLanguage || [];
    const weeklyByProject = weeklyData?.byProject || [];
    const weeklyDailyHours = weeklyData?.dailyHours || [];

    return `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DevTimer Report</title>
      <style>
        body {
          font-family: var(--vscode-font-family);
          color: var(--vscode-foreground);
          background-color: var(--vscode-editor-background);
          padding: 10px;
          line-height: 1.6;
        }
        h2 {
          margin-top: 0;
        }
        h3, h4 {
          color: var(--vscode-editor-foreground);
        }
        .summary {
          margin-bottom: 20px;
        }
        .total {
          font-size: 1.2em;
          font-weight: bold;
          margin: 10px 0;
        }
        .chart {}
        .bar-container {
          margin-top: 5px;
          margin-bottom: 10px;
          background-color: var(--vscode-editor-background);
          border-radius: 3px;
          overflow: hidden;
        }
        .bar {
          height: 15px;
          background-color: var(--vscode-button-background);
          border-radius: 3px;
          margin-top: 2px;
        }
        .label {
          display: flex;
          justify-content: space-between;
          font-size: 0.9em;
          color: var(--vscode-editor-foreground);
        }
        .branch {
          margin-left: 20px;
        }
        button {
          background-color: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          border: none;
          padding: 10px 15px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 1em;
        }
        button:hover {
          background-color: var(--vscode-button-hoverBackground);
        }
        .button-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          button {
            width: 100%;
          }
        }
        hr {
          border: 1px solid var(--vscode-editorLineNumber-foreground);
          margin: 20px 0;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div class="summary">
        <h2>Resumen de actividad</h2>
        <div class="total">Hoy: ${dailyTotal.toFixed(2)} horas</div>
        <div class="total">Esta semana: ${weeklyTotal.toFixed(2)} horas</div>
      </div>

      <hr>

      <div class="chart">
        <h3>Por lenguaje (hoy)</h3>
        ${dailyByLanguage
          .map(
            (item: LanguageStats) => `
          <div>
            <div class="label">
              <span>${item.language}</span>
              <span>${item.hours.toFixed(2)} h</span>
            </div>
            <div class="bar-container">
              <div class="bar" style="width: ${
                (item.hours / dailyTotal) * 100
              }%"></div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <hr>

      <div class="chart">
        <h3>Por proyecto (hoy)</h3>
        ${dailyByProject
          .map(
            (item: ProjectStats) => `
          <div>
            <div class="label">
              <span>${item.project}</span>
              <span>${item.hours.toFixed(2)} h</span>
            </div>
            <div class="bar-container">
              <div class="bar" style="width: ${
                (item.hours / dailyTotal) * 100
              }%"></div>
            </div>
            ${item.branches
              .map(
                (branch: BranchStats) => `
              <div class="branch">
                <div class="label">
                  <span>${branch.branch}</span>
                  <span>${branch.hours.toFixed(2)} h</span>
                </div>
                <div class="bar-container">
                  <div class="bar" style="width: ${
                    (branch.hours / item.hours) * 100
                  }%"></div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        `
          )
          .join("")}
      </div>

      <hr>

      <div class="chart">
        <h3>Por lenguaje (esta semana)</h3>
        ${weeklyByLanguage
          .map(
            (item: LanguageStats) => `
          <div>
            <div class="label">
              <span>${item.language}</span>
              <span>${item.hours.toFixed(2)} h</span>
            </div>
            <div class="bar-container">
              <div class="bar" style="width: ${
                (item.hours / weeklyTotal) * 100
              }%"></div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <hr>

      <div class="chart">
        <h3>Por proyecto (esta semana)</h3>
        ${weeklyByProject
          .map(
            (item: ProjectStats) => `
          <div>
            <div class="label">
              <span>${item.project}</span>
              <span>${item.hours.toFixed(2)} h</span>
            </div>
            <div class="bar-container">
              <div class="bar" style="width: ${
                (item.hours / weeklyTotal) * 100
              }%"></div>
            </div>
            ${item.branches
              .map(
                (branch: BranchStats) => `
              <div class="branch">
                <div class="label">
                  <span>${branch.branch}</span>
                  <span>${branch.hours.toFixed(2)} h</span>
                </div>
                <div class="bar-container">
                  <div class="bar" style="width: ${
                    (branch.hours / item.hours) * 100
                  }%"></div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        `
          )
          .join("")}
      </div>

      <hr>

      <div class="chart">
        <h3>Horas diarias (esta semana)</h3>
        ${weeklyDailyHours
          .map(
            (item: DailyHours) => `
          <div>
            <div class="label">
              <span>${new Date(item.date).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}</span>
              <span>${item.hours.toFixed(2)} h</span>
            </div>
            <div class="bar-container">
              <div class="bar" style="width: ${
                (item.hours / weeklyTotal) * 100
              }%"></div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>

      <hr>

      <div class="button-container">
        <button id="refresh">Actualizar</button>
      </div>

      <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('refresh').addEventListener('click', () => {
          vscode.postMessage({
            command: 'refresh'
          });
        });
      </script>
    </body>
    </html>`;
  }

  private getErrorHtml(): string {
    return `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DevTimer Report</title>
      <style>
        body {
          font-family: var(--vscode-font-family);
          color: var(--vscode-foreground);
          padding: 10px;
        }
        .error {
          color: var(--vscode-errorForeground);
          margin: 20px 0;
        }
        button {
          background-color: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          border: none;
          padding: 8px 12px;
          border-radius: 2px;
          cursor: pointer;
          margin-top: 10px;
        }
        button:hover {
          background-color: var(--vscode-button-hoverBackground);
        }
      </style>
    </head>
    <body>
      <h3>DevTimer</h3>
      <div class="error">
        No se pudieron cargar los datos. Verifica la conexión con el servidor y la configuración de la API.
      </div>
      <button id="refresh">Reintentar</button>

      <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('refresh').addEventListener('click', () => {
          vscode.postMessage({
            command: 'refresh'
          });
        });
      </script>
    </body>
    </html>`;
  }
}
