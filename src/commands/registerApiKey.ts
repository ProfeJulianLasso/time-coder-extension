import * as vscode from "vscode";
import { registerUser, saveApiKey } from "../services/authService";

export async function registerApiKeyCommand() {
  // Solicitar correo corporativo
  const email = await vscode.window.showInputBox({
    placeHolder: "Correo corporativo",
    prompt: "Introduce tu correo corporativo para obtener una API Key",
    validateInput: (text) => {
      // Expresión regular para validar emails
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(text)
        ? null
        : "Por favor, introduce un correo electrónico válido";
    },
  });

  if (!email) {
    vscode.window.showErrorMessage(
      "Se requiere un correo corporativo para registrarse"
    );
    return;
  }

  // Solicitar contraseña
  const password = await vscode.window.showInputBox({
    placeHolder: "Contraseña",
    prompt: "Introduce tu contraseña",
    password: true,
  });

  if (!password) {
    vscode.window.showErrorMessage(
      "Se requiere una contraseña para registrarse"
    );
    return;
  }

  try {
    vscode.window.showInformationMessage("Registrando usuario...");

    const response = await registerUser(email, password);

    await saveApiKey(response.apiKey);

    vscode.window.showInformationMessage("API Key registrada correctamente");
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error al registrar API Key: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
