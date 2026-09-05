import { Button } from "../../../shared/ui";

const QUICK_ACTIONS = [
  { label: "New atom", disabled: false },
  { label: "Run command", disabled: true },
  { label: "Open file", disabled: true },
] as const;

export interface WorkspaceEmptyStateProps {
  onFocusComposer?: () => void;
}

export function WorkspaceEmptyState({
  onFocusComposer,
}: WorkspaceEmptyStateProps) {
  return (
    <div className="home-workspace-empty">
      <div className="home-workspace-empty-card">
        <div className="home-workspace-empty-icon" aria-hidden="true">
          +
        </div>
        <p className="home-workspace-empty-headline">Start a new atom</p>
        <p className="home-workspace-empty-body">
          Ask questions, run commands, and edit files without leaving your
          machine.
        </p>
      </div>

      <div className="home-workspace-quick-actions" role="group" aria-label="Quick actions">
        {QUICK_ACTIONS.map(({ label, disabled }) => (
          <Button
            key={label}
            variant="secondary"
            className="home-workspace-quick-action"
            disabled={disabled}
            title={disabled ? "Coming soon" : undefined}
            onClick={
              disabled
                ? undefined
                : () => {
                    onFocusComposer?.();
                  }
            }
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
