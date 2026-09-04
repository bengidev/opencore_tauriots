import { describe, expect, it } from "vitest";
import {
  HOME_MAIN_MIN_WIDTH_PX,
  HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
  isPanelContentHidden,
  panelContentOpacity,
  readStoredPanelOpen,
  resolveResizeEndAction,
  reservedSidebarWidth,
  shouldCollapsePanelSize,
  sidebarMaxWidth,
  writeStoredPanelOpen,
} from "./homeLayoutConstants";
import { panelRegionProps } from "./panelRegionProps";

function cssCustomProperty(
  style: Record<string, unknown>,
  name: string,
): string | undefined {
  return style[name] as string | undefined;
}

describe("panelRegionProps", () => {
  it("hides content immediately when a panel is closed", () => {
    const props = panelRegionProps({
      open: false,
      size: 256,
      sizeCssVar: "--home-left-panel-width",
      fadeEnd: HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
      fadeStart: 144,
    });

    expect(props["data-content-hidden"]).toBe("true");
    expect(
      cssCustomProperty(
        props.style as Record<string, unknown>,
        "--home-panel-content-opacity",
      ),
    ).toBe("0");
  });

  it("sets the documented sidebar width variable per side", () => {
    const props = panelRegionProps({
      open: true,
      size: 200,
      sizeCssVar: "--home-right-panel-width",
      fadeEnd: HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
      fadeStart: 144,
    });

    expect(
      cssCustomProperty(
        props.style as Record<string, unknown>,
        "--home-right-panel-width",
      ),
    ).toBe("200px");
  });
});

describe("homeLayoutConstants", () => {
  it("detects collapse threshold crossings", () => {
    expect(
      shouldCollapsePanelSize(
        HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX - 1,
        HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
      ),
    ).toBe(true);
    expect(
      shouldCollapsePanelSize(
        HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
        HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
      ),
    ).toBe(false);
  });

  it("fades panel content between fade start and fade end", () => {
    expect(panelContentOpacity(200, 72, 144)).toBe(1);
    expect(panelContentOpacity(72, 72, 144)).toBe(0);
    expect(panelContentOpacity(108, 72, 144)).toBe(0.5);
  });

  it("hides panel content at the fade end boundary", () => {
    expect(isPanelContentHidden(72, 72)).toBe(true);
    expect(isPanelContentHidden(73, 72)).toBe(false);
  });

  it("resolves resize end actions", () => {
    expect(resolveResizeEndAction(50, 72, 0, 400)).toBe("collapse");
    expect(resolveResizeEndAction(200, 72, 0, 400)).toEqual({
      commitWidth: 200,
    });
    expect(resolveResizeEndAction(500, 72, 0, 400)).toEqual({
      commitWidth: 400,
    });
  });

  it("computes sidebar max width from viewport and reserved space", () => {
    const reserved = reservedSidebarWidth(true, 256);
    const maxWidth = sidebarMaxWidth(1200, reserved);
    expect(maxWidth).toBe(1200 - reserved - HOME_MAIN_MIN_WIDTH_PX);
  });

  it("persists panel open state", () => {
    writeStoredPanelOpen("opencore:test-panel-open", false);
    expect(readStoredPanelOpen("opencore:test-panel-open", true)).toBe(false);
    writeStoredPanelOpen("opencore:test-panel-open", true);
    expect(readStoredPanelOpen("opencore:test-panel-open", false)).toBe(true);
    window.localStorage.removeItem("opencore:test-panel-open");
  });
});
