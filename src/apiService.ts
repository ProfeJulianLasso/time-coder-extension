import * as vscode from "vscode";

export class ApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = "";
    this.apiKey = "";
    this.updateConfig();
    // Reconstruir configuración cuando cambien los settings
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("devtimer")) {
        this.updateConfig();
      }
    });
  }

  private updateConfig(): void {
    const config = vscode.workspace.getConfiguration("devtimer");
    this.baseUrl = config.get<string>("apiUrl") ?? "http://localhost:3000";
    this.apiKey = config.get<string>("apiKey") ?? "";
  }

  private async fetchWithConfig(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
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
