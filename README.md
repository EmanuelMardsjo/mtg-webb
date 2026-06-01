# Move to Gothenburg — Design System Foundations

Token-driven design foundations for the future Move to Gothenburg digital platform. Foundations only — tokens, layout primitives, theming, motion, nine example blocks, and four example page assemblies in Storybook.

## Quick start

```bash
npm install
npm run tokens:build
npm run storybook
```

Open http://localhost:6006.

## Scripts

| Script                    | What it does                                                           |
| ------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`             | Vite dev server (port 5173). Builds tokens first.                      |
| `npm run build`           | Production build. Builds tokens, type-checks, then Vite build.         |
| `npm run storybook`       | Storybook dev (port 6006). Primary documentation surface.              |
| `npm run build-storybook` | Static Storybook build into `storybook-static/`.                       |
| `npm run tokens:build`    | Compile tokens to `src/tokens/generated/tokens.css` + types. AA gate.  |
| `npm test`                | Vitest unit + component tests.                                         |
| `npm run typecheck`       | `tsc -b --noEmit`.                                                     |
| `npm run lint`            | ESLint + Stylelint. Enforces no-hex / no-px in `src/system/`.          |

## Architecture (1-minute version)

- **`src/tokens/`** — typed TS source of truth (primitives → semantic → themes). `build.ts` emits `tokens.css` + types.
- **`src/system/primitives/`** — thin React layout primitives (Container, Section, Grid, Col, Stack, Inline, Text, Image, Divider, Icon, TextLink, Surface).
- **`src/system/hooks/`** — ThemeOverrideProvider + useThemeOverride, useReveal, useScrollFade, useHover.
- **`src/system/examples/`** — nine example blocks. Not production components.
- **`src/stories/foundations/`** — Storybook foundation stories + MDX docs.
- **`src/stories/pages/`** — four example page assemblies.

See `docs/superpowers/specs/2026-05-22-mtg-design-system-foundations-design.md` for the full spec.

## Discipline rules

1. No raw hex or px in `src/system/`. Use CSS vars from `tokens.css`.
2. Layout primitives are the only place that sets spacing, columns, or themes.
3. Theme variants remap semantic tokens — components never know which theme they are in.

## Tech

React 18 · Vite 5 · TypeScript 5 · Vitest · Storybook 8 · CSS Modules · PP Telegraf + PP Object Sans.
