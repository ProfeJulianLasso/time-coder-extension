import * as vscode from "vscode";
import { ActivityTracker } from "./activityTracker";
import { ApiService } from "./apiService";
import { registerApiKeyCommand } from "./commands/registerApiKey";
import { ReportViewProvider } from "./reportViewProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("DevTimer está activándose");

  // Inicializar servicios
  const apiService = new ApiService();
  const activityTracker = new ActivityTracker(apiService);
  const reportViewProvider = new ReportViewProvider(
    context.extensionUri,
    apiService
  );

  // Iniciar notificaciones de API Key si es necesario
  console.log("Iniciando sistema de notificaciones de API Key");
  apiService.startApiKeyNotifications();

  // Ejecutar una verificación inmediata después de un pequeño retraso
  // para asegurar que la UI de VS Code esté completamente cargada
  setTimeout(() => {
    console.log("Comprobación programada de API Key");
    apiService.checkApiKeyImmediately();
  }, 3000);

  // Registrar proveedor de vista para el sidebar
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "devtimerReport",
      reportViewProvider
    )
  );

  // Comando para mostrar reporte
  let showReportCommand = vscode.commands.registerCommand(
    "devtimer.showReport",
    () => {
      if (!apiService.hasApiKey()) {
        apiService.promptForApiKey();
        return;
      }
      reportViewProvider.refreshReport();
      vscode.commands.executeCommand("devtimerReport.focus");
    }
  );

  // Comando para configurar API key
  let configApiKeyCommand = vscode.commands.registerCommand(
    "devtimer.configApiKey",
    registerApiKeyCommand
  );

  // Registrar manipulador de URI para capturar el código de autenticación
  context.subscriptions.push(
    vscode.window.registerUriHandler({
      handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {
        console.log("URI Handler recibido:", uri.toString());
        if (uri.path === "/extension/ms-vscode-remote.remote-containers") {
          const apiKey = uri.query
            .split("&")
            .find((param) => param.startsWith("apiKey="))
            ?.substring(7);

          if (apiKey) {
            // Configurar API Key recibida a través de la URI
            console.log("API Key recibida a través de URI");
            apiService.setApiKey(apiKey);
            vscode.window.showInformationMessage(
              "API Key configurada correctamente"
            );
          }
        }
        return;
      },
    })
  );

  // Iniciar seguimiento de actividad
  activityTracker.startTracking();

  // Agregar disposables al contexto
  context.subscriptions.push(
    showReportCommand,
    configApiKeyCommand,
    activityTracker
  );

  console.log("DevTimer está activo y completamente inicializado");
}

export function deactivate() {
  console.log("DevTimer está desactivado");
}
