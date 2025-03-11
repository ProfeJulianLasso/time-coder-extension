import { computed, signal } from "@preact/signals-react";
import {
  DailySummary,
  LanguageSummary,
  WeeklySummary,
} from "../types/interfaces";
import { formatDuration } from "../utils/time";

// Valores iniciales
const initialDailyData: DailySummary = {
  totalDurationInSeconds: 0,
  byLanguage: [],
  byPlatform: [],
};

const initialWeeklyData: WeeklySummary = {
  totalDurationInSeconds: 0,
  dailyDurationInSeconds: [],
  byLanguage: [],
  byPlatform: [],
};

// Signals principales
export const dailyDataSignal = signal<DailySummary>(
  window.dailyData ?? initialDailyData
);

export const weeklyDataSignal = signal<WeeklySummary>(
  window.weeklyData ?? initialWeeklyData
);

// Función auxiliar para obtener el lenguaje más usado
const getTopLanguage = (languages: LanguageSummary[]): string => {
  if (languages.length === 0) return "N/A";

  const topLanguage = languages.reduce(
    (max, current) =>
      current.durationInSeconds > max.durationInSeconds ? current : max,
    languages[0]
  );

  return topLanguage.language;
};

// Valores computados para Daily
export const totalDailyTimeSignal = computed(() =>
  formatDuration(dailyDataSignal.value.totalDurationInSeconds)
);

export const topDailyLanguageSignal = computed(() =>
  getTopLanguage(dailyDataSignal.value.byLanguage)
);

// Valores computados para Weekly
export const totalWeeklyTimeSignal = computed(() =>
  formatDuration(weeklyDataSignal.value.totalDurationInSeconds)
);

export const topWeeklyLanguageSignal = computed(() =>
  getTopLanguage(weeklyDataSignal.value.byLanguage)
);

// Función auxiliar para actualizar datos desde la extensión
export const updateSignalsFromExtension = (
  newDailyData: DailySummary,
  newWeeklyData: WeeklySummary
) => {
  dailyDataSignal.value = newDailyData;
  weeklyDataSignal.value = newWeeklyData;
};
