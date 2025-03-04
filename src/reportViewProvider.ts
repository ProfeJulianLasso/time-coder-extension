import * as vscode from "vscode";
import { ApiService } from "./apiService";

export class ReportViewProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly apiService: ApiService
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    this.refreshReport();

    // Manejar mensajes del webview
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === "refresh") {
        this.refreshReport();
      }
    });
  }

  public async refreshReport() {
    if (this.view) {
      try {
        const dailyData = await this.apiService.getDailySummary();
        const weeklyData = await this.apiService.getWeeklySummary();

        this.view.webview.html = this.getHtmlForWebview(dailyData, weeklyData);
      } catch (error) {
        this.view.webview.html = this.getErrorHtml();
      }
    }
  }

  private getHtmlForWebview(dailyData: any, weeklyData: any): string {
    // Formatear datos para mostrar
    const dailyTotal = dailyData?.totalHours || 0;
    const weeklyTotal = weeklyData?.totalHours || 0;

    // Datos para las gráficas
    const dailyByLanguage = dailyData?.byLanguage || [];
    const dailyByProject = dailyData?.byProject || [];

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
        .summary {
          margin-bottom: 20px;
        }
        .total {
          font-size: 1.2em;
          font-weight: bold;
          margin: 10px 0;
        }
        .chart {
          margin-top: 15px;
        }
        .bar-container {
          margin-top: 5px;
          margin-bottom: 10px;
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
        }
        button {
          background-color: var(--vscode-button-background);
          color: var(--vscode-button-foreground);
          border: none;
          padding: 8px 12px;
          border-radius: 2px;
          cursor: pointer;
          margin-top: 20px;
        }
        button:hover {
          background-color: var(--vscode-button-hoverBackground);
        }
      </style>
    </head>
    <body>
      <div class="summary">
        <h3>Resumen de actividad</h3>
        <div class="total">Hoy: ${dailyTotal.toFixed(2)} horas</div>
        <div class="total">Esta semana: ${weeklyTotal.toFixed(2)} horas</div>
      </div>

      <div class="chart">
        <h4>Por lenguaje (hoy)</h4>
        ${dailyByLanguage
          .map(
            (item) => `
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

      <div class="chart">
        <h4>Por proyecto (hoy)</h4>
        ${dailyByProject
          .map(
            (item) => `
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
          </div>
        `
          )
          .join("")}
      </div>

      <button id="refresh">Actualizar</button>

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
