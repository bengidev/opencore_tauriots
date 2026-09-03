import { useCallback, useEffect, useState } from "react";
import { reduceWelcome } from "../domain/welcomeReducer";
import { applyThemeToDocument } from "../domain/welcomeTheme";
import {
  loadPreferences,
  savePreferences,
} from "../infrastructure/welcomePreferencesApi";
import type { AppPreferences } from "../infrastructure/welcomePreferencesTypes";
import { resetAllPersistedData } from "../infrastructure/welcomeReset";
import {
  applyHomeWindowSize,
  applyWelcomeWindowSize,
} from "../infrastructure/welcomeWindowController";
import { WelcomeProvider, useWelcome } from "../state/welcomeContext";
import { DevResetFab } from "./DevResetFab";
import { HomePlaceholder } from "./HomePlaceholder";
import { WelcomeScreen } from "./WelcomeScreen";

type ActiveScreen = "welcome" | "home";

function bootScreen(preferences: AppPreferences): ActiveScreen {
  return preferences.onboarding_completed ? "home" : "welcome";
}

function WelcomeApp() {
  const { preferences, setPreferences, setPersistenceError, themeMode } =
    useWelcome();
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(() =>
    bootScreen(preferences),
  );

  const completeWelcome = useCallback(async () => {
    const updated: AppPreferences = {
      ...preferences,
      onboarding_completed: true,
    };
    try {
      await savePreferences(updated);
      setPersistenceError(null);
      setPreferences(updated);
      await applyHomeWindowSize();
      setActiveScreen("home");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save preferences";
      setPersistenceError(message);
      console.error("persist welcome completion", error);
    }
  }, [preferences, setPersistenceError, setPreferences]);

  const handleEnter = useCallback(() => {
    const outcome = reduceWelcome({ type: "enter_pressed" });
    if (outcome === "completed") {
      completeWelcome();
    }
  }, [completeWelcome]);

  const handleReset = useCallback(async () => {
    const defaults = await resetAllPersistedData();
    setPreferences(defaults);
    setPersistenceError(null);
    setActiveScreen("welcome");
    await applyWelcomeWindowSize();
  }, [setPersistenceError, setPreferences]);

  return (
    <div className="welcome-root">
      {activeScreen === "home" ? (
        <HomePlaceholder />
      ) : (
        <WelcomeScreen onEnter={handleEnter} />
      )}
      {import.meta.env.DEV ? (
        <DevResetFab mode={themeMode} onReset={handleReset} />
      ) : null}
    </div>
  );
}

export function WelcomeRoot() {
  const [initialPreferences, setInitialPreferences] =
    useState<AppPreferences | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const preferences = await loadPreferences();
      if (cancelled) return;
      applyThemeToDocument(preferences.theme_mode);
      setInitialPreferences(preferences);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!initialPreferences) {
    return (
      <div className="welcome-boot-placeholder" aria-busy="true">
        Loading…
      </div>
    );
  }

  return (
    <WelcomeProvider initialPreferences={initialPreferences}>
      <WelcomeApp />
    </WelcomeProvider>
  );
}
