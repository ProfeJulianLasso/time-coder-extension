import * as os from "os";
import * as vscode from "vscode";
import { ApiService } from "./apiService";

interface ActivityData {
  project: string;
  file: string;
  language: string;
  branch: string;
  startTime: number;
  endTime: number;
  debug: boolean;
  machine: string;
  platform: string;
}

export class ActivityTracker implements vscode.Disposable {
  private readonly disposables: vscode.Disposable[] = [];
  private isActive: boolean = false;
  private lastActivity: number = Date.now();
  private currentFile: string = "";
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private activityBuffer: ActivityData[] = [];
  private readonly idleThreshold: number = 1 * 60 * 1000; // 1 minutos en ms

  constructor(private readonly apiService: ApiService) {}

  public startTracking(): void {
    // Monitorear cambios de texto
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument(this.onDocumentChange.bind(this))
    );

    // Monitorear cambios de documento activo
    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor(this.onEditorChange.bind(this))
    );

    // Inicializar el estado con el editor actual
    if (vscode.window.activeTextEditor) {
      this.onEditorChange(vscode.window.activeTextEditor);
    }

    // Iniciar heartbeat para enviar datos periódicamente
    this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), 30000); // Cada 30 segundos
  }

  private onDocumentChange(event: vscode.TextDocumentChangeEvent): void {
    if (this.isValidDocument(event.document)) {
      this.recordActivity(event.document);
    }
  }

  private onEditorChange(editor: vscode.TextEditor | undefined): void {
    if (editor && this.isValidDocument(editor.document)) {
      this.recordActivity(editor.document);
    }
  }

  private isValidDocument(document: vscode.TextDocument): boolean {
    // Verificar si el documento es válido para seguimiento
    return document.uri.scheme === "file";
  }

  private async recordActivity(document: vscode.TextDocument): Promise<void> {
    const now = Date.now();
    const fileName = document.fileName;
    const language = document.languageId;
    const branch = await this.getBranch(fileName);

    // Si el usuario estaba inactivo o cambió de archivo, guardar la actividad anterior
    if (
      now - this.lastActivity > this.idleThreshold ||
      this.currentFile !== fileName
    ) {
      if (this.currentFile && this.isActive) {
        this.bufferActivity({
          project: this.getProjectName(),
          file: this.currentFile,
          language: language,
          branch,
          startTime: this.lastActivity,
          endTime: now,
          debug: vscode.debug.activeDebugSession !== undefined,
          machine: os.hostname(),
          platform: os.platform(),
        });
      }
      this.currentFile = fileName;
    }

    this.lastActivity = now;
    this.isActive = true;
  }

  private getProjectName(): string {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    return workspaceFolder?.name ?? "unknown";
  }

  private async getBranch(filePath: string): Promise<string> {
    try {
      // Intentar obtener la rama usando la API de VS Code
      const branchFromApi = await this.getBranchFromVSCodeApi(filePath);
      if (branchFromApi) {
        return branchFromApi;
      }

      // Fallback: obtener la rama usando el comando git
      const branchFromCmd = await this.getBranchFromGitCommand();
      if (branchFromCmd) {
        return branchFromCmd;
      }
    } catch (error) {
      console.error("Error obteniendo información git:", error);
    }

    return "unknown";
  }

  private async getBranchFromVSCodeApi(
    filePath: string
  ): Promise<string | null> {
    const extension = vscode.extensions.getExtension("vscode.git");
    if (!extension) {
      return null;
    }

    const gitExtension = extension.isActive
      ? extension.exports
      : await extension.activate();

    const api = gitExtension.getAPI(1);
    if (!api) {
      return null;
    }

    // Buscar el repositorio que contiene el archivo actual
    for (const repo of api.repositories) {
      if (filePath.startsWith(repo.rootUri.fsPath)) {
        return repo.state.HEAD?.name || null;
      }
    }

    return null;
  }

  private async getBranchFromGitCommand(): Promise<string | null> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return null;
    }

    const folderPath = workspaceFolder.uri.fsPath;

    return new Promise<string | null>((resolve) => {
      const { exec } = require("child_process");
      exec(
        "git rev-parse --abbrev-ref HEAD",
        { cwd: folderPath },
        (err: any, stdout: string) => {
          if (err) {
            resolve(null);
            return;
          }
          resolve(stdout.trim() || null);
        }
      );
    });
  }

  private bufferActivity(data: ActivityData): void {
    this.activityBuffer.push(data);
  }

  private sendHeartbeat(): void {
    // Si no hay actividad reciente, marcar como inactivo
    const now = Date.now();
    if (now - this.lastActivity > this.idleThreshold) {
      if (this.isActive && this.currentFile) {
        const document = vscode.window.activeTextEditor?.document;
        const language = document?.languageId ?? "";

        // Obtener la rama git de forma asíncrona
        this.getBranch(this.currentFile).then((branch) => {
          this.bufferActivity({
            project: this.getProjectName(),
            file: this.currentFile,
            language: language,
            branch,
            startTime: this.lastActivity,
            endTime: now,
            debug: vscode.debug.activeDebugSession !== undefined,
            machine: os.hostname(),
            platform: os.platform(),
          });
          this.isActive = false;
        });
      }
    }

    // Enviar datos almacenados al servidor
    if (this.activityBuffer.length > 0) {
      this.apiService
        .sendActivityData(this.activityBuffer)
        .then(() => {
          this.activityBuffer = [];
        })
        .catch((error) => {
          console.error("Error enviando datos de actividad:", error);
        });
    }
  }

  public dispose(): void {
    this.disposables.forEach((d) => d.dispose());
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }
}
