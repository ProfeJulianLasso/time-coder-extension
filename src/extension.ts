import * as vscode from "vscode";
import { ActivityTracker } from "./activityTracker";
import { ApiService } from "./apiService";
import { ReportViewProvider } from "./reportViewProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("DevTimer está activo");

  // Inicializar servicios
  const apiService = new ApiService();
  const activityTracker = new ActivityTracker(apiService);
  const reportViewProvider = new ReportViewProvider(
    context.extensionUri,
    apiService
  );

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
      reportViewProvider.refreshReport();
      vscode.commands.executeCommand("devtimerReport.focus");
    }
  );

  // Iniciar seguimiento de actividad
  activityTracker.startTracking();

  // Agregar disposables al contexto
  context.subscriptions.push(showReportCommand, activityTracker);
}

export function deactivate() {
  console.log("DevTimer está desactivado");
}
