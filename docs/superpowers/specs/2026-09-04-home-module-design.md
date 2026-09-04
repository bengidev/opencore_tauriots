# Home Module Design

**Date:** 2026-09-04  
**Status:** Approved

## Summary

Create a new `home` feature module with a classic 5-region holy grail layout. When the user clicks "Enter OpenCore" (or presses Enter on the welcome screen), navigate to the home module. Reuse the existing welcome theme system.

## Requirements

1. New feature module at `src/features/home/`
2. Classic holy grail: header, footer, left sidebar, right sidebar, center main
3. Each region shows a placeholder label only
4. Reuse existing `data-theme` CSS variables and `welcome-theme-surface` utility
5. Navigation: welcome `WelcomeRoot` renders `HomeRoot` when `activeScreen === "home"` (existing flow)
6. Remove `HomePlaceholder` from welcome module

## Architecture

```
src/features/home/
├── index.ts
├── ui/
│   ├── HomeRoot.tsx
│   └── HolyGrailLayout.tsx
└── styles/
    └── home.css
```

Navigation flow (unchanged):

```
Enter OpenCore → save preferences → resize window → setActiveScreen("home") → <HomeRoot />
```

Boot: if `onboarding_completed` is true, show `HomeRoot` directly.

## Layout

Classic holy grail, full viewport height:

- Outer column: header (full width) → body row → footer (full width)
- Body row: left panel | main panel | right panel
- Side panels: resizable via `--home-left-panel-width` / `--home-right-panel-width`
- Main: `flex-1 min-w-0 min-h-0 overflow-auto`
- Borders via `--welcome-border`, labels via `--welcome-fg-muted`

## Out of Scope

- Collapsible sidebars
- Real panel content
- React Router
- Lifting navigation to `App.tsx`
- New tests (layout scaffold only)
