import * as vscode from "vscode";

// Guarda el apiKey en la configuración
export async function configurateApiKey(apiKey: string): Promise<void> {
  try {
    // Guarda el apiKey en la configuración global
    await vscode.workspace
      .getConfiguration("timecode")
      .update("apiKey", apiKey, true);
  } catch (error) {
    console.error("Error al guardar el apiKey:", error);
    throw new Error(
      `No se pudo guardar el apiKey: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

// Obtiene el apiKey de la configuración
export function getApiKey(): string | undefined {
  return vscode.workspace.getConfiguration("timecode").get("apiKey");
}
