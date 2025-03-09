/**
 * Convierte una duración en segundos a formato legible "Xh Ym"
 * @param seconds - Número de segundos a convertir
 * @returns Cadena formateada en formato "Xh Ym"
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds && seconds !== 0) {
    return "0h 0m";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
};

/**
 * Calcula el porcentaje que representa una parte del total
 * @param part - Valor parcial
 * @param total - Valor total
 * @returns Porcentaje redondeado
 */
export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
};

/**
 * Obtiene un color en formato HSL basado en un índice
 * @param index - Posición en la lista
 * @param total - Total de elementos
 * @returns Color en formato HSL
 */
export const getColorByIndex = (index: number, total: number): string => {
  const baseHue = 210;
  const saturation = 80 - (index / Math.max(1, total)) * 40; // 80% a 40%
  const lightness = 45 + (index / Math.max(1, total)) * 25; // 45% a 70%

  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};
