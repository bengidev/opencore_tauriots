import { invoke } from "@tauri-apps/api/core";
import {
  DEFAULT_PREFERENCES,
  MEMORY_PREFERENCES_KEY,
  type AppPreferences,
} from "./welcomePreferencesTypes";

function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function readMemoryPreferences(): AppPreferences {
  try {
    const raw = localStorage.getItem(MEMORY_PREFERENCES_KEY);
    if (!raw) return { ...DEFAULT_PREFERENCES };
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } as AppPreferences;
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

function writeMemoryPreferences(preferences: AppPreferences): void {
  localStorage.setItem(MEMORY_PREFERENCES_KEY, JSON.stringify(preferences));
}

export async function loadPreferences(): Promise<AppPreferences> {
  if (!isTauri()) {
    return readMemoryPreferences();
  }
  try {
    return await invoke<AppPreferences>("load_preferences");
  } catch {
    return readMemoryPreferences();
  }
}

export async function savePreferences(
  preferences: AppPreferences,
): Promise<void> {
  if (!isTauri()) {
    writeMemoryPreferences(preferences);
    return;
  }
  try {
    await invoke("save_preferences", { preferences });
  } catch {
    writeMemoryPreferences(preferences);
  }
}
