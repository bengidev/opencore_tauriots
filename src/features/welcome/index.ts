export { WelcomeRoot } from "./ui/WelcomeRoot";
export { WelcomeScreen } from "./ui/WelcomeScreen";
export type { WelcomeScreenProps } from "./ui/WelcomeScreen";
export { reduceWelcome } from "./domain/welcomeReducer";
export type { WelcomeCommand, WelcomeOutcome } from "./domain/welcomeReducer";
export type { ThemeMode } from "../../shared/theme/theme";
export type { AppPreferences } from "./infrastructure/welcomePreferencesTypes";

import "./styles/welcome.css";
