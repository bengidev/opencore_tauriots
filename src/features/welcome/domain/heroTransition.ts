import {
  HERO_MORPH_START,
  HERO_ROTATION_END,
  HERO_TRANSITION_MS,
} from "./welcomeConstants";
import {
  type WindowViewport,
  BRAND_SHELL_HEIGHT,
  cubeHeroCanvasSize,
  dockedCubeCenter,
  homeTransitionViewport,
  responsiveCubeHeroSize,
  welcomeCubeCenter,
  welcomeViewport,
} from "./heroLayout";

export interface HeroTransitionState {
  startedAt: number;
  startCenter: [number, number];
  startSize: number;
  endCenter: [number, number];
  endSize: number;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function startHeroTransition(
  now: number,
  viewport: WindowViewport = welcomeViewport(),
): HeroTransitionState {
  const heroSize = responsiveCubeHeroSize(viewport);
  return {
    startedAt: now,
    startCenter: welcomeCubeCenter(viewport),
    startSize: cubeHeroCanvasSize(heroSize),
    endCenter: dockedCubeCenter(homeTransitionViewport()),
    endSize: BRAND_SHELL_HEIGHT,
  };
}

export function linearProgress(state: HeroTransitionState, now: number): number {
  const elapsed = now - state.startedAt;
  if (HERO_TRANSITION_MS <= 0) return 1;
  return Math.min(1, Math.max(0, elapsed / HERO_TRANSITION_MS));
}

export function isHeroTransitionActive(
  state: HeroTransitionState,
  now: number,
): boolean {
  return linearProgress(state, now) < 1;
}

export function rotationProgress(transition: number): number {
  const raw = Math.min(1, Math.max(0, transition / HERO_ROTATION_END));
  return 1 - (1 - raw) ** 2;
}

export function morphProgress(transition: number): number {
  const span = Math.max(0.001, 1 - HERO_MORPH_START);
  const raw = Math.min(1, Math.max(0, (transition - HERO_MORPH_START) / span));
  return 1 - (1 - raw) ** 3;
}

export function rotationAt(state: HeroTransitionState, now: number): number {
  return rotationProgress(linearProgress(state, now));
}

export function layoutAt(
  state: HeroTransitionState,
  now: number,
): { centerX: number; centerY: number; size: number } {
  const transition = linearProgress(state, now);
  const morph = morphProgress(transition);
  return {
    centerX: lerp(state.startCenter[0], state.endCenter[0], morph),
    centerY: lerp(state.startCenter[1], state.endCenter[1], morph),
    size: lerp(state.startSize, state.endSize, morph),
  };
}

export function welcomeContentOpacity(transition: number): number {
  return Math.max(0, 1 - Math.min(1, transition / 0.35));
}

export function shellBrandOpacity(transition: number): number {
  if (transition >= 1) return 1;
  return Math.min(1, Math.max(0, (transition - 0.72) / 0.28));
}
