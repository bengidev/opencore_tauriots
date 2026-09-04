import { isMacOverlayTitleBar } from "../../../shared/platform/windowChrome";
import { HomePanelToggleButton } from "./HomePanelToggleButton";
import { HomeThemeToggleButton } from "./HomeThemeToggleButton";

type HomeShellHeaderProps = {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  footerPanelOpen: boolean;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
  onToggleFooterPanel: () => void;
};

export function HomeShellHeader({
  leftPanelOpen,
  rightPanelOpen,
  footerPanelOpen,
  onToggleLeftPanel,
  onToggleRightPanel,
  onToggleFooterPanel,
}: HomeShellHeaderProps) {
  const macOverlay = isMacOverlayTitleBar();

  return (
    <header
      className="home-shell-header"
      data-mac-overlay={macOverlay ? "true" : undefined}
    >
      <div className="home-shell-header-leading">
        <HomePanelToggleButton
          panel="left"
          expanded={leftPanelOpen}
          onToggle={onToggleLeftPanel}
        />
      </div>

      <div className="home-shell-title" data-tauri-drag-region>
        <span className="home-shell-title-mark">OpenCore</span>
        <span className="home-shell-title-sub">Local AI Workspace</span>
      </div>

      <div className="home-shell-header-trailing">
        <HomeThemeToggleButton />
        <HomePanelToggleButton
          panel="footer"
          expanded={footerPanelOpen}
          onToggle={onToggleFooterPanel}
        />
        <HomePanelToggleButton
          panel="right"
          expanded={rightPanelOpen}
          onToggle={onToggleRightPanel}
        />
      </div>
    </header>
  );
}
