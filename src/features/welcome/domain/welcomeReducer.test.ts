import { describe, expect, it } from "vitest";
import { reduceWelcome } from "./welcomeReducer";

describe("welcomeReducer", () => {
  it("completes onboarding when enter is pressed", () => {
    expect(reduceWelcome({ type: "enter_pressed" })).toBe("completed");
  });
});
