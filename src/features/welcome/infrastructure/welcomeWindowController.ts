import { invoke } from "@tauri-apps/api/core";
import {
  HOME_WINDOW_SIZE,
  WELCOME_WINDOW_SIZE,
} from "../domain/welcomeConstants";

export interface WindowSize {
  width: number;
  height: number;
}

function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function centerWindow(): Promise<void> {
  try {
    await invoke("center_window");
  } catch {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window");
      await getCurrentWindow().center();
    } catch {
      // leave window unchanged outside tauri or on failure
    }
  }
}

async function resizeAndCenter(size: WindowSize): Promise<void> {
  if (!isTauri()) return;

  let needsResize = true;
  try {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const window = getCurrentWindow();
    const inner = await window.innerSize();
    const scale = await window.scaleFactor();
    const currentWidth = Math.round(inner.width / scale);
    const currentHeight = Math.round(inner.height / scale);
    needsResize =
      currentWidth !== size.width || currentHeight !== size.height;
  } catch {
    // fall through and let the backend decide
  }

  try {
    await invoke("resize_and_center_window", {
      width: size.width,
      height: size.height,
    });
  } catch {
    if (!needsResize) {
      await centerWindow();
      return;
    }

    try {
      const { getCurrentWindow, LogicalSize } = await import(
        "@tauri-apps/api/window"
      );
      const window = getCurrentWindow();
      await window.setSize(new LogicalSize(size.width, size.height));
      await nextFrame();
      await centerWindow();
    } catch {
      // leave window unchanged outside tauri or on failure
    }
    return;
  }

  if (needsResize) {
    await nextFrame();
    await centerWindow();
  }
}

export async function applyWelcomeWindowSize(): Promise<void> {
  await resizeAndCenter(WELCOME_WINDOW_SIZE);
}

export async function applyHomeWindowSize(): Promise<void> {
  await resizeAndCenter(HOME_WINDOW_SIZE);
}
