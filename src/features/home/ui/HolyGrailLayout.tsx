import {
  type CSSProperties,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  HOME_LEFT_SIDEBAR_DEFAULT_WIDTH_PX,
  HOME_LEFT_SIDEBAR_WIDTH_KEY,
  HOME_MAC_TRAFFIC_LIGHTS_INSET_PX,
  HOME_MAIN_MIN_WIDTH_PX,
  HOME_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX,
  HOME_RIGHT_SIDEBAR_WIDTH_KEY,
  HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
  HOME_SIDEBAR_CONTENT_FADE_START_PX,
  HOME_TOPBAR_HEIGHT_PX,
  readStoredSidebarWidth,
} from "../domain/homeLayoutConstants";
import { panelRegionProps } from "../domain/panelRegionProps";
import { useResizableWidth } from "../hooks/useResizableWidth";
import { HomeShellHeader } from "./HomeShellHeader";

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

function reservedSidebarWidth(open: boolean, width: number): number {
  return open ? width : 0;
}

function sidebarMaxWidth(
  viewportWidth: number,
  reservedWidth: number,
): number {
  return Math.max(
    HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
    viewportWidth - reservedWidth - HOME_MAIN_MIN_WIDTH_PX,
  );
}

export function HolyGrailLayout() {
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [footerPanelOpen, setFooterPanelOpen] = useState(true);

  const collapseLeftPanel = useCallback(() => {
    setLeftPanelOpen(false);
  }, []);

  const collapseRightPanel = useCallback(() => {
    setRightPanelOpen(false);
  }, []);

  const viewportWidth = useSyncExternalStore(
    subscribeToViewportWidth,
    readViewportWidth,
    () =>
      HOME_LEFT_SIDEBAR_DEFAULT_WIDTH_PX +
      HOME_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX +
      HOME_MAIN_MIN_WIDTH_PX,
  );

  const leftWidthRef = useRef(
    readStoredSidebarWidth(
      HOME_LEFT_SIDEBAR_WIDTH_KEY,
      HOME_LEFT_SIDEBAR_DEFAULT_WIDTH_PX,
    ),
  );
  const rightWidthRef = useRef(
    readStoredSidebarWidth(
      HOME_RIGHT_SIDEBAR_WIDTH_KEY,
      HOME_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX,
    ),
  );

  const rightPanelMaxWidth = sidebarMaxWidth(
    viewportWidth,
    reservedSidebarWidth(leftPanelOpen, leftWidthRef.current),
  );

  const rightPanel = useResizableWidth({
    side: "right",
    storageKey: HOME_RIGHT_SIDEBAR_WIDTH_KEY,
    defaultWidth: HOME_RIGHT_SIDEBAR_DEFAULT_WIDTH_PX,
    maxWidth: rightPanelMaxWidth,
    onRequestCollapse: collapseRightPanel,
  });

  rightWidthRef.current = rightPanel.width;

  const leftPanelMaxWidth = sidebarMaxWidth(
    viewportWidth,
    reservedSidebarWidth(rightPanelOpen, rightWidthRef.current),
  );

  const leftPanel = useResizableWidth({
    side: "left",
    storageKey: HOME_LEFT_SIDEBAR_WIDTH_KEY,
    defaultWidth: HOME_LEFT_SIDEBAR_DEFAULT_WIDTH_PX,
    maxWidth: leftPanelMaxWidth,
    onRequestCollapse: collapseLeftPanel,
  });

  leftWidthRef.current = leftPanel.width;

  const isResizingPanels = leftPanel.isResizing || rightPanel.isResizing;

  const leftPanelSlot = panelRegionProps({
    open: leftPanelOpen,
    size: leftPanel.width,
    sizeCssVar: "--home-panel-slot-width",
    fadeEnd: HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
    fadeStart: HOME_SIDEBAR_CONTENT_FADE_START_PX,
  });

  const rightPanelSlot = panelRegionProps({
    open: rightPanelOpen,
    size: rightPanel.width,
    sizeCssVar: "--home-panel-slot-width",
    fadeEnd: HOME_SIDEBAR_COLLAPSE_THRESHOLD_PX,
    fadeStart: HOME_SIDEBAR_CONTENT_FADE_START_PX,
  });

  return (
    <div
      className="home-shell"
      style={
        {
          "--home-left-panel-width": `${leftPanel.width}px`,
          "--home-right-panel-width": `${rightPanel.width}px`,
          "--home-topbar-height": `${HOME_TOPBAR_HEIGHT_PX}px`,
          "--home-traffic-lights-inset": `${HOME_MAC_TRAFFIC_LIGHTS_INSET_PX}px`,
        } as CSSProperties
      }
    >
      <HomeShellHeader
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        footerPanelOpen={footerPanelOpen}
        onToggleLeftPanel={() => setLeftPanelOpen((open) => !open)}
        onToggleRightPanel={() => setRightPanelOpen((open) => !open)}
        onToggleFooterPanel={() => setFooterPanelOpen((open) => !open)}
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
                <span className="home-shell-label">Left Panel</span>
              </div>
              <button
                {...leftPanel.resizeRailProps}
                tabIndex={leftPanelOpen ? 0 : -1}
              />
            </div>
          </aside>
        </div>

        <main className="home-shell-main">
          <span className="home-shell-label">Main Panel</span>
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
                {...rightPanel.resizeRailProps}
                tabIndex={rightPanelOpen ? 0 : -1}
              />
              <div className="home-shell-panel-content">
                <span className="home-shell-label">Right Panel</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div
        className="home-shell-footer-slot"
        data-state={panelState(footerPanelOpen)}
      >
        <footer
          className="home-shell-footer"
          aria-hidden={!footerPanelOpen}
          inert={footerPanelOpen ? undefined : true}
        >
          <div className="home-shell-footer-surface">
            <div className="home-shell-footer-content">
              <span className="home-shell-label">Footer Panel</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
