import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders primary variant with ds-button classes", () => {
    render(<Button variant="primary">Enter OpenCore</Button>);
    const btn = screen.getByRole("button", { name: "Enter OpenCore" });
    expect(btn).toHaveClass("ds-button", "ds-button--primary");
  });

  it("renders secondary variant", () => {
    render(<Button variant="secondary">Toggle</Button>);
    expect(screen.getByRole("button")).toHaveClass("ds-button--secondary");
  });
});
