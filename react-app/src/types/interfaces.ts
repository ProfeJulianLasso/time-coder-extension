export interface DebugSummary {
  durationInSeconds: number;
}

export interface LanguageSummary {
  language: string;
  durationInSeconds: number;
}

export interface BranchSummary {
  branch: string;
  durationInSeconds: number;
  debug: DebugSummary;
}

export interface PlatformSummary {
  platform: string;
  machine: string;
  durationInSeconds: number;
  projects: ProjectSummary[];
}

export interface ProjectSummary {
  project: string;
  durationInSeconds: number;
  debug: DebugSummary;
  branches: BranchSummary[];
}

export interface DailySummary {
  totalDurationInSeconds: number;
  byLanguage: LanguageSummary[];
  byPlatform: PlatformSummary[];
}

export interface DailyHoursSummary {
  date: string;
  durationInSeconds: number;
}

export interface WeeklySummary {
  totalDurationInSeconds: number;
  dailyDurationInSeconds: DailyHoursSummary[];
  byLanguage: LanguageSummary[];
  byPlatform: PlatformSummary[];
}
