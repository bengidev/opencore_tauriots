import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusText } from "./StatusText";

describe("StatusText", () => {
  it("formats error status with bracket prefix", () => {
    render(<StatusText variant="error">disk full</StatusText>);
    expect(screen.getByText("[ERROR: disk full]")).toBeInTheDocument();
  });

  it("formats loading status", () => {
    render(<StatusText variant="loading">ignored</StatusText>);
    expect(screen.getByText("[LOADING]")).toBeInTheDocument();
  });

  it("formats info status", () => {
    render(<StatusText variant="info">ready</StatusText>);
    expect(screen.getByText("[ready]")).toBeInTheDocument();
  });
});
