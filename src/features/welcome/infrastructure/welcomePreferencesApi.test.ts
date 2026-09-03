import { afterEach, describe, expect, it, vi } from "vitest";
import { savePreferences } from "./welcomePreferencesApi";
import { DEFAULT_PREFERENCES } from "./welcomePreferencesTypes";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

describe("welcomePreferencesApi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    Reflect.deleteProperty(window, "__TAURI_INTERNALS__");
  });

  it("rethrows save failures in tauri", async () => {
    Object.defineProperty(window, "__TAURI_INTERNALS__", {
      configurable: true,
      value: {},
    });

    const { invoke } = await import("@tauri-apps/api/core");
    vi.mocked(invoke).mockRejectedValueOnce(new Error("disk full"));

    await expect(savePreferences(DEFAULT_PREFERENCES)).rejects.toThrow(
      "disk full",
    );
  });

  it("writes to localStorage outside tauri", async () => {
    await savePreferences({ ...DEFAULT_PREFERENCES, theme_mode: "light" });
    const raw = localStorage.getItem("opencore-tauriots-preferences");
    expect(raw).toContain('"theme_mode":"light"');
  });
});
