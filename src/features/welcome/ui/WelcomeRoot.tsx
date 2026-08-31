import { useCallback, useEffect, useState } from "react";
import {
  isHeroTransitionActive,
  linearProgress,
  shellBrandOpacity,
  startHeroTransition,
  welcomeContentOpacity,
  type HeroTransitionState,
} from "../domain/heroTransition";
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
import { HeroTransitionOverlay } from "./HeroTransitionOverlay";
import { HomePlaceholder } from "./HomePlaceholder";
import { WelcomeScreen } from "./WelcomeScreen";

type ActiveScreen = "welcome" | "home";

function bootScreen(preferences: AppPreferences): ActiveScreen {
  return preferences.onboarding_completed ? "home" : "welcome";
}

function WelcomeApp() {
  const { preferences, setPreferences, themeMode } = useWelcome();
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(() =>
    bootScreen(preferences),
  );
  const [heroTransition, setHeroTransition] =
    useState<HeroTransitionState | null>(null);
  const [transitionNow, setTransitionNow] = useState(() => performance.now());

  useEffect(() => {
    if (!heroTransition) return;
    let frame = 0;
    const tick = () => {
      const now = performance.now();
      setTransitionNow(now);
      if (isHeroTransitionActive(heroTransition, now)) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setHeroTransition(null);
        setActiveScreen("home");
      }
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [heroTransition]);

  const beginHeroTransition = useCallback(async () => {
    const updated: AppPreferences = {
      ...preferences,
      onboarding_completed: true,
    };
    try {
      await savePreferences(updated);
      setPreferences(updated);
      await applyHomeWindowSize();
      setHeroTransition(startHeroTransition(performance.now()));
    } catch (error) {
      console.error("persist welcome completion", error);
    }
  }, [preferences, setPreferences]);

  const handleEnter = useCallback(() => {
    const outcome = reduceWelcome({ type: "enter_pressed" });
    if (outcome === "completed") {
      beginHeroTransition();
    }
  }, [beginHeroTransition]);

  const handleReset = useCallback(async () => {
    const defaults = await resetAllPersistedData();
    setPreferences(defaults);
    setHeroTransition(null);
    setActiveScreen("welcome");
    await applyWelcomeWindowSize();
  }, [setPreferences]);

  const transitionProgress = heroTransition
    ? linearProgress(heroTransition, transitionNow)
    : 0;
  const welcomeOpacity = heroTransition
    ? welcomeContentOpacity(transitionProgress)
    : 1;
  const shellOpacity = heroTransition
    ? shellBrandOpacity(transitionProgress)
    : 1;

  if (activeScreen === "home" && !heroTransition) {
    return (
      <div className="welcome-root">
        <HomePlaceholder mode={themeMode} />
        {import.meta.env.DEV ? (
          <DevResetFab mode={themeMode} onReset={handleReset} />
        ) : null}
      </div>
    );
  }

  return (
    <div className="welcome-root">
      {activeScreen === "home" && heroTransition ? (
        <HomePlaceholder mode={themeMode} brandOpacity={shellOpacity} />
      ) : null}
      <WelcomeScreen contentOpacity={welcomeOpacity} onEnter={handleEnter} />
      {heroTransition ? (
        <HeroTransitionOverlay
          transition={heroTransition}
          now={transitionNow}
          mode={themeMode}
        />
      ) : null}
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
      const screen = bootScreen(preferences);
      if (screen === "welcome") {
        await applyWelcomeWindowSize();
      } else {
        await applyHomeWindowSize();
      }
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
