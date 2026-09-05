import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppTitle,
  Body,
  Button,
  Caption,
  Display,
  StatusText,
  Surface,
  ThemeToggleButton,
} from "../../../shared/ui";
import {
  cubeHeroCanvasSize,
  isMacOverlayTitleBar,
  macOverlayContentTopInset,
  responsiveCubeHeroSize,
} from "../domain/heroLayout";
import { useWindowViewport } from "../infrastructure/welcomeViewport";
import { type ThemeMode } from "../../../shared/theme/theme";
import { useWelcome } from "../state/welcomeContext";
import { WelcomeCubeHeroCanvas } from "./WelcomeCubeHeroCanvas";

export interface WelcomeScreenProps {
  onEnter: () => void;
}

function isInteractiveKeyboardTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.closest("button, input, textarea, select, a[href], [role='button']") !==
    null
  );
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const { themeMode, persistenceError } = useWelcome();
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    onEnter();
  }, [onEnter]);

  useEffect(() => {
    let outer = 0;
    let inner = 0;
    outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setReady(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
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
  const macOverlay = isMacOverlayTitleBar();

  return (
    <Surface
      className="welcome-screen"
      data-ready={ready ? "true" : "false"}
      data-mac-overlay={macOverlay ? "true" : undefined}
      style={
        macOverlay
          ? ({
              "--mac-content-top": `${macOverlayContentTopInset()}px`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div ref={rootRef} className="welcome-grid" tabIndex={-1}>
        <header className="welcome-header welcome-enter welcome-enter-1">
          <AppTitle title="OpenCore" subtitle="LOCAL AI WORKSPACE" dragRegion />
          <ThemeToggleButton showLabel />
        </header>

        <section className="welcome-hero-section">
          <div
            className="welcome-hero-wrap welcome-enter welcome-enter-2"
            style={{ width: canvasSize, height: canvasSize }}
          >
            <WelcomeCubeHeroCanvas
              mode={mode}
              size={canvasSize}
              className="welcome-cube-hero-stage"
            />
          </div>
          <div className="welcome-copy-block">
            <Display className="welcome-enter welcome-enter-3">
              Your local <span className="ds-accent-text">AI</span> command
              workspace
            </Display>
            <Body className="welcome-enter welcome-enter-4">
              OpenCore combines chat, terminal, editing, and Rust-native
              performance in one permissioned desktop environment. To leave the
              crowded cloud, polluted by leaks and unconsciousness, to return to
              a workspace that stays on your machine.
            </Body>
          </div>
        </section>

        <footer className="welcome-footer">
          {persistenceError ? (
            <StatusText variant="error" className="welcome-enter welcome-enter-5">
              {persistenceError}
            </StatusText>
          ) : (
            <Caption className="welcome-enter welcome-enter-5">Press Enter</Caption>
          )}
          <Button
            variant="primary"
            className="welcome-enter welcome-enter-6"
            onClick={handleEnter}
          >
            Enter OpenCore
          </Button>
        </footer>
      </div>
    </Surface>
  );
}
