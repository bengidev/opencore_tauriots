import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkspaceComposer } from "./WorkspaceComposer";

describe("WorkspaceComposer", () => {
  it("focuses textarea when input row is clicked", () => {
    render(<WorkspaceComposer />);
    const textarea = screen.getByPlaceholderText("Ask anything…");
    const row = textarea.closest(".home-workspace-composer-input-row");

    expect(row).not.toBeNull();
    fireEvent.click(row!);
    expect(textarea).toHaveFocus();
  });

  it("submits and clears draft on Enter", () => {
    render(<WorkspaceComposer />);
    const textarea = screen.getByPlaceholderText("Ask anything…");

    fireEvent.change(textarea, { target: { value: "hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(textarea).toHaveValue("");
  });

  it("does not submit empty draft on Enter", () => {
    render(<WorkspaceComposer />);
    const textarea = screen.getByPlaceholderText("Ask anything…");

    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    expect(textarea).toHaveValue("");
  });

  it("disables send button when draft is empty", () => {
    render(<WorkspaceComposer />);

    expect(screen.getByRole("button", { name: "Send atom" })).toBeDisabled();
  });

  it("enables send button when draft has text", () => {
    render(<WorkspaceComposer />);
    const textarea = screen.getByPlaceholderText("Ask anything…");

    fireEvent.change(textarea, { target: { value: "hello" } });

    expect(screen.getByRole("button", { name: "Send atom" })).toBeEnabled();
  });

  it("closes dropdown on Escape", () => {
    render(<WorkspaceComposer />);
    const modelButton = screen.getByRole("button", {
      name: /Add OpenRouter API key/i,
    });

    fireEvent.click(modelButton);
    expect(screen.getByRole("listbox", { name: "Model" })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("listbox", { name: "Model" }), {
      key: "Escape",
    });

    expect(
      screen.queryByRole("listbox", { name: "Model" }),
    ).not.toBeInTheDocument();
  });

  it("opens only one dropdown at a time", () => {
    render(<WorkspaceComposer />);

    fireEvent.click(
      screen.getByRole("button", { name: /Add OpenRouter API key/i }),
    );
    expect(screen.getByRole("listbox", { name: "Model" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^High/i }));

    expect(
      screen.queryByRole("listbox", { name: "Model" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("listbox", { name: "Priority" }),
    ).toBeInTheDocument();
  });
});
