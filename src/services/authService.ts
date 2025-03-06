import * as vscode from "vscode";

/**
 * Registra un nuevo usuario en el sistema
 * @param email Correo electrónico del usuario
 * @param password Contraseña del usuario
 * @returns Respuesta con la API Key generada
 */
export async function registerUser(
  email: string,
  password: string
): Promise<{ apiKey: string }> {
  const config = vscode.workspace.getConfiguration("devtimer");
  const apiUrl = config.get<string>("apiUrl");

  try {
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({ message: "Error de servidor" }))) as {
        message?: string;
      };
      throw new Error(
        errorData.message ?? `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = (await response.json()) as { apiKey: string };
    return { apiKey: data.apiKey };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error al registrar el usuario");
  }
}

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
