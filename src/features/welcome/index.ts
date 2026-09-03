export { WelcomeRoot } from "./ui/WelcomeRoot";
export { WelcomeScreen } from "./ui/WelcomeScreen";
export type { WelcomeScreenProps } from "./ui/WelcomeScreen";
export { reduceWelcome } from "./domain/welcomeReducer";
export type { WelcomeCommand, WelcomeOutcome } from "./domain/welcomeReducer";
export type { ThemeMode } from "./domain/welcomeTheme";
export type { AppPreferences } from "./infrastructure/welcomePreferencesTypes";

import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-mono/400.css";
import "./styles/welcome.css";
