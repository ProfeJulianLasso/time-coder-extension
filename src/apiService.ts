import axios, { AxiosInstance } from "axios";
import * as vscode from "vscode";

export class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = this.createClient();

    // Reconstruir cliente cuando cambien las configuraciones
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("devtimer")) {
        this.client = this.createClient();
      }
    });
  }

  private createClient(): AxiosInstance {
    const config = vscode.workspace.getConfiguration("devtimer");
    const apiUrl = config.get<string>("apiUrl") || "http://localhost:3000";
    const apiKey = config.get<string>("apiKey") || "";

    return axios.create({
      baseURL: apiUrl,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  public async sendActivityData(data: any[]): Promise<void> {
    try {
      await this.client.post("/activity", data);
    } catch (error) {
      console.error("Error enviando datos al servidor:", error);
      throw error;
    }
  }

  public async getDailySummary(): Promise<any> {
    try {
      const response = await this.client.get("/reports/daily");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo resumen diario:", error);
      throw error;
    }
  }

  public async getWeeklySummary(): Promise<any> {
    try {
      const response = await this.client.get("/reports/weekly");
      return response.data;
    } catch (error) {
      console.error("Error obteniendo resumen semanal:", error);
      throw error;
    }
  }
}
