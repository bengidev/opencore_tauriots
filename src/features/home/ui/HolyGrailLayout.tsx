import { type CSSProperties, useCallback, useRef, useSyncExternalStore } from "react";
import {
  HOME_FOOTER_PANEL_OPEN_KEY,
  HOME_LEFT_PANEL_OPEN_KEY,
  HOME_LEFT_SIDEBAR_DEFAULT_WIDTH_PX,
  HOME_LEFT_SIDEBAR_WIDTH_KEY,
  HOME_MAC_TRAFFIC_LIGHTS_INSET_PX,
  HOME_MAIN_MIN_WIDTH_PX,
  HOME_RIGHT_PANEL_OPEN_KEY,
  HOME_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX,
  HOME_RIGHT_SIDEBAR_WIDTH_KEY,
  HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
  HOME_SIDEBAR_CONTENT_FADE_START_PX,
  HOME_TOPBAR_HEIGHT_PX,
  reservedSidebarWidth,
  sidebarMaxWidth,
} from "../domain/homeLayoutConstants";
import { panelRegionProps } from "../domain/panelRegionProps";
import { usePersistedPanelOpen } from "../hooks/usePersistedPanelOpen";
import { useResizableWidth } from "../hooks/useResizableWidth";
import { Label } from "../../../shared/ui";
import { HomeShellHeader } from "./HomeShellHeader";
import { MainWorkspacePanel } from "./MainWorkspacePanel";

function subscribeToViewportWidth(onStoreChange: () => void): () => void {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

function readViewportWidth(): number {
  return window.innerWidth;
}

function panelState(open: boolean): "open" | "closed" {
  return open ? "open" : "closed";
}

export function HolyGrailLayout() {
  const {
    open: leftPanelOpen,
    toggle: toggleLeftPanel,
    setOpen: setLeftPanelOpen,
  } = usePersistedPanelOpen(HOME_LEFT_PANEL_OPEN_KEY);
  const {
    open: rightPanelOpen,
    toggle: toggleRightPanel,
    setOpen: setRightPanelOpen,
  } = usePersistedPanelOpen(HOME_RIGHT_PANEL_OPEN_KEY);
  const {
    open: footerPanelOpen,
    toggle: toggleFooterPanel,
  } = usePersistedPanelOpen(HOME_FOOTER_PANEL_OPEN_KEY);

  const collapseLeftPanel = useCallback(() => {
    setLeftPanelOpen(false);
  }, [setLeftPanelOpen]);

  const collapseRightPanel = useCallback(() => {
    setRightPanelOpen(false);
  }, [setRightPanelOpen]);

  const viewportWidth = useSyncExternalStore(
    subscribeToViewportWidth,
    readViewportWidth,
    () =>
      HOME_LEFT_SIDEBAR_DEFAULT_WIDTH_PX +
      HOME_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX +
      HOME_MAIN_MIN_WIDTH_PX,
  );

  const rightWidthRef = useRef(HOME_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX);

  const leftPanelMaxWidth = sidebarMaxWidth(
    viewportWidth,
    reservedSidebarWidth(rightPanelOpen, rightWidthRef.current),
  );

  const leftSidebar = useResizableWidth({
    side: "left",
    storageKey: HOME_LEFT_SIDEBAR_WIDTH_KEY,
    defaultWidth: HOME_LEFT_SIDEBAR_DEFAULT_WIDTH_PX,
    maxWidth: leftPanelMaxWidth,
    onRequestCollapse: collapseLeftPanel,
  });

  const rightPanelMaxWidth = sidebarMaxWidth(
    viewportWidth,
    reservedSidebarWidth(leftPanelOpen, leftSidebar.width),
  );

  const rightSidebar = useResizableWidth({
    side: "right",
    storageKey: HOME_RIGHT_SIDEBAR_WIDTH_KEY,
    defaultWidth: HOME_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX,
    maxWidth: rightPanelMaxWidth,
    onRequestCollapse: collapseRightPanel,
  });

  rightWidthRef.current = rightSidebar.width;

  const isResizingPanels = leftSidebar.isResizing || rightSidebar.isResizing;

  const leftPanelSlot = panelRegionProps({
    open: leftPanelOpen,
    size: leftSidebar.width,
    sizeCssVar: "--home-left-panel-width",
    fadeEnd: HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
    fadeStart: HOME_SIDEBAR_CONTENT_FADE_START_PX,
  });

  const rightPanelSlot = panelRegionProps({
    open: rightPanelOpen,
    size: rightSidebar.width,
    sizeCssVar: "--home-right-panel-width",
    fadeEnd: HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
    fadeStart: HOME_SIDEBAR_CONTENT_FADE_START_PX,
  });

  const footerPanelSlot = panelRegionProps({
    open: footerPanelOpen,
    size: HOME_TOPBAR_HEIGHT_PX,
    sizeCssVar: "--home-footer-panel-height",
    fadeEnd: 0,
    fadeStart: 0,
  });

  return (
    <div
      className="home-shell"
      style={
        {
          "--home-topbar-height": `${HOME_TOPBAR_HEIGHT_PX}px`,
          "--home-traffic-lights-inset": `${HOME_MAC_TRAFFIC_LIGHTS_INSET_PX}px`,
        } as CSSProperties
      }
    >
      <HomeShellHeader
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        footerPanelOpen={footerPanelOpen}
        onToggleLeftPanel={toggleLeftPanel}
        onToggleRightPanel={toggleRightPanel}
        onToggleFooterPanel={toggleFooterPanel}
      />

      <div className="home-shell-body">
        <div
          className="home-shell-panel-slot home-shell-panel-slot-left"
          data-state={panelState(leftPanelOpen)}
          data-resizing={isResizingPanels ? "true" : undefined}
          data-content-hidden={leftPanelSlot["data-content-hidden"]}
          data-content-narrow={leftPanelSlot["data-content-narrow"]}
          style={leftPanelSlot.style}
        >
          <aside
            className="home-shell-panel home-shell-panel-left"
            aria-hidden={!leftPanelOpen}
            inert={leftPanelOpen ? undefined : true}
          >
            <div className="home-shell-panel-surface">
              <div className="home-shell-panel-content">
                <Label>Left Panel</Label>
              </div>
              <button
                {...leftSidebar.resizeRailProps}
                tabIndex={leftPanelOpen ? 0 : -1}
              />
            </div>
          </aside>
        </div>

        <main className="home-shell-main">
          <MainWorkspacePanel />
        </main>

        <div
          className="home-shell-panel-slot home-shell-panel-slot-right"
          data-state={panelState(rightPanelOpen)}
          data-resizing={isResizingPanels ? "true" : undefined}
          data-content-hidden={rightPanelSlot["data-content-hidden"]}
          data-content-narrow={rightPanelSlot["data-content-narrow"]}
          style={rightPanelSlot.style}
        >
          <aside
            className="home-shell-panel home-shell-panel-right"
            aria-hidden={!rightPanelOpen}
            inert={rightPanelOpen ? undefined : true}
          >
            <div className="home-shell-panel-surface">
              <button
                {...rightSidebar.resizeRailProps}
                tabIndex={rightPanelOpen ? 0 : -1}
              />
              <div className="home-shell-panel-content">
                <Label>Right Panel</Label>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div
        className="home-shell-footer-slot"
        data-state={panelState(footerPanelOpen)}
        data-content-hidden={footerPanelSlot["data-content-hidden"]}
        style={footerPanelSlot.style}
      >
        <footer
          className="home-shell-footer"
          aria-hidden={!footerPanelOpen}
          inert={footerPanelOpen ? undefined : true}
        >
          <div className="home-shell-footer-surface">
            <div className="home-shell-footer-content">
              <Label>Footer Panel</Label>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
