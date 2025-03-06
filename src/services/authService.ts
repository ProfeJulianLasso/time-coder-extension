import * as vscode from "vscode";

/**
 * Guarda la API Key en la configuración
 * @param apiKey API Key a guardar
 */
export async function saveApiKey(apiKey: string): Promise<void> {
  const config = vscode.workspace.getConfiguration("devtimer");
  await config.update("apiKey", apiKey, vscode.ConfigurationTarget.Global);
}

/**
 * Obtiene la API Key actual
 * @returns API Key almacenada o undefined si no existe
 */
export function getApiKey(): string | undefined {
  const config = vscode.workspace.getConfiguration("devtimer");
  return config.get<string>("apiKey");
}
