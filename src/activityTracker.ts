import * as vscode from "vscode";
import { ApiService } from "./apiService";

interface ActivityData {
  project: string;
  file: string;
  language: string;
  gitBranch: string;
  startTime: number;
  endTime: number;
}

export class ActivityTracker implements vscode.Disposable {
  private readonly disposables: vscode.Disposable[] = [];
  private isActive: boolean = false;
  private lastActivity: number = Date.now();
  private currentFile: string = "";
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private activityBuffer: ActivityData[] = [];
  private readonly idleThreshold: number = 2 * 60 * 1000; // 2 minutos en ms

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
    const gitBranch = await this.getGitBranch(fileName);

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
          gitBranch: gitBranch,
          startTime: this.lastActivity,
          endTime: now,
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

  private async getGitBranch(filePath: string): Promise<string> {
    try {
      // Primero intentar usar la API de Git de VS Code si está disponible
      const extension = vscode.extensions.getExtension("vscode.git");
      if (extension) {
        const gitExtension = extension.isActive
          ? extension.exports
          : await extension.activate();
        const api = gitExtension.getAPI(1);
        if (api) {
          // Buscar el repositorio que contiene el archivo actual
          const repositories = api.repositories;
          for (const repo of repositories) {
            if (filePath.startsWith(repo.rootUri.fsPath)) {
              const branch = repo.state.HEAD?.name;
              if (branch) {
                return branch;
              }
            }
          }
        }
      }

      // Fallback: Usar procesos para ejecutar git command
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (workspaceFolder) {
        const folderPath = workspaceFolder.uri.fsPath;

        return new Promise<string>((resolve) => {
          const { exec } = require("child_process");
          exec(
            "git rev-parse --abbrev-ref HEAD",
            { cwd: folderPath },
            (err: any, stdout: string) => {
              if (err) {
                resolve("unknown");
                return;
              }
              resolve(stdout.trim());
            }
          );
        });
      }
    } catch (error) {
      console.error("Error obteniendo información git:", error);
    }

    return "unknown";
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
        this.getGitBranch(this.currentFile).then((gitBranch) => {
          this.bufferActivity({
            project: this.getProjectName(),
            file: this.currentFile,
            language: language,
            gitBranch: gitBranch,
            startTime: this.lastActivity,
            endTime: now,
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
