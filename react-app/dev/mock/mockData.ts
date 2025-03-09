import { DailySummary, WeeklySummary } from "../../src/types/interfaces";

export const mockDailyData: DailySummary = {
  totalDurationInSeconds: 8.5,
  byLanguage: [
    { language: "TypeScript", durationInSeconds: 4.2 },
    { language: "JavaScript", durationInSeconds: 2.8 },
    { language: "HTML/CSS", durationInSeconds: 1.5 },
  ],
  byPlatform: [
    {
      platform: "Windows",
      machine: "Desktop",
      durationInSeconds: 8.5,
      projects: [
        {
          project: "DevTimer",
          durationInSeconds: 5.0,
          debug: { durationInSeconds: 1.2 },
          branches: [
            {
              branch: "main",
              durationInSeconds: 3.5,
              debug: { durationInSeconds: 0.8 },
            },
            {
              branch: "feature/reports",
              durationInSeconds: 1.5,
              debug: { durationInSeconds: 0.4 },
            },
          ],
        },
        {
          project: "OtroProyecto",
          durationInSeconds: 3.5,
          debug: { durationInSeconds: 0.8 },
          branches: [
            {
              branch: "develop",
              durationInSeconds: 3.5,
              debug: { durationInSeconds: 0.8 },
            },
          ],
        },
      ],
    },
  ],
};

export const mockWeeklyData: WeeklySummary = {
  totalDurationInSeconds: 42.5,
  dailyDurationInSeconds: [
    { date: "2025-03-01", durationInSeconds: 7.5 },
    { date: "2025-03-02", durationInSeconds: 8.0 },
    { date: "2025-03-03", durationInSeconds: 8.5 },
    { date: "2025-03-04", durationInSeconds: 9.0 },
    { date: "2025-03-05", durationInSeconds: 6.5 },
    { date: "2025-03-06", durationInSeconds: 3.0 },
    { date: "2025-03-07", durationInSeconds: 0.0 },
  ],
  byLanguage: [
    { language: "TypeScript", durationInSeconds: 20.5 },
    { language: "JavaScript", durationInSeconds: 12.0 },
    { language: "HTML/CSS", durationInSeconds: 10.0 },
  ],
  byPlatform: [
    {
      platform: "Windows",
      machine: "Desktop",
      durationInSeconds: 30.5,
      projects: [
        {
          project: "DevTimer",
          durationInSeconds: 22.0,
          debug: { durationInSeconds: 5.5 },
          branches: [
            {
              branch: "main",
              durationInSeconds: 15.0,
              debug: { durationInSeconds: 4.0 },
            },
            {
              branch: "feature/reports",
              durationInSeconds: 7.0,
              debug: { durationInSeconds: 1.5 },
            },
          ],
        },
        {
          project: "OtroProyecto",
          durationInSeconds: 8.5,
          debug: { durationInSeconds: 2.0 },
          branches: [
            {
              branch: "develop",
              durationInSeconds: 8.5,
              debug: { durationInSeconds: 2.0 },
            },
          ],
        },
      ],
    },
    {
      platform: "MacOS",
      machine: "Laptop",
      durationInSeconds: 12.0,
      projects: [
        {
          project: "DevTimer",
          durationInSeconds: 12.0,
          debug: { durationInSeconds: 3.0 },
          branches: [
            {
              branch: "main",
              durationInSeconds: 12.0,
              debug: { durationInSeconds: 3.0 },
            },
          ],
        },
      ],
    },
  ],
};
