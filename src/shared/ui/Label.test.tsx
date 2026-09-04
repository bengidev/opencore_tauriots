import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./Label";

describe("Label", () => {
  it("renders bordered label with uppercase class", () => {
    render(<Label>Left Panel</Label>);
    const el = screen.getByText("Left Panel");
    expect(el).toHaveClass("ds-label");
    expect(el.tagName).toBe("SPAN");
  });
});
