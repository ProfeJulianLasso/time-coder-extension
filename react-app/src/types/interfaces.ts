export interface DebugSummary {
  hours: number;
}

export interface LanguageSummary {
  language: string;
  hours: number;
}

export interface BranchSummary {
  branch: string;
  hours: number;
  debug: DebugSummary;
}

export interface PlatformSummary {
  platform: string;
  machine: string;
  hours: number;
  projects: ProjectSummary[];
}

export interface ProjectSummary {
  project: string;
  hours: number;
  debug: DebugSummary;
  branches: BranchSummary[];
}

export interface DailySummary {
  totalHours: number;
  byLanguage: LanguageSummary[];
  byPlatform: PlatformSummary[];
}

export interface DailyHoursSummary {
  date: string;
  hours: number;
}

export interface WeeklySummary {
  totalHours: number;
  dailyHours: DailyHoursSummary[];
  byLanguage: LanguageSummary[];
  byPlatform: PlatformSummary[];
}
