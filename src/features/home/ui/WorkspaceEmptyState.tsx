import { Button } from "../../../shared/ui";
import {
  WORKSPACE_QUICK_ACTIONS,
  type WorkspaceQuickActionId,
} from "../domain/workspaceQuickActions";

export interface WorkspaceEmptyStateProps {
  onQuickAction?: (action: WorkspaceQuickActionId) => void;
}

export function WorkspaceEmptyState({ onQuickAction }: WorkspaceEmptyStateProps) {
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
        {WORKSPACE_QUICK_ACTIONS.map(({ id, label }) => (
          <Button
            key={id}
            variant="secondary"
            className="home-workspace-quick-action"
            onClick={() => onQuickAction?.(id)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
