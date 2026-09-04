import { useThemeMode } from "../state/themeContext";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { MoonIcon } from "./icons/MoonIcon";
import { SunIcon } from "./icons/SunIcon";

export interface ThemeToggleButtonProps {
  showLabel?: boolean;
}

export function ThemeToggleButton({ showLabel = false }: ThemeToggleButtonProps) {
  const { themeMode, toggleTheme } = useThemeMode();
  const label = themeMode === "dark" ? "Light" : "Dark";
  const Icon = themeMode === "dark" ? SunIcon : MoonIcon;
  const ariaLabel = themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode";

  if (showLabel) {
    return (
      <Button variant="secondary" onClick={() => void toggleTheme()}>
        <Icon />
        <span style={{ marginLeft: "0.4rem" }}>{label}</span>
      </Button>
    );
  }

  return (
    <IconButton
      size="sm"
      aria-label={ariaLabel}
      icon={<Icon />}
      onClick={() => void toggleTheme()}
    />
  );
}
