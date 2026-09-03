import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyThemeToDocument,
  nextThemeMode,
  type ThemeMode,
} from "../domain/welcomeTheme";
import { savePreferences } from "../infrastructure/welcomePreferencesApi";
import type { AppPreferences } from "../infrastructure/welcomePreferencesTypes";

interface WelcomeContextValue {
  themeMode: ThemeMode;
  preferences: AppPreferences;
  persistenceError: string | null;
  toggleTheme: () => Promise<void>;
  setPreferences: (preferences: AppPreferences) => void;
  setPersistenceError: (message: string | null) => void;
}

const WelcomeContext = createContext<WelcomeContextValue | null>(null);

export function WelcomeProvider({
  initialPreferences,
  children,
}: {
  initialPreferences: AppPreferences;
  children: ReactNode;
}) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);

  const toggleTheme = useCallback(async () => {
    const previousMode = preferences.theme_mode;
    const nextMode = nextThemeMode(previousMode);
    const updated: AppPreferences = { ...preferences, theme_mode: nextMode };
    const rollback: AppPreferences = { ...preferences, theme_mode: previousMode };

    applyThemeToDocument(nextMode);
    setPreferences(updated);

    try {
      await savePreferences(updated);
      setPersistenceError(null);
    } catch (error) {
      applyThemeToDocument(previousMode);
      setPreferences(rollback);
      setPersistenceError(
        error instanceof Error ? error.message : "Failed to save theme",
      );
    }
  }, [preferences]);

  const value = useMemo(
    () => ({
      themeMode: preferences.theme_mode,
      preferences,
      persistenceError,
      toggleTheme,
      setPreferences,
      setPersistenceError,
    }),
    [preferences, persistenceError, toggleTheme],
  );

  return (
    <WelcomeContext.Provider value={value}>{children}</WelcomeContext.Provider>
  );
}

export function useWelcome(): WelcomeContextValue {
  const context = useContext(WelcomeContext);
  if (!context) {
    throw new Error("useWelcome must be used within WelcomeProvider");
  }
  return context;
}
