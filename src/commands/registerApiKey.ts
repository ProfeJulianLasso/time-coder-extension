import open from "open";
import * as vscode from "vscode";
import { AUTH_PORTAL_URL } from "../config/constants";
import { saveApiKey } from "../services/authService";

export async function registerApiKeyCommand() {
  const options = [
    "Configurar API Key manualmente",
    "Obtener API Key desde el portal",
  ];

  const selection = await vscode.window.showQuickPick(options, {
    placeHolder: "Seleccione cómo desea configurar su API Key",
    ignoreFocusOut: true,
  });

  if (!selection) {
    return;
  }

  if (selection === options[0]) {
    await configureApiKeyManually();
  } else {
    await getApiKeyFromPortal();
  }
}

async function configureApiKeyManually() {
  const apiKey = await vscode.window.showInputBox({
    prompt: "Ingrese su API Key de DevTimer",
    password: true,
    ignoreFocusOut: true,
    placeHolder: "API Key",
    validateInput: (value) => {
      return value && value.trim() !== ""
        ? null
        : "La API Key no puede estar vacía";
    },
  });

  if (!apiKey) {
    return;
  }

  try {
    await saveApiKey(apiKey);
    vscode.window.showInformationMessage("API Key configurada correctamente");
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error al guardar API Key: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

async function getApiKeyFromPortal() {
  try {
    // Abrir directamente el portal en el navegador sin esperar confirmación
    await open(AUTH_PORTAL_URL);

    // Mostrar mensaje informativo pero no bloqueante
    vscode.window.showInformationMessage(
      "Portal de autenticación abierto. Después de iniciar sesión, haga clic en el botón para configurar automáticamente su API Key en VS Code."
    );
  } catch (err) {
    console.error("Error abriendo navegador:", err);
    vscode.window.showErrorMessage(
      "No se pudo abrir el navegador. Por favor, visite manualmente: " +
        AUTH_PORTAL_URL
    );
  }
}
