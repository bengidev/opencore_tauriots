import { isMacOverlayTitleBar } from "../../../shared/platform/windowChrome";
import {
  AppTitle,
  FooterPanelIcon,
  IconButton,
  LeftPanelIcon,
  RightPanelIcon,
  ThemeToggleButton,
} from "../../../shared/ui";

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
        <IconButton
          size="sm"
          aria-label={
            leftPanelOpen ? "Collapse left panel" : "Expand left panel"
          }
          pressed={leftPanelOpen}
          icon={<LeftPanelIcon />}
          onClick={onToggleLeftPanel}
        />
      </div>

      <AppTitle
        title="OpenCore"
        subtitle="Local AI Workspace"
        dragRegion
      />

      <div className="home-shell-header-trailing">
        <ThemeToggleButton />
        <IconButton
          size="sm"
          aria-label={
            footerPanelOpen ? "Collapse footer panel" : "Expand footer panel"
          }
          pressed={footerPanelOpen}
          icon={<FooterPanelIcon />}
          onClick={onToggleFooterPanel}
        />
        <IconButton
          size="sm"
          aria-label={
            rightPanelOpen ? "Collapse right panel" : "Expand right panel"
          }
          pressed={rightPanelOpen}
          icon={<RightPanelIcon />}
          onClick={onToggleRightPanel}
        />
      </div>
    </header>
  );
}
