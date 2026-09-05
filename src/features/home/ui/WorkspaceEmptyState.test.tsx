import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";

describe("WorkspaceEmptyState", () => {
  it("calls onQuickAction with new-atom when New atom is clicked", () => {
    const onQuickAction = vi.fn();

    render(<WorkspaceEmptyState onQuickAction={onQuickAction} />);

    fireEvent.click(screen.getByRole("button", { name: "New atom" }));

    expect(onQuickAction).toHaveBeenCalledWith("new-atom");
  });

  it("calls onQuickAction for unimplemented quick actions", () => {
    const onQuickAction = vi.fn();

    render(<WorkspaceEmptyState onQuickAction={onQuickAction} />);

    fireEvent.click(screen.getByRole("button", { name: "Run command" }));
    fireEvent.click(screen.getByRole("button", { name: "Open file" }));

    expect(onQuickAction).toHaveBeenCalledWith("run-command");
    expect(onQuickAction).toHaveBeenCalledWith("open-file");
  });

  it("keeps all quick actions enabled", () => {
    render(<WorkspaceEmptyState />);

    expect(screen.getByRole("button", { name: "New atom" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Run command" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Open file" })).toBeEnabled();
  });
});
