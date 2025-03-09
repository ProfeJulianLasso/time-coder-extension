import { computed, signal } from "@preact/signals-react";
import { DailySummary, WeeklySummary } from "../types/interfaces";
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

// Valores computados para Daily
export const totalDailyTimeSignal = computed(() =>
  formatDuration(dailyDataSignal.value.totalDurationInSeconds)
);

export const topDailyLanguageSignal = computed(() => {
  const languages = dailyDataSignal.value.byLanguage;
  return languages.length > 0 ? languages[0]?.language : "N/A";
});

// Valores computados para Weekly
export const totalWeeklyTimeSignal = computed(() =>
  formatDuration(weeklyDataSignal.value.totalDurationInSeconds)
);

export const topWeeklyLanguageSignal = computed(() => {
  const languages = weeklyDataSignal.value.byLanguage;
  return languages.length > 0 ? languages[0]?.language : "N/A";
});

// Función auxiliar para actualizar datos desde la extensión
export const updateSignalsFromExtension = (
  newDailyData: DailySummary,
  newWeeklyData: WeeklySummary
) => {
  dailyDataSignal.value = newDailyData;
  weeklyDataSignal.value = newWeeklyData;
};
