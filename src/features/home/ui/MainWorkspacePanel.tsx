import { useCallback, useRef, useState } from "react";
import { Snackbar } from "../../../shared/ui";
import {
  WORKSPACE_COMING_SOON_MESSAGES,
  type WorkspaceQuickActionId,
} from "../domain/workspaceQuickActions";
import { WorkspaceComposer } from "./WorkspaceComposer";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";

export function MainWorkspacePanel() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleQuickAction = useCallback((action: WorkspaceQuickActionId) => {
    setSnackbarMessage(WORKSPACE_COMING_SOON_MESSAGES[action]);
  }, []);

  return (
    <div className="home-workspace">
      <div className="home-workspace-stage">
        <WorkspaceEmptyState onQuickAction={handleQuickAction} />
      </div>
      <WorkspaceComposer textareaRef={textareaRef} />
      <Snackbar
        message={snackbarMessage}
        onDismiss={() => setSnackbarMessage(null)}
        className="home-workspace-snackbar"
      />
    </div>
  );
}
