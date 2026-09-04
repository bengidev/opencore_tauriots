# Nothing Design System

**Date:** 2026-09-04  
**Status:** Approved  
**Approach:** C — Component-first rewrite

## Summary

Implement the Nothing-inspired design system as the app-wide visual foundation. Features compose screens from shared UI primitives in `src/shared/ui/`; feature CSS retains layout and animation only. Dark and light modes are first-class peers. All interactive and structural elements use **0px border-radius** (sharp rectangles).

Scope includes foundation tokens, a shared component library, and migration of the welcome and home screens.

## Decisions

| Decision | Choice |
|----------|--------|
| Scope | Foundation + migrate welcome and home |
| Mode priority | Both dark and light equally |
| Corner radius | 0px everywhere — no rounded corners |
| Architecture | Component-first: build `shared/ui/` primitives, then refactor features to compose from them |
| CSS strategy | `ui.css` with BEM `.ds-*` classes; feature CSS is layout-only |

## Requirements

1. Semantic design tokens in `src/shared/styles/tokens.css` covering Nothing palette (surfaces, text, borders, accent, status, spacing, type scale, motion).
2. Load fonts: Space Grotesk, Space Mono (existing), Doto (new, display only).
3. Move theme logic from `welcomeTheme.ts` to `src/shared/theme/theme.ts` with expanded palette for canvas/inline use.
4. Import global styles from `src/main.tsx` (not the welcome feature barrel).
5. Fix `theme-boot.js` default to `"light"` to match `DEFAULT_THEME_MODE`.
6. Shared UI component library with 0px corners on all bordered/filled elements.
7. Migrate welcome screen to compose from shared components; strip `welcome.css` to layout/animation only.
8. Migrate home shell to compose from shared components; strip `home.css` to layout/animation only.
9. Remove duplicated icon SVGs and button implementations across features.
10. Preserve existing theme API: `applyThemeToDocument()`, `useThemeMode()`, `WelcomeProvider`.
11. Preserve holy grail layout behavior (resize, collapse, persistence, window chrome).
12. Respect `prefers-reduced-motion`.

## Architecture

```
src/
├── main.tsx                          # imports tokens, reset, motion
├── shared/
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── typography.css
│   │   ├── reset.css
│   │   └── motion.css
│   ├── theme/
│   │   ├── theme.ts                  # from welcomeTheme.ts
│   │   └── themeContext.ts           # unchanged
│   └── ui/
│       ├── index.ts
│       ├── ui.css
│       ├── Surface.tsx
│       ├── Button.tsx
│       ├── IconButton.tsx
│       ├── Label.tsx
│       ├── Tag.tsx
│       ├── Display.tsx
│       ├── Headline.tsx
│       ├── Body.tsx
│       ├── Caption.tsx
│       ├── StatusText.tsx
│       ├── AppTitle.tsx
│       ├── ThemeToggleButton.tsx
│       └── icons/
│           ├── SunIcon.tsx
│           ├── MoonIcon.tsx
│           ├── LeftPanelIcon.tsx
│           ├── RightPanelIcon.tsx
│           └── FooterPanelIcon.tsx
└── features/
    ├── welcome/
    │   ├── styles/welcome.css        # layout + animation only
    │   └── ui/                       # composes shared/ui
    └── home/
        ├── styles/home.css           # layout + animation only
        └── ui/                       # composes shared/ui
```

### Data flow (unchanged)

```
theme-boot.js (light default)
  → WelcomeRoot loads preferences
  → applyThemeToDocument(mode)
  → html[data-theme] sets CSS custom properties
  → Surface + components read tokens via ui.css
  → useThemeMode() for React state + toggle
```

## Design Tokens

### Color — dark mode

| Token | Value | Role |
|-------|-------|------|
| `--black` | `#000000` | Page background (OLED) |
| `--surface` | `#111111` | Elevated surfaces |
| `--surface-raised` | `#1A1A1A` | Secondary elevation |
| `--border` | `#222222` | Subtle dividers |
| `--border-visible` | `#333333` | Intentional borders |
| `--text-disabled` | `#666666` | Disabled, hints |
| `--text-secondary` | `#999999` | Labels, captions |
| `--text-primary` | `#E8E8E8` | Body text |
| `--text-display` | `#FFFFFF` | Headlines, hero |
| `--accent` | `#D71921` | Urgent/destructive |
| `--accent-subtle` | `rgba(215,25,33,0.15)` | Accent tint |
| `--success` | `#4A9E5C` | Confirmed |
| `--warning` | `#D4A843` | Caution |
| `--interactive` | `#5B9BF6` | Links, tappable text |

### Color — light mode

| Token | Value |
|-------|-------|
| `--black` | `#F5F5F5` |
| `--surface` | `#FFFFFF` |
| `--surface-raised` | `#F0F0F0` |
| `--border` | `#E8E8E8` |
| `--border-visible` | `#CCCCCC` |
| `--text-disabled` | `#999999` |
| `--text-secondary` | `#666666` |
| `--text-primary` | `#1A1A1A` |
| `--text-display` | `#000000` |
| `--interactive` | `#007AFF` |

Accent and status colors are identical across modes.

### Typography

| Token | Size | Font | Use |
|-------|------|------|-----|
| `--display-xl` | 72px | Doto | Hero numbers |
| `--display-lg` | 48px | Doto | Section heroes |
| `--display-md` | 36px | Doto | Page titles |
| `--heading` | 24px | Space Grotesk | Section headings |
| `--subheading` | 18px | Space Grotesk | Subsections |
| `--body` | 16px | Space Grotesk | Body text |
| `--body-sm` | 14px | Space Grotesk | Secondary body |
| `--caption` | 12px | Space Mono | Timestamps |
| `--label` | 11px | Space Mono | ALL CAPS labels |

### Spacing (8px base)

`--space-xs` (4px) through `--space-4xl` (96px).

### Motion

| Token | Value |
|-------|-------|
| `--ease-out` | `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| `--duration-fast` | `150ms` |
| `--duration-theme` | `220ms` |

### Shape

| Token | Value |
|-------|-------|
| `--radius` | `0` |

Applied globally to all components. No exceptions.

## Component Specifications

### Surface

Theme-aware background wrapper. Applies `--black` background and `--text-primary` color with theme transition. Replaces `.welcome-theme-surface`.

### Button

| Variant | Background | Border | Text |
|---------|-----------|--------|------|
| primary | `--text-display` | none | `--black` |
| secondary | transparent | `1px solid --border-visible` | `--text-primary` |
| ghost | transparent | none | `--text-secondary` |
| destructive | transparent | `1px solid --accent` | `--accent` |

- Font: Space Mono, 13px, ALL CAPS, 0.06em letter-spacing
- Min height: 44px
- Padding: 12px 24px
- Border-radius: 0
- Active: `scale(0.97)`
- Hover (fine pointer): opacity 0.82

### IconButton

- Sizes: `sm` (28×28px, home toolbar), `md` (44×44px, welcome)
- Border: `1px solid --border-visible`, border-radius 0
- `pressed={false}`: opacity 0.55
- Hover: border brightens, color → `--text-primary`
- Active: `scale(0.97)`

### Label

Bordered ALL CAPS rectangle. Space Mono, `--label` size, `--text-secondary` color, `1px solid --border-visible`, padding 4px 12px, border-radius 0.

### Tag

Same as Label but for inline chips. Optional `active` state inverts border + text to `--text-display`.

### Display

Doto font at `--display-md` or larger. Tight tracking. For welcome headline and future hero metrics.

### Headline / Body / Caption

Space Grotesk (Headline, Body) and Space Mono (Caption) typography wrappers mapping to token sizes. Body uses `--text-primary` at 0.9 opacity for secondary emphasis.

### StatusText

Inline bracket text. Space Mono, `--caption` size.

| Variant | Color | Format |
|---------|-------|--------|
| error | `--accent` | `[ERROR: message]` |
| loading | `--text-secondary` | `[LOADING]` |
| info | `--text-secondary` | `[message]` |

No toasts. No red backgrounds.

### AppTitle

Composes title mark (Space Grotesk, `--subheading` weight 500) + `Label` subtitle. Optional `dragRegion` prop sets `data-tauri-drag-region`.

### ThemeToggleButton

Uses `useThemeMode()`. Props:

- `showLabel` (default false): when true, renders as `Button variant="secondary"` with icon + "Light"/"Dark" text (welcome). When false, renders as `IconButton` with sun/moon icon only (home).

## Feature Migration

### Welcome

**Compose:**

```tsx
<Surface className="welcome-screen">
  <header className="welcome-header">
    <AppTitle title="OpenCore" subtitle="LOCAL AI WORKSPACE" dragRegion />
    <ThemeToggleButton showLabel />
  </header>
  <section className="welcome-hero-section">
    <WelcomeCubeHeroCanvas />
    <Display as="h1">Your local AI command workspace</Display>
    <Body>...</Body>
  </section>
  <footer className="welcome-footer">
    {error ? <StatusText variant="error">{error}</StatusText> : <Caption>Press Enter</Caption>}
    <Button variant="primary">Enter OpenCore</Button>
  </footer>
</Surface>
```

**Delete:** `WelcomeControls.tsx`  
**Strip from welcome.css:** color vars, font rules, button/toggle/label styles, `.welcome-theme-*` utilities  
**Keep in welcome.css:** grid layout, hero sizing, enter animations, mac overlay inset, global reset (moved to reset.css)

### Home

**Compose:**

```tsx
<IconButton size="sm" pressed={expanded} icon={<LeftPanelIcon />} aria-label="..." />
<AppTitle title="OpenCore" subtitle="LOCAL AI WORKSPACE" />
<ThemeToggleButton />
<Label>Left Panel</Label>
```

**Delete:** `HomePanelToggleButton.tsx`, `HomeThemeToggleButton.tsx`  
**Strip from home.css:** `.home-panel-toggle`, `.home-shell-label`, title typography, color references to `--welcome-*`  
**Keep in home.css:** holy grail grid, panel resize/collapse, container queries, footer slot animation

### DevResetFab

Migrate to `Button variant="secondary"`. Remove `backdrop-filter: blur`. Flat `--surface-raised` background.

### Theme shim

`src/features/welcome/domain/welcomeTheme.ts` re-exports from `shared/theme/theme.ts` during migration, then deleted once all imports updated.

## Implementation Phases

| Phase | Work |
|-------|------|
| 1 — Foundation | tokens.css, typography.css, reset.css, motion.css; theme.ts migration; theme-boot.js fix; main.tsx imports; add @fontsource/doto |
| 2 — Primitives | Surface, Button, IconButton, Label, Tag, Display, Headline, Body, Caption, StatusText, ui.css, icons |
| 3 — Composed | AppTitle, ThemeToggleButton |
| 4 — Welcome | Refactor WelcomeScreen; delete WelcomeControls; strip welcome.css |
| 5 — Home | Refactor HomeShellHeader, HolyGrailLayout; delete panel/theme toggle files; strip home.css |
| 6 — Cleanup | Delete welcomeTheme.ts shim; remove dead CSS; update tests |

## Out of Scope

- Form inputs (Input, Select, Textarea)
- Segmented controls, progress bars, modals, dropdowns
- React Router
- Navigation flow changes
- Real panel content

## Testing

1. Unit tests for `Button` variant class application and `Label` rendering.
2. Existing `homeLayoutConstants` tests unchanged.
3. Manual verification:
   - Welcome screen in dark and light mode
   - Home shell in dark and light mode
   - Theme toggle persists across restart
   - No dark flash on boot (light default)
   - `prefers-reduced-motion` disables transitions
   - Keyboard Enter on welcome still works
   - Panel resize/collapse unchanged

## Anti-Patterns (enforced)

- No border-radius > 0 on any element
- No shadows, blur, or gradients in UI chrome
- No toasts — use StatusText
- No skeleton loaders — use StatusText `[LOADING]`
- No filled or multi-color icons
- No pill-shaped buttons or tags
