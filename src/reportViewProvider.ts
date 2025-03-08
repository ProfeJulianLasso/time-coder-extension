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

interface PlatformStats {
  platform: string;
  projects: ProjectStats[];
}

interface DailySummary {
  totalHours: number;
  byLanguage: LanguageStats[];
  byProject: ProjectStats[];
  byPlatform: PlatformStats[];
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
  byPlatform: PlatformStats[];
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
    console.log("Refrescando reporte...");
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
    // const dailyTotal = dailyData?.totalHours || 0;
    // const weeklyTotal = weeklyData?.totalHours || 0;

    // Datos para las gráficas
    // const dailyByLanguage = dailyData?.byLanguage || [];
    // const dailyByProject = dailyData?.byProject || [];
    // const dailyByPlatform = dailyData?.byPlatform || [];
    // const weeklyByLanguage = weeklyData?.byLanguage || [];
    // const weeklyByProject = weeklyData?.byProject || [];
    // const weeklyByPlatform = weeklyData?.byPlatform || [];
    // const weeklyDailyHours = weeklyData?.dailyHours || [];

    // Obtener la ruta al archivo bundle.js generado por webpack
    const bundlePath = this.view?.webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "react-app", "dist", "bundle.js")
    );

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
      </style>
    </head>
    <body>
      <div id="root"></div>

      <script>
        // Configurar el objeto vscode antes de cargar React
        const vscode = acquireVsCodeApi();

        // Pasar los datos a la app de React
        window.vscode = vscode;
        window.dailyData = ${JSON.stringify(dailyData)};
        window.weeklyData = ${JSON.stringify(weeklyData)};
      </script>
      <script src="${bundlePath}"></script>
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
          color: var (--vscode-button-foreground);
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
