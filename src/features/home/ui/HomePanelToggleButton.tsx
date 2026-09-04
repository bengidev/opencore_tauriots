type HomePanelToggleButtonProps = {
  panel: "left" | "right" | "footer";
  expanded: boolean;
  onToggle: () => void;
};

function LeftPanelIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <rect
        x="1.75"
        y="2.75"
        width="12.5"
        height="10.5"
        rx="1.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M5.75 2.75v10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function RightPanelIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <rect
        x="1.75"
        y="2.75"
        width="12.5"
        height="10.5"
        rx="1.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M10.25 2.75v10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function FooterPanelIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <rect
        x="1.75"
        y="2.75"
        width="12.5"
        height="10.5"
        rx="1.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M1.75 11.25h12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

const PANEL_LABELS = {
  left: "left panel",
  right: "right panel",
  footer: "footer panel",
} as const;

export function HomePanelToggleButton({
  panel,
  expanded,
  onToggle,
}: HomePanelToggleButtonProps) {
  const Icon =
    panel === "left"
      ? LeftPanelIcon
      : panel === "right"
        ? RightPanelIcon
        : FooterPanelIcon;
  const label = PANEL_LABELS[panel];

  return (
    <button
      type="button"
      className="home-panel-toggle"
      aria-label={expanded ? `Collapse ${label}` : `Expand ${label}`}
      aria-pressed={expanded}
      onClick={onToggle}
    >
      <Icon />
    </button>
  );
}
