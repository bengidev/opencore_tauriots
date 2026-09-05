import { WorkspaceComposer } from "./WorkspaceComposer";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";

export function MainWorkspacePanel() {
  return (
    <div className="home-workspace">
      <div className="home-workspace-stage">
        <WorkspaceEmptyState />
      </div>
      <WorkspaceComposer />
    </div>
  );
}
