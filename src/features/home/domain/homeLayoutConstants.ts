export const HOME_TOPBAR_HEIGHT_PX = 44;
export const HOME_MAC_TRAFFIC_LIGHTS_INSET_PX = 84;

export const HOME_LEFT_SIDEBAR_DEFAULT_WIDTH_PX = 256;
export const HOME_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX = 280;

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

export const HOME_LEFT_PANEL_OPEN_KEY = "opencore:home:left-panel-open";
export const HOME_RIGHT_PANEL_OPEN_KEY = "opencore:home:right-panel-open";
export const HOME_FOOTER_PANEL_OPEN_KEY = "opencore:home:footer-panel-open";

export const HOME_LAYOUT_STORAGE_KEYS = [
  HOME_LEFT_SIDEBAR_WIDTH_KEY,
  HOME_RIGHT_SIDEBAR_WIDTH_KEY,
  HOME_LEFT_PANEL_OPEN_KEY,
  HOME_RIGHT_PANEL_OPEN_KEY,
  HOME_FOOTER_PANEL_OPEN_KEY,
] as const;

export function clearHomeLayoutPersistence(): void {
  if (typeof window === "undefined") {
    return;
  }

  for (const key of HOME_LAYOUT_STORAGE_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore quota or privacy errors.
    }
  }
}

export function clampWidth(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function shouldCollapsePanelSize(
  size: number,
  threshold: number,
): boolean {
  return size < threshold;
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

export function isPanelContentHidden(size: number, fadeEnd: number): boolean {
  return size <= fadeEnd;
}

export type ResizeEndAction = "collapse" | { commitWidth: number };

export function resolveResizeEndAction(
  width: number,
  collapseThreshold: number,
  resizeMinWidth: number,
  maxWidth: number,
): ResizeEndAction {
  if (shouldCollapsePanelSize(width, collapseThreshold)) {
    return "collapse";
  }

  return { commitWidth: clampWidth(width, resizeMinWidth, maxWidth) };
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

export function readStoredPanelOpen(
  storageKey: string,
  fallback: boolean,
): boolean {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw === null) {
      return fallback;
    }

    return raw === "true";
  } catch {
    return fallback;
  }
}

export function writeStoredPanelOpen(
  storageKey: string,
  open: boolean,
): void {
  try {
    window.localStorage.setItem(storageKey, String(open));
  } catch {
    // Ignore quota or privacy errors.
  }
}

export function sidebarMaxWidth(
  viewportWidth: number,
  reservedWidth: number,
): number {
  return Math.max(
    HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
    viewportWidth - reservedWidth - HOME_MAIN_MIN_WIDTH_PX,
  );
}

export function reservedSidebarWidth(open: boolean, width: number): number {
  return open ? width : 0;
}
