import { Button } from "../../../shared/ui";

const QUICK_ACTIONS = ["New atom", "Run command", "Open file"] as const;

export function WorkspaceEmptyState() {
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
        {QUICK_ACTIONS.map((label) => (
          <Button
            key={label}
            variant="secondary"
            className="home-workspace-quick-action"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
