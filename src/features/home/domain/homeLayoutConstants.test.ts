import { describe, expect, it } from "vitest";
import {
  HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
  panelContentOpacity,
  shouldCollapsePanelSize,
} from "./homeLayoutConstants";
import { panelRegionProps } from "./panelRegionProps";

describe("panelRegionProps", () => {
  it("hides content immediately when a panel is closed", () => {
    const props = panelRegionProps({
      open: false,
      size: 256,
      sizeCssVar: "--home-panel-slot-width",
      fadeEnd: HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
      fadeStart: 144,
    });

    expect(props["data-content-hidden"]).toBe("true");
    expect(props.style["--home-panel-content-opacity"]).toBe("0");
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
});
