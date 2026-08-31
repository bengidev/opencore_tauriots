import {
  layoutAt,
  rotationAt,
  type HeroTransitionState,
} from "../domain/heroTransition";
import type { ThemeMode } from "../domain/welcomeTheme";
import { WelcomeCubeHeroCanvas } from "./WelcomeCubeHeroCanvas";

export function HeroTransitionOverlay({
  transition,
  now,
  mode,
}: {
  transition: HeroTransitionState;
  now: number;
  mode: ThemeMode;
}) {
  const { centerX, centerY, size } = layoutAt(transition, now);
  const rotationProgress = rotationAt(transition, now);

  return (
    <div className="welcome-hero-overlay" aria-hidden="true">
      <div
        className="welcome-hero-overlay-cube"
        style={{
          left: centerX - size * 0.5,
          top: centerY - size * 0.5,
          width: size,
          height: size,
        }}
      >
        <WelcomeCubeHeroCanvas
          mode={mode}
          rotationProgress={rotationProgress}
          animate={true}
        />
      </div>
    </div>
  );
}
