import { CUBE_HERO_EDGE_INSET } from "./cubeHeroConstants";
import { WELCOME_WINDOW_SIZE } from "./welcomeConstants";

export interface WindowViewport {
  width: number;
  height: number;
}

export const BRAND_HERO_MIN = 220;
export const BRAND_HERO_MAX = 320;

const WELCOME_EDGE_INSET_H = 16;
/** Vertical gap below macOS traffic lights before welcome header content. */
export const MAC_BRAND_GAP_AFTER_TRAFFIC = 20;
/** macOS traffic-light origin Y — keep in sync with tauri.conf.json trafficLightPosition.y */
const MAC_TRAFFIC_LIGHT_ORIGIN_Y = 16;
/** Height of the three traffic-light buttons. */
const MAC_TRAFFIC_LIGHT_CLUSTER_HEIGHT = 12;
/** Footer row (enter button + padding + border). */
const WELCOME_FOOTER_BAND = 96;
/** Headline, body copy, and gaps below the hero cube. */
const WELCOME_COPY_BAND = 188;
const WELCOME_ACTION_BAND = WELCOME_FOOTER_BAND + WELCOME_COPY_BAND;

export function cubeHeroCanvasSize(heroSize: number): number {
  return heroSize + CUBE_HERO_EDGE_INSET * 2;
}

function isMacPlatform(): boolean {
  return (
    typeof navigator !== "undefined" &&
    /Mac/i.test(navigator.platform || navigator.userAgent)
  );
}

export function isMacOverlayTitleBar(): boolean {
  return isMacPlatform();
}

/** Y coordinate of the bottom edge of the traffic-light cluster. */
export function macTrafficLightsBottom(): number {
  if (!isMacPlatform()) return 0;
  return MAC_TRAFFIC_LIGHT_ORIGIN_Y + MAC_TRAFFIC_LIGHT_CLUSTER_HEIGHT;
}

/** Top inset for welcome content that sits below the traffic lights + gap. */
export function macOverlayContentTopInset(): number {
  if (!isMacPlatform()) return 0;
  return macTrafficLightsBottom() + MAC_BRAND_GAP_AFTER_TRAFFIC;
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

export function welcomeViewport(): WindowViewport {
  return {
    width: WELCOME_WINDOW_SIZE.width,
    height: WELCOME_WINDOW_SIZE.height,
  };
}
