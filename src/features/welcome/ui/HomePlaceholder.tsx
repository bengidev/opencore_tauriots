import { TITLE_BAR_HEIGHT } from "../domain/heroLayout";
import { createDockedCubeHeroState } from "../domain/cubeHeroState";
import { type ThemeMode } from "../domain/welcomeTheme";
import { WelcomeCubeHeroCanvas } from "./WelcomeCubeHeroCanvas";

export function HomePlaceholder({
  mode,
  brandOpacity = 1,
}: {
  mode: ThemeMode;
  brandOpacity?: number;
}) {
  return (
    <div className="welcome-home-placeholder welcome-theme-surface">
      <header className="welcome-home-titlebar welcome-theme-content">
        <div
          className="welcome-home-brand-slot"
          style={{ height: TITLE_BAR_HEIGHT, opacity: brandOpacity }}
        >
          <WelcomeCubeHeroCanvas
            mode={mode}
            size={18}
            animate={false}
            rotationProgress={1}
            initialState={createDockedCubeHeroState()}
          />
        </div>
      </header>
      <main className="welcome-home-body">
        <p className="welcome-home-message">
          Workspace shell will live here. Welcome complete.
        </p>
      </main>
    </div>
  );
}
