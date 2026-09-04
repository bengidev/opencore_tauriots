export const HOME_TOPBAR_HEIGHT_PX = 44;
export const HOME_MAC_TRAFFIC_LIGHTS_INSET_PX = 84;

export const HOME_LEFT_SIDEBAR_DEFAULT_WIDTH_PX = 256;
export const HOME_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX = 280;

export const HOME_LEFT_SIDEBAR_MIN_WIDTH_PX = 200;
export const HOME_RIGHT_SIDEBAR_MIN_WIDTH_PX = 200;
export const HOME_MAIN_MIN_WIDTH_PX = 320;

/** Drag below this width on release to auto-collapse the panel. */
export const HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX = 72;
/** Width at which panel content begins fading during resize. */
export const HOME_SIDEBAR_CONTENT_FADE_START_PX =
  HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX * 2;
/** Lowest width allowed while actively dragging (before collapse on release). */
export const HOME_SIDEBAR_RESIZE_MIN_WIDTH_PX = 0;

export const HOME_LEFT_SIDEBAR_WIDTH_KEY = "opencore:home:left-sidebar-width";
export const HOME_RIGHT_SIDEBAR_WIDTH_KEY = "opencore:home:right-sidebar-width";

export function clampWidth(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function shouldCollapsePanelSize(
  size: number,
  threshold: number,
): boolean {
  return size < threshold;
}

/** @deprecated Use shouldCollapsePanelSize */
export function shouldCollapseSidebarWidth(
  width: number,
  threshold = HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
): boolean {
  return shouldCollapsePanelSize(width, threshold);
}

export function panelContentOpacity(
  size: number,
  fadeEnd: number,
  fadeStart: number,
): number {
  if (size >= fadeStart) {
    return 1;
  }

  if (size <= fadeEnd) {
    return 0;
  }

  return (size - fadeEnd) / (fadeStart - fadeEnd);
}

/** @deprecated Use panelContentOpacity */
export function sidebarContentOpacity(
  width: number,
  fadeEnd = HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
  fadeStart = HOME_SIDEBAR_CONTENT_FADE_START_PX,
): number {
  return panelContentOpacity(width, fadeEnd, fadeStart);
}

export function isPanelContentHidden(size: number, fadeEnd: number): boolean {
  return size < fadeEnd;
}

export function readStoredPanelSize(
  storageKey: string,
  fallback: number,
): number {
  return readStoredSidebarWidth(storageKey, fallback);
}

export function writeStoredPanelSize(
  storageKey: string,
  size: number,
): void {
  writeStoredSidebarWidth(storageKey, size);
}

export function readStoredSidebarWidth(
  storageKey: string,
  fallback: number,
): number {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return fallback;
    }

    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeStoredSidebarWidth(
  storageKey: string,
  width: number,
): void {
  try {
    window.localStorage.setItem(storageKey, String(Math.round(width)));
  } catch {
    // Ignore quota or privacy errors.
  }
}

export function resolveSidebarMaximumWidth(
  viewportWidth: number,
  reservedWidth: number,
  ratio = 0.42,
): number {
  return Math.max(
    HOME_LEFT_SIDEBAR_MIN_WIDTH_PX,
    Math.floor(viewportWidth * ratio) - reservedWidth,
  );
}
