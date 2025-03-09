import { DailySummary, WeeklySummary } from "../../src/types/interfaces";

export const mockDailyData: DailySummary = {
  totalDurationInSeconds: 28800, // 8 horas en segundos
  byLanguage: [
    { language: "TypeScript", durationInSeconds: 14400 }, // 4 horas
    { language: "JavaScript", durationInSeconds: 10800 }, // 3 horas
    { language: "HTML", durationInSeconds: 2160 }, // 36 minutos
    { language: "CSS", durationInSeconds: 1440 }, // 24 minutos
  ],
  byPlatform: [
    {
      platform: "Windows",
      machine: "Desktop",
      durationInSeconds: 28800, // 8 horas
      projects: [
        {
          project: "DevTimer",
          durationInSeconds: 18000, // 5 horas
          debug: { durationInSeconds: 3600 }, // 1 hora
          branches: [
            {
              branch: "main",
              durationInSeconds: 10800, // 3 horas
              debug: { durationInSeconds: 1800 }, // 30 minutos
            },
            {
              branch: "feature/reports",
              durationInSeconds: 7200, // 2 horas
              debug: { durationInSeconds: 1800 }, // 30 minutos
            },
          ],
        },
        {
          project: "OtroProyecto",
          durationInSeconds: 10800, // 3 horas
          debug: { durationInSeconds: 2700 }, // 45 minutos
          branches: [
            {
              branch: "develop",
              durationInSeconds: 10800, // 3 horas
              debug: { durationInSeconds: 2700 }, // 45 minutos
            },
          ],
        },
      ],
    },
  ],
};

export const mockWeeklyData: WeeklySummary = {
  totalDurationInSeconds: 144000, // 40 horas en segundos
  dailyDurationInSeconds: [
    { date: "2025-03-03", durationInSeconds: 14400 }, // 4 horas
    { date: "2025-03-04", durationInSeconds: 18000 }, // 5 horas
    { date: "2025-03-05", durationInSeconds: 28800 }, // 8 horas
    { date: "2025-03-06", durationInSeconds: 32400 }, // 9 horas
    { date: "2025-03-07", durationInSeconds: 25200 }, // 7 horas
    { date: "2025-03-08", durationInSeconds: 25200 }, // 7 horas
    { date: "2025-03-09", durationInSeconds: 0 }, // 0 horas
  ],
  byLanguage: [
    { language: "TypeScript", durationInSeconds: 72000 }, // 20 horas
    { language: "JavaScript", durationInSeconds: 43200 }, // 12 horas
    { language: "HTML", durationInSeconds: 17280 }, // 4.8 horas
    { language: "CSS", durationInSeconds: 11520 }, // 3.2 horas
  ],
  byPlatform: [
    {
      platform: "Windows",
      machine: "Desktop",
      durationInSeconds: 108000, // 30 horas
      projects: [
        {
          project: "DevTimer",
          durationInSeconds: 54000, // 15 horas
          debug: { durationInSeconds: 10800 }, // 3 horas
          branches: [
            {
              branch: "main",
              durationInSeconds: 21600, // 6 horas
              debug: { durationInSeconds: 3600 }, // 1 hora
            },
            {
              branch: "feature/reports",
              durationInSeconds: 32400, // 9 horas
              debug: { durationInSeconds: 7200 }, // 2 horas
            },
          ],
        },
        {
          project: "OtroProyecto",
          durationInSeconds: 54000, // 15 horas
          debug: { durationInSeconds: 10800 }, // 3 horas
          branches: [
            {
              branch: "develop",
              durationInSeconds: 54000, // 15 horas
              debug: { durationInSeconds: 10800 }, // 3 horas
            },
          ],
        },
      ],
    },
    {
      platform: "MacOS",
      machine: "Laptop",
      durationInSeconds: 36000, // 10 horas
      projects: [
        {
          project: "DevTimer",
          durationInSeconds: 36000, // 10 horas
          debug: { durationInSeconds: 7200 }, // 2 horas
          branches: [
            {
              branch: "main",
              durationInSeconds: 36000, // 10 horas
              debug: { durationInSeconds: 7200 }, // 2 horas
            },
          ],
        },
      ],
    },
  ],
};
