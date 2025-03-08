import { mockDailyData, mockWeeklyData } from "./mockData";

class VSCodeAPIMock {
  private listeners: { [key: string]: Function[] } = {};

  // Mock de postMessage que emula la comunicación con VSCode
  postMessage(message: any) {
    console.log("Mensaje enviado a VSCode:", message);

    // Si es un comando de refresh, actualizamos los datos después de un breve retardo
    if (message.command === "refresh") {
      setTimeout(() => {
        // Simular actualización de datos
        const updatedDailyData = { ...mockDailyData };
        updatedDailyData.totalHours += Math.random() * 2;

        const updatedWeeklyData = { ...mockWeeklyData };
        updatedWeeklyData.totalHours += Math.random() * 5;

        // Emitir evento message para simular respuesta de VSCode
        this.receiveMessage({
          data: {
            command: "update",
            dailyData: updatedDailyData,
            weeklyData: updatedWeeklyData,
          },
        });
      }, 500);
    }
  }

  // Simula recibir un mensaje de VSCode
  receiveMessage(event: any) {
    if (this.listeners["message"]) {
      this.listeners["message"].forEach((callback) => callback(event));
    }
  }

  // API para añadir event listeners
  addEventListener(type: string, callback: Function) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  // API para eliminar event listeners
  removeEventListener(type: string, callback: Function) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(
        (listener) => listener !== callback
      );
    }
  }

  // Inicializar los datos y establecer la comunicación
  init() {
    // Establecer datos iniciales en window
    window.dailyData = { ...mockDailyData };
    window.weeklyData = { ...mockWeeklyData };

    // Configurar el mock de vscode
    window.vscode = this;

    // Escuchar mensajes entrantes (simulados)
    window.addEventListener("message", (event) => {
      if (event.data.command === "update") {
        console.log("Actualizando datos...", event.data);
        window.dailyData = event.data.dailyData;
        window.weeklyData = event.data.weeklyData;
        // Forzar re-renderizado aquí si es necesario
      }
    });

    console.log("VSCode API Mock inicializado");
  }
}

export const vscodeAPI = new VSCodeAPIMock();
