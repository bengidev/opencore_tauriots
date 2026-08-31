export type WelcomeCommand = { type: "enter_pressed" };

export type WelcomeOutcome = "pending" | "completed";

export function reduceWelcome(command: WelcomeCommand): WelcomeOutcome {
  if (command.type === "enter_pressed") {
    return "completed";
  }
  return "pending";
}
