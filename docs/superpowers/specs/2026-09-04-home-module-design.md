# Home Module Design

**Date:** 2026-09-04  
**Status:** Approved (updated)

## Summary

Create a new `home` feature module with a classic 5-region holy grail layout. When the user clicks "Enter OpenCore" (or presses Enter on the welcome screen), navigate to the home module. Reuse the existing welcome theme system.

The shell includes resizable/collapsible sidebars, panel toggle controls, a theme toggle in the header, and custom window chrome (hidden native title bar with drag regions).

## Requirements

1. New feature module at `src/features/home/`
2. Classic holy grail: header, footer, left sidebar, right sidebar, center main
3. Body regions show placeholder labels; header hosts shell chrome (title, panel toggles, theme toggle)
4. Reuse existing `data-theme` CSS variables and `welcome-theme-surface` utility
5. Navigation: welcome `WelcomeRoot` renders `HomeRoot` when `activeScreen === "home"` (existing flow)
6. Remove `HomePlaceholder` from welcome module
7. Side panels resizable via `--home-left-panel-width` / `--home-right-panel-width`
8. Panel open/closed state and sidebar widths persist to `localStorage`
9. Drag sidebars below collapse threshold on release to auto-collapse
10. Custom window chrome: hidden native title, `data-tauri-drag-region` on header title areas
11. Default new sessions to light mode (frontend + Rust preferences)

## Architecture

```
src/features/home/
├── index.ts
├── domain/
│   ├── homeLayoutConstants.ts
│   └── panelRegionProps.ts
├── hooks/
│   ├── usePersistedPanelOpen.ts
│   └── useResizableWidth.ts
├── ui/
│   ├── HomeRoot.tsx
│   ├── HolyGrailLayout.tsx
│   ├── HomeShellHeader.tsx
│   ├── HomePanelToggleButton.tsx
│   └── HomeThemeToggleButton.tsx
└── styles/
    └── home.css

src/shared/
├── platform/windowChrome.ts
└── state/themeContext.ts
```

Navigation flow (unchanged):

```
Enter OpenCore → save preferences → resize window → setActiveScreen("home") → <HomeRoot />
```

Boot: if `onboarding_completed` is true, show `HomeRoot` directly.

Theme access from home uses `useThemeMode()` from `src/shared/state/themeContext.ts` (provided by `WelcomeProvider`). Platform detection uses `src/shared/platform/windowChrome.ts`.

## Layout

Classic holy grail, full viewport height:

- Outer column: header (full width) → body row → footer (full width)
- Body row: left panel | main panel | right panel
- Side panels: resizable via `--home-left-panel-width` / `--home-right-panel-width` (set on panel slot elements)
- Main: `flex-1 min-w-0 min-h-0 overflow-auto`
- Borders via `--welcome-border`, labels via `--welcome-fg-muted`
- Panel toggles collapse/expand left, right, and footer regions
- Content fades during resize between fade start (144px) and collapse threshold (72px)

## Out of Scope

- Real panel content
- React Router
- Lifting navigation to `App.tsx`

## Testing

- Domain tests for layout constants, opacity math, collapse thresholds, resize-end resolution, and panel open persistence
- Manual test plan in PR description (onboarding → home, panel toggles, resize, theme, window drag)
