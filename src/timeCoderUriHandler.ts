import * as vscode from "vscode";
import { configurateApiKey } from "./utils/apiKey";

export class TimeCoderUriHandler implements vscode.UriHandler {
  async handleUri(uri: vscode.Uri): Promise<void> {
    try {
      // Asegúrate de que la URI tenga la estructura esperada
      if (uri.authority !== "timecoder") {
        return;
      }

      // Extrae el query string de la URI
      const queryString = uri.query;
      const queryParams = new URLSearchParams(queryString);

      // Obtiene el apiKey del parámetro
      const apiKey = queryParams.get("apiKey");

      if (apiKey) {
        // Guarda el apiKey
        await configurateApiKey(apiKey);

        // Muestra un mensaje de éxito
        vscode.window.showInformationMessage(
          "¡ApiKey configurada correctamente!"
        );
      } else {
        vscode.window.showErrorMessage("No se proporcionó una apiKey válida.");
      }
    } catch (error) {
      console.error("Error al manejar la URI:", error);
      vscode.window.showErrorMessage(
        `Error al procesar la solicitud: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}
