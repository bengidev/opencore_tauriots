import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MainWorkspacePanel } from "./MainWorkspacePanel";

describe("MainWorkspacePanel", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a coming soon snackbar for New atom", async () => {
    render(<MainWorkspacePanel />);

    fireEvent.click(screen.getByRole("button", { name: "New atom" }));

    expect(
      await screen.findByText("New atom creation is coming soon."),
    ).toBeInTheDocument();
  });

  it("shows a coming soon snackbar for Run command", async () => {
    render(<MainWorkspacePanel />);

    fireEvent.click(screen.getByRole("button", { name: "Run command" }));

    expect(
      await screen.findByText("Command palette is coming soon."),
    ).toBeInTheDocument();
  });

  it("shows a coming soon snackbar for Open file", async () => {
    render(<MainWorkspacePanel />);

    fireEvent.click(screen.getByRole("button", { name: "Open file" }));

    expect(
      await screen.findByText("File picker is coming soon."),
    ).toBeInTheDocument();
  });

  it("dismisses the snackbar after the timeout", () => {
    vi.useFakeTimers();

    render(<MainWorkspacePanel />);

    fireEvent.click(screen.getByRole("button", { name: "Run command" }));

    expect(
      screen.getByText("Command palette is coming soon."),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3200);
    });

    act(() => {
      vi.advanceTimersByTime(180);
    });

    expect(
      screen.queryByText("Command palette is coming soon."),
    ).not.toBeInTheDocument();
  });
});
