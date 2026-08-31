import { useCallback, useEffect, useRef, useState } from "react";
import {
  cubeHeroCanvasSize,
  responsiveCubeHeroSize,
} from "../domain/heroLayout";
import { useWindowViewport } from "../infrastructure/welcomeViewport";
import { type ThemeMode } from "../domain/welcomeTheme";
import { useWelcome } from "../state/welcomeContext";
import { WelcomeEnterButton, WelcomeThemeToggle } from "./WelcomeControls";
import { WelcomeCubeHeroCanvas } from "./WelcomeCubeHeroCanvas";

export interface WelcomeScreenProps {
  contentOpacity?: number;
  onEnter: () => void;
}

function isInteractiveKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.closest("button, input, textarea, select, a[href], [role='button']") !==
    null
  );
}

export function WelcomeScreen({
  contentOpacity = 1,
  onEnter,
}: WelcomeScreenProps) {
  const { themeMode, persistenceError, toggleTheme } = useWelcome();
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    onEnter();
  }, [onEnter]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    rootRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.repeat || event.isComposing) return;
      if (event.metaKey || event.ctrlKey) return;
      if (isInteractiveKeyboardTarget(event.target)) return;
      handleEnter();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleEnter]);

  const viewport = useWindowViewport();
  const heroSize = responsiveCubeHeroSize(viewport);
  const canvasSize = cubeHeroCanvasSize(heroSize);
  const mode = themeMode as ThemeMode;

  return (
    <div
      ref={rootRef}
      className="welcome-screen welcome-theme-surface"
      data-ready={ready ? "true" : "false"}
      tabIndex={-1}
      style={{ opacity: contentOpacity }}
    >
      <div className="welcome-grid">
        <header
          className="welcome-header welcome-theme-content welcome-enter welcome-enter-1"
        >
          <div className="welcome-header-copy">
            <span className="welcome-title-mark">OpenCore</span>
            <span className="welcome-label">LOCAL AI WORKSPACE</span>
          </div>
          <WelcomeThemeToggle mode={mode} onToggle={() => toggleTheme()} />
        </header>

        <section
          className="welcome-hero-section welcome-theme-content welcome-enter welcome-enter-2"
        >
          <div
            className="welcome-hero-wrap"
            style={{ width: canvasSize, height: canvasSize }}
          >
            <WelcomeCubeHeroCanvas
              mode={mode}
              size={canvasSize}
              className="welcome-cube-hero-stage"
            />
          </div>
          <div className="welcome-copy-block">
            <h1 className="welcome-headline">
              Your local AI command workspace
            </h1>
            <p className="welcome-body">
              OpenCore combines chat, terminal, editing, and Rust-native
              performance in one permissioned desktop environment. To leave the
              crowded cloud, polluted by leaks and unconsciousness, to return to
              a workspace that stays on your machine.
            </p>
          </div>
        </section>

        <footer
          className="welcome-footer welcome-theme-content welcome-enter welcome-enter-3"
        >
          {persistenceError ? (
            <span className="welcome-persistence-error">{persistenceError}</span>
          ) : (
            <span className="welcome-label">Press Enter</span>
          )}
          <WelcomeEnterButton mode={mode} onClick={handleEnter} />
        </footer>
      </div>
    </div>
  );
}
