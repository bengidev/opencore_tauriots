export type ThemeMode = "light" | "dark";

export interface AppPreferences {
  theme_mode: ThemeMode;
  onboarding_completed: boolean;
}

export const DEFAULT_PREFERENCES: AppPreferences = {
  theme_mode: "light",
  onboarding_completed: false,
};

export const MEMORY_PREFERENCES_KEY = "opencore-tauriots-preferences";
