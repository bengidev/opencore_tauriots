import { invoke } from "@tauri-apps/api/core";
import { clearHomeLayoutPersistence } from "../../home/domain/homeLayoutConstants";
import {
  DEFAULT_PREFERENCES,
  MEMORY_PREFERENCES_KEY,
  type AppPreferences,
} from "./welcomePreferencesTypes";
import { applyThemeToDocument } from "../../../shared/theme/theme";

export async function resetAllPersistedData(): Promise<AppPreferences> {
  const defaults: AppPreferences = { ...DEFAULT_PREFERENCES };

  clearHomeLayoutPersistence();

  if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
    try {
      const restored = await invoke<AppPreferences>("reset_preferences");
      applyThemeToDocument(restored.theme_mode);
      localStorage.removeItem(MEMORY_PREFERENCES_KEY);
      return restored;
    } catch {
      // fall through
    }
  }

  localStorage.removeItem(MEMORY_PREFERENCES_KEY);
  applyThemeToDocument(defaults.theme_mode);

  return defaults;
}
