import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkspaceEmptyState } from "./WorkspaceEmptyState";

describe("WorkspaceEmptyState", () => {
  it("focuses composer when New atom is clicked", () => {
    const onFocusComposer = vi.fn();

    render(<WorkspaceEmptyState onFocusComposer={onFocusComposer} />);

    fireEvent.click(screen.getByRole("button", { name: "New atom" }));

    expect(onFocusComposer).toHaveBeenCalledOnce();
  });

  it("disables unimplemented quick actions", () => {
    render(<WorkspaceEmptyState />);

    expect(screen.getByRole("button", { name: "Run command" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Open file" })).toBeDisabled();
  });
});
