import type { CSSProperties } from "react";
import { isPanelContentHidden, panelContentOpacity } from "./homeLayoutConstants";

type PanelRegionPropsOptions = {
  open: boolean;
  size: number;
  sizeCssVar: string;
  fadeEnd: number;
  fadeStart: number;
};

export function panelRegionProps({
  open,
  size,
  sizeCssVar,
  fadeEnd,
  fadeStart,
}: PanelRegionPropsOptions) {
  const opacity = open ? panelContentOpacity(size, fadeEnd, fadeStart) : 0;

  return {
    style: {
      [sizeCssVar]: `${size}px`,
      "--home-panel-content-opacity": String(opacity),
    } as CSSProperties,
    "data-content-hidden":
      !open || isPanelContentHidden(size, fadeEnd)
        ? ("true" as const)
        : undefined,
    "data-content-narrow":
      open && size < fadeStart ? ("true" as const) : undefined,
  };
}
