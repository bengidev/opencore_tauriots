import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { IconButton } from "./IconButton";

describe("IconButton", () => {
  it("renders with aria-label and sm size", () => {
    render(
      <IconButton size="sm" aria-label="Toggle left panel" icon={<span data-testid="icon" />} />,
    );
    const btn = screen.getByRole("button", { name: "Toggle left panel" });
    expect(btn).toHaveClass("ds-icon-button", "ds-icon-button--sm");
  });

  it("sets aria-pressed when pressed prop provided", () => {
    render(
      <IconButton size="sm" pressed={false} aria-label="Panel" icon={<span />} />,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });
});
