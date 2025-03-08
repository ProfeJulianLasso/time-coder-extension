import { DailySummary, WeeklySummary } from "../types/interfaces";

export const mockDailyData: DailySummary = {
  totalHours: 8.5,
  byLanguage: [
    { language: "TypeScript", hours: 4.2 },
    { language: "JavaScript", hours: 2.8 },
    { language: "HTML/CSS", hours: 1.5 },
  ],
  byPlatform: [
    {
      platform: "Windows",
      machine: "Desktop",
      hours: 8.5,
      projects: [
        {
          project: "DevTimer",
          hours: 5.0,
          debug: { hours: 1.2 },
          branches: [
            { branch: "main", hours: 3.5, debug: { hours: 0.8 } },
            { branch: "feature/reports", hours: 1.5, debug: { hours: 0.4 } },
          ],
        },
        {
          project: "OtroProyecto",
          hours: 3.5,
          debug: { hours: 0.8 },
          branches: [{ branch: "develop", hours: 3.5, debug: { hours: 0.8 } }],
        },
      ],
    },
  ],
};

export const mockWeeklyData: WeeklySummary = {
  totalHours: 42.5,
  dailyHours: [
    { date: "2025-03-01", hours: 7.5 },
    { date: "2025-03-02", hours: 8.0 },
    { date: "2025-03-03", hours: 8.5 },
    { date: "2025-03-04", hours: 9.0 },
    { date: "2025-03-05", hours: 6.5 },
    { date: "2025-03-06", hours: 3.0 },
    { date: "2025-03-07", hours: 0.0 },
  ],
  byLanguage: [
    { language: "TypeScript", hours: 20.5 },
    { language: "JavaScript", hours: 12.0 },
    { language: "HTML/CSS", hours: 10.0 },
  ],
  byPlatform: [
    {
      platform: "Windows",
      machine: "Desktop",
      hours: 30.5,
      projects: [
        {
          project: "DevTimer",
          hours: 22.0,
          debug: { hours: 5.5 },
          branches: [
            { branch: "main", hours: 15.0, debug: { hours: 4.0 } },
            { branch: "feature/reports", hours: 7.0, debug: { hours: 1.5 } },
          ],
        },
        {
          project: "OtroProyecto",
          hours: 8.5,
          debug: { hours: 2.0 },
          branches: [{ branch: "develop", hours: 8.5, debug: { hours: 2.0 } }],
        },
      ],
    },
    {
      platform: "MacOS",
      machine: "Laptop",
      hours: 12.0,
      projects: [
        {
          project: "DevTimer",
          hours: 12.0,
          debug: { hours: 3.0 },
          branches: [{ branch: "main", hours: 12.0, debug: { hours: 3.0 } }],
        },
      ],
    },
  ],
};
