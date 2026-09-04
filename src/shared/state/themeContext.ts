import { createContext, useContext } from "react";
import type { ThemeMode } from "../../features/welcome/domain/welcomeTheme";

export interface ThemeContextValue {
  themeMode: ThemeMode;
  toggleTheme: () => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeMode(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within WelcomeProvider");
  }
  return context;
}
