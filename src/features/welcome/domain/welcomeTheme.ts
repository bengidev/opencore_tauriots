export type ThemeMode = "light" | "dark";

export type ForegroundToken = "primary" | "secondary" | "muted" | "accent";

export const DEFAULT_THEME_MODE: ThemeMode = "light";

export const THEME_TRANSITION_MS = 220;

const FOREGROUND: Record<ThemeMode, Record<ForegroundToken, string>> = {
  light: {
    primary: "rgb(26, 26, 26)",
    secondary: "rgb(102, 102, 102)",
    muted: "rgb(153, 153, 153)",
    accent: "rgb(0, 0, 0)",
  },
  dark: {
    primary: "rgb(232, 232, 232)",
    secondary: "rgb(153, 153, 153)",
    muted: "rgb(102, 102, 102)",
    accent: "rgb(255, 255, 255)",
  },
};

const SURFACE: Record<ThemeMode, string> = {
  light: "rgb(245, 245, 245)",
  dark: "rgb(0, 0, 0)",
};

const BORDER: Record<ThemeMode, string> = {
  light: "rgb(232, 232, 232)",
  dark: "rgb(34, 34, 34)",
};

const CTA: Record<ThemeMode, { bg: string; text: string }> = {
  light: { bg: "rgb(0, 0, 0)", text: "rgb(255, 255, 255)" },
  dark: { bg: "rgb(255, 255, 255)", text: "rgb(0, 0, 0)" },
};

export function foreground(mode: ThemeMode, token: ForegroundToken): string {
  return FOREGROUND[mode][token];
}

export function foregroundRgb(
  mode: ThemeMode,
  token: ForegroundToken,
): [number, number, number] {
  const match = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(FOREGROUND[mode][token]);
  if (!match) return [0, 0, 0];
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function lerpForegroundRgb(
  from: [number, number, number],
  to: [number, number, number],
  t: number,
): string {
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${mix(from[0], to[0])}, ${mix(from[1], to[1])}, ${mix(from[2], to[2])})`;
}

export function surface(mode: ThemeMode): string {
  return SURFACE[mode];
}

export function borderColor(mode: ThemeMode): string {
  return BORDER[mode];
}

export function ctaColors(mode: ThemeMode): { bg: string; text: string } {
  return CTA[mode];
}

export function nextThemeMode(mode: ThemeMode): ThemeMode {
  return mode === "dark" ? "light" : "dark";
}

async function applyNativeWindowTheme(mode: ThemeMode): Promise<void> {
  if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window)) {
    return;
  }

  try {
    const { setTheme } = await import("@tauri-apps/api/app");
    await setTheme(mode);
  } catch {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().setTheme(mode);
    } catch {
      // Native theme is optional when the capability is unavailable.
    }
  }
}

export function applyThemeToDocument(mode: ThemeMode): void {
  document.documentElement.dataset.theme = mode;
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.style.colorScheme = mode;
  void applyNativeWindowTheme(mode);
}
