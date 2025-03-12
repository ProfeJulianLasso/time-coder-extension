import * as vscode from "vscode";
import { API_BASE_URL } from "./config/constants";
import { saveApiKey } from "./services/authService";

export class ApiService {
  private baseUrl: string;
  private apiKey: string;
  private notificationInterval: NodeJS.Timeout | null = null;
  private lastNotificationTime: number = 0;
  private readonly notificationFrequency = 2 * 60 * 1000; // Reducido a 2 minutos para pruebas

  constructor() {
    this.baseUrl = "";
    this.apiKey = "";
    this.updateConfig();
    console.log("ApiService constructor - Verificando API Key...");

    // Reconstruir configuración cuando cambien los settings
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("devtimer")) {
        this.updateConfig();
        console.log(
          "Configuración actualizada. API Key presente:",
          this.hasApiKey()
        );
        // Verificar si se configuró la apiKey
        if (this.hasApiKey()) {
          this.stopNotifications();
        }
      }
    });
  }

  private updateConfig(): void {
    const config = vscode.workspace.getConfiguration("devtimer");
    this.baseUrl = API_BASE_URL;
    this.apiKey = config.get<string>("apiKey") ?? "";
    console.log(
      `Config actualizada - API URL: ${
        this.baseUrl
      }, API Key presente: ${this.hasApiKey()}`
    );
  }

  /**
   * Configura el API key y lo guarda en la configuración
   * @param apiKey API Key a configurar
   */
  public async setApiKey(apiKey: string): Promise<void> {
    if (!apiKey || apiKey.trim() === "") {
      vscode.window.showErrorMessage("La API Key no puede estar vacía");
      return;
    }

    try {
      await saveApiKey(apiKey);
      this.apiKey = apiKey;
      this.stopNotifications();
      console.log("API Key configurada correctamente");
    } catch (error) {
      vscode.window.showErrorMessage(
        `Error al guardar la API Key: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Verifica si la API key está configurada
   */
  public hasApiKey(): boolean {
    return !!this.apiKey && this.apiKey.trim() !== "";
  }

  /**
   * Muestra una notificación solicitando la configuración de la API key
   */
  public promptForApiKey(): void {
    const now = Date.now();
    // Evitar mostrar demasiadas notificaciones seguidas
    if (now - this.lastNotificationTime < 5000) {
      return;
    }
    this.lastNotificationTime = now;

    console.log("Mostrando diálogo de configuración de API Key");

    // Usar un modal en lugar de una notificación normal
    vscode.window
      .showWarningMessage(
        "DevTimer requiere una API key para funcionar. Por favor configúrela.",
        { modal: true },
        "Configurar ahora",
        "Ingresar API key"
      )
      .then((selection) => {
        console.log("Opción seleccionada:", selection);
        if (selection === "Configurar ahora") {
          vscode.commands.executeCommand("devtimer.configApiKey");
        } else if (selection === "Ingresar API key") {
          this.promptApiKeyInput();
        }
      });
  }

  /**
   * Solicita al usuario ingresar la API key directamente
   */
  private async promptApiKeyInput(): Promise<void> {
    console.log("Solicitando input de API Key");
    const apiKey = await vscode.window.showInputBox({
      prompt: "Ingrese su DevTimer API key",
      password: true,
      ignoreFocusOut: true,
      placeHolder: "API Key",
    });

    console.log("API Key ingresada:", apiKey ? "Sí (oculta)" : "No");
    if (apiKey) {
      await this.setApiKey(apiKey);
      vscode.window.showInformationMessage("API key configurada correctamente");
    } else {
      // Si el usuario cancela, mostrar otra notificación después de un breve retraso
      setTimeout(() => this.promptForApiKey(), 3000);
    }
  }

  /**
   * Inicia las notificaciones periódicas para solicitar la API key
   */
  public startApiKeyNotifications(): void {
    console.log("Iniciando sistema de notificaciones de API Key");
    console.log("¿API Key configurada?", this.hasApiKey());
    console.log(
      "¿Intervalo de notificación ya configurado?",
      !!this.notificationInterval
    );

    // Siempre verificar la API Key al inicio
    if (!this.hasApiKey()) {
      console.log("API Key no configurada, mostrando prompt inmediatamente");
      // Mostrar notificación con un pequeño retraso para asegurar que VS Code está listo
      setTimeout(() => this.promptForApiKey(), 1000);

      // Configurar notificaciones periódicas
      if (!this.notificationInterval) {
        console.log("Configurando intervalo de notificaciones periódicas");
        this.notificationInterval = setInterval(() => {
          console.log("Verificación periódica de API Key");
          if (!this.hasApiKey()) {
            console.log("API Key aún no configurada, mostrando prompt");
            this.promptForApiKey();
          } else {
            console.log("API Key configurada, deteniendo notificaciones");
            this.stopNotifications();
          }
        }, this.notificationFrequency);
      }
    }
  }

  /**
   * Fuerza la comprobación inmediata de la API key
   */
  public checkApiKeyImmediately(): void {
    console.log("Comprobación inmediata de API Key");
    if (!this.hasApiKey()) {
      this.promptForApiKey();
    }
  }

  /**
   * Detiene las notificaciones periódicas
   */
  private stopNotifications(): void {
    if (this.notificationInterval) {
      console.log("Deteniendo sistema de notificaciones");
      clearInterval(this.notificationInterval);
      this.notificationInterval = null;
    }
  }

  private async fetchWithConfig(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    if (!this.hasApiKey()) {
      console.log("fetchWithConfig: API Key no configurada");
      this.promptForApiKey();
      throw new Error("API key no configurada");
    }

    const url = `${this.baseUrl}${endpoint}`;
    console.log("Realizando petición a:", url);
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error en la petición a ${endpoint}:`, error);
      throw error;
    }
  }

  public async sendActivityData(data: any[]): Promise<void> {
    if (data.length === 0) {
      return;
    }

    if (!this.hasApiKey()) {
      console.log("No se puede enviar actividad: API Key no configurada");
      this.promptForApiKey();
      return;
    }

    try {
      await this.fetchWithConfig("/activity", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error enviando datos al servidor:", error);
      throw error;
    }
  }

  public async getDailySummary(): Promise<any> {
    try {
      return await this.fetchWithConfig("/reports/daily");
    } catch (error) {
      console.error("Error obteniendo resumen diario:", error);
      throw error;
    }
  }

  public async getWeeklySummary(): Promise<any> {
    try {
      return await this.fetchWithConfig("/reports/weekly");
    } catch (error) {
      console.error("Error obteniendo resumen semanal:", error);
      throw error;
    }
  }
}
