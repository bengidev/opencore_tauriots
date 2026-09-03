import { describe, expect, it } from "vitest";
import {
  macOverlayContentTopInset,
  macTrafficLightsBottom,
  responsiveCubeHeroSize,
  welcomeViewport,
} from "./heroLayout";

describe("heroLayout", () => {
  it("computes macOS traffic light geometry", () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: { platform: "MacIntel", userAgent: "Macintosh" },
    });

    expect(macTrafficLightsBottom()).toBe(28);
    expect(macOverlayContentTopInset()).toBe(48);

    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originalNavigator,
    });
  });

  it("returns zero inset on non-mac platforms", () => {
    const originalNavigator = globalThis.navigator;
    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: { platform: "Win32", userAgent: "Windows" },
    });

    expect(macOverlayContentTopInset()).toBe(0);

    Object.defineProperty(globalThis, "navigator", {
      configurable: true,
      value: originalNavigator,
    });
  });

  it("sizes the cube hero within welcome viewport bounds", () => {
    const size = responsiveCubeHeroSize(welcomeViewport());
    expect(size).toBeGreaterThanOrEqual(220);
    expect(size).toBeLessThanOrEqual(320);
  });
});
