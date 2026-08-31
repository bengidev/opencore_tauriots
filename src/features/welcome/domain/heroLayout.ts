import { CUBE_HERO_EDGE_INSET } from "./cubeHeroConstants";
import {
  BRAND_ASPECT,
  HOME_WINDOW_SIZE,
  WELCOME_WINDOW_SIZE,
} from "./welcomeConstants";

export interface WindowViewport {
  width: number;
  height: number;
}

export const BRAND_HERO_MIN = 220;
export const BRAND_HERO_MAX = 320;
export const BRAND_SHELL_HEIGHT = 18;
export const TITLE_BAR_HEIGHT = 38;

const WELCOME_EDGE_INSET_H = 16;
const WELCOME_HEADER_BAND = 46;
/** Footer row (enter button + padding + border). */
const WELCOME_FOOTER_BAND = 96;
/** Headline, body copy, and gaps below the hero cube. */
const WELCOME_COPY_BAND = 188;
const WELCOME_ACTION_BAND = WELCOME_FOOTER_BAND + WELCOME_COPY_BAND;

export function cubeHeroCanvasSize(heroSize: number): number {
  return heroSize + CUBE_HERO_EDGE_INSET * 2;
}
const SHELL_TOGGLE_WIDTH = 28;
const SHELL_TITLE_GAP = 4;

export function titleBarLeftPadding(): number {
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac/i.test(navigator.platform || navigator.userAgent);
  return isMac ? 80 : 12;
}

export function brandWidth(height: number): number {
  return height * BRAND_ASPECT;
}

export function responsiveHeroSize(
  availableWidth: number,
  availableHeight: number,
): number {
  const canvasInset = CUBE_HERO_EDGE_INSET * 2;
  const widthLimit = Math.max(
    availableWidth - WELCOME_EDGE_INSET_H * 2 - canvasInset,
    BRAND_HERO_MIN,
  );
  const heightLimit = Math.max(
    availableHeight - WELCOME_ACTION_BAND - canvasInset,
    BRAND_HERO_MIN,
  );
  return Math.min(widthLimit, heightLimit, BRAND_HERO_MAX);
}

export function responsiveCubeHeroSize(viewport: WindowViewport): number {
  return responsiveHeroSize(viewport.width, viewport.height);
}

export function welcomeCubeCenter(viewport: WindowViewport): [number, number] {
  const heroSize = responsiveCubeHeroSize(viewport);
  const contentTop = WELCOME_HEADER_BAND;
  const contentHeight = Math.max(
    viewport.height - contentTop - WELCOME_ACTION_BAND,
    heroSize,
  );
  const centerY = contentTop + contentHeight * 0.5;
  return [viewport.width * 0.5, centerY];
}

export function dockedCubeCenter(viewport: WindowViewport): [number, number] {
  const x =
    titleBarLeftPadding() +
    SHELL_TOGGLE_WIDTH +
    SHELL_TITLE_GAP +
    BRAND_SHELL_HEIGHT * 0.5;
  const y = TITLE_BAR_HEIGHT * 0.5;
  void viewport;
  return [x, y];
}

export function responsiveBrandHeight(viewport: WindowViewport): number {
  const squareLimit = responsiveHeroSize(viewport.width, viewport.height);
  const widthLimit =
    (viewport.width - WELCOME_EDGE_INSET_H * 2) / BRAND_ASPECT;
  return Math.min(squareLimit, widthLimit, BRAND_HERO_MAX / BRAND_ASPECT);
}

export function welcomeBrandCenter(viewport: WindowViewport): [number, number] {
  const heroHeight = responsiveBrandHeight(viewport);
  const contentTop = WELCOME_HEADER_BAND;
  const contentHeight = Math.max(
    viewport.height - contentTop - WELCOME_ACTION_BAND,
    heroHeight,
  );
  const centerY = contentTop + contentHeight * 0.5;
  return [viewport.width * 0.5, centerY];
}

export function dockedBrandCenter(viewport: WindowViewport): [number, number] {
  const width = brandWidth(BRAND_SHELL_HEIGHT);
  const x =
    titleBarLeftPadding() + SHELL_TOGGLE_WIDTH + SHELL_TITLE_GAP + width * 0.5;
  const y = TITLE_BAR_HEIGHT * 0.5;
  void viewport;
  return [x, y];
}

export function welcomeViewport(): WindowViewport {
  return {
    width: WELCOME_WINDOW_SIZE.width,
    height: WELCOME_WINDOW_SIZE.height,
  };
}

export function homeTransitionViewport(): WindowViewport {
  return {
    width: HOME_WINDOW_SIZE.width,
    height: HOME_WINDOW_SIZE.height,
  };
}
