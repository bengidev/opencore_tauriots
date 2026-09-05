export type WorkspaceQuickActionId =
  | "new-atom"
  | "run-command"
  | "open-file";

export const WORKSPACE_QUICK_ACTIONS: {
  id: WorkspaceQuickActionId;
  label: string;
}[] = [
  { id: "new-atom", label: "New atom" },
  { id: "run-command", label: "Run command" },
  { id: "open-file", label: "Open file" },
];

export const WORKSPACE_COMING_SOON_MESSAGES: Record<
  WorkspaceQuickActionId,
  string
> = {
  "new-atom": "New atom creation is coming soon.",
  "run-command": "Command palette is coming soon.",
  "open-file": "File picker is coming soon.",
};
