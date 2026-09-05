import { useRef } from "react";
import { WorkspaceComposer } from "./WorkspaceComposer";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";

export function MainWorkspacePanel() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="home-workspace">
      <div className="home-workspace-stage">
        <WorkspaceEmptyState
          onFocusComposer={() => textareaRef.current?.focus()}
        />
      </div>
      <WorkspaceComposer textareaRef={textareaRef} />
    </div>
  );
}
