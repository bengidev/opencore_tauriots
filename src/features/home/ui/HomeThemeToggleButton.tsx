import { useWelcome } from "../../welcome/state/welcomeContext";

function ThemeSunIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle
        cx="8"
        cy="8"
        r="3.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M8 1.25v1.5M8 13.25v1.5M1.25 8h1.5M13.25 8h1.5M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ThemeMoonIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M11.75 2.35a5.75 5.75 0 1 0 2.9 10.05A4.75 4.75 0 1 1 11.75 2.35Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeThemeToggleButton() {
  const { themeMode, toggleTheme } = useWelcome();
  const label = themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode";
  const Icon = themeMode === "dark" ? ThemeSunIcon : ThemeMoonIcon;

  return (
    <button
      type="button"
      className="home-panel-toggle home-theme-toggle"
      aria-label={label}
      onClick={() => {
        void toggleTheme();
      }}
    >
      <Icon />
    </button>
  );
}
