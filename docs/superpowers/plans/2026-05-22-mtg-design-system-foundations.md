# Move to Gothenburg Design System Foundations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the token-driven design system foundations for the Move to Gothenburg digital platform — tokens (primitive → semantic → themes), layout primitives, theme override system, motion hooks, nine example blocks, and a full Storybook documentation surface with four example page assemblies.

**Architecture:** Single Vite + React 18 + TypeScript repo. Tokens defined as typed TS source under `src/tokens/`, compiled by a small `build.ts` script to `tokens.css` (CSS custom properties under `[data-theme="x"]` blocks) and `tokens.types.ts`. Thin React layout primitives under `src/system/primitives/` consume only the CSS vars. Example blocks under `src/system/examples/` compose primitives. Storybook 8.x is the documentation surface; example pages are full-viewport Storybook stories. Themes are unified via a single `data-theme` cascade (no separate light/dark axis); a `useThemeOverride` hook allows page-wide reskin from interactive state via a stack-based provider.

**Tech Stack:** React 18, Vite 5, TypeScript 5, Vitest, @testing-library/react, jsdom, Storybook 8.x (`@storybook/react-vite`), `@storybook/addon-a11y`, ESLint 9, Stylelint 16, axe-core, CSS Modules, Cabinet Grotesk + Satoshi (Fontshare, self-hosted WOFF2).

**Reference:** Approved spec at `docs/superpowers/specs/2026-05-22-mtg-design-system-foundations-design.md` (commit `c70b06b`).

---

## Conventions

- **Package manager:** `npm` (lockfile committed).
- **Test runner:** Vitest. `npm test` runs all tests. `npm test -- src/path/file.test.ts` runs one file.
- **Type check:** `npm run typecheck` (alias for `tsc --noEmit`).
- **Lint:** `npm run lint` (ESLint + Stylelint). Custom rules enforce the no-hex / no-px rules inside `src/system/`.
- **Token build:** `npm run tokens:build` (runs `tsx src/tokens/build.ts`). Hooked into `predev` and `prebuild`.
- **Storybook:** `npm run storybook` (dev), `npm run build-storybook` (static).
- **Commit style:** Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, `style:`). Frequent commits — one per task by default.
- **No raw values in `src/system/`:** Hex literals and `Npx` numbers banned by ESLint + Stylelint rules. Use CSS vars.
- **TDD:** Where logic exists, write the failing test first. Pure data files (token primitives) have no behavior to test — skip TDD steps for those; the build pipeline tests verify correctness end-to-end.

---

# Phase 1 — Project Scaffolding

## Task 1: Initialize Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `.gitignore`, `.nvmrc`

- [ ] **Step 1: Scaffold via Vite template**

```bash
cd "/Users/emanuelmardsjo/Documents/Digital Designer/Move To Gothenburg/Concept/mtg-webb"
npm create vite@latest . -- --template react-ts
```

When prompted to overwrite the empty git-initialised directory, accept. Then:

```bash
npm install
```

- [ ] **Step 2: Pin Node version**

Create `.nvmrc`:

```
20
```

- [ ] **Step 3: Add npm scripts to `package.json`**

Edit `package.json` so the `scripts` block reads:

```json
"scripts": {
  "dev": "npm run tokens:build && vite",
  "build": "npm run tokens:build && tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc -b --noEmit",
  "lint": "eslint . && stylelint \"src/**/*.css\"",
  "test": "vitest run",
  "test:watch": "vitest",
  "tokens:build": "tsx src/tokens/build.ts",
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
}
```

- [ ] **Step 4: Verify dev server starts**

Run: `npm run dev`
Expected: Vite serves at `http://localhost:5173` and the default React landing page renders.

Stop the server (Ctrl-C).

- [ ] **Step 5: Update `.gitignore`**

Append to `.gitignore`:

```
# Token build artifacts
src/tokens/generated/

# Storybook
storybook-static/

# Editor
.vscode/
.idea/

# OS
.DS_Store
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "chore: scaffold Vite + React + TypeScript project"
```

---

## Task 2: Install testing toolchain (Vitest + Testing Library + jsdom)

**Files:**
- Modify: `package.json`, `vite.config.ts`
- Create: `src/test/setup.ts`, `tsconfig.vitest.json`

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/node tsx
```

- [ ] **Step 2: Configure Vitest in `vite.config.ts`**

Replace `vite.config.ts` with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tokens': path.resolve(__dirname, 'src/tokens'),
      '@system': path.resolve(__dirname, 'src/system')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    include: ['src/**/*.test.{ts,tsx}']
  }
} as any)
```

- [ ] **Step 3: Add test setup file**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Update `tsconfig.json`**

Add to `compilerOptions`:

```json
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"],
  "@tokens/*": ["src/tokens/*"],
  "@system/*": ["src/system/*"]
},
"types": ["vitest/globals", "@testing-library/jest-dom"]
```

- [ ] **Step 5: Add a smoke test to prove the toolchain works**

Create `src/test/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('toolchain', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: Run the smoke test**

Run: `npm test`
Expected: 1 test passes.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore: add Vitest + Testing Library toolchain"
```

---

## Task 3: Configure ESLint with no-hex / no-px restrictions for `src/system/`

**Files:**
- Modify: `eslint.config.js` (created by Vite template) or create if absent
- Create: `.stylelintrc.json`

- [ ] **Step 1: Install lint dependencies**

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals stylelint stylelint-config-standard
```

- [ ] **Step 2: Replace `eslint.config.js`**

Replace contents with:

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'storybook-static', 'src/tokens/generated'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
    }
  },
  // No-hex / no-px discipline inside src/system/
  {
    files: ['src/system/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
          message: 'Raw hex colors are banned in src/system/. Use a CSS variable from tokens.css.'
        },
        {
          selector: "TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}/]",
          message: 'Raw hex colors are banned in src/system/ template literals. Use a CSS variable.'
        },
        {
          selector: "Literal[value=/\\b\\d+px\\b/]",
          message: 'Raw px values are banned in src/system/. Use a spacing/sizing token.'
        }
      ]
    }
  }
)
```

- [ ] **Step 3: Add stylelint config**

Create `.stylelintrc.json`:

```json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "color-no-hex": [true, { "severity": "error" }],
    "custom-property-pattern": "^[a-z][a-zA-Z0-9-]*$",
    "selector-class-pattern": null
  },
  "overrides": [
    {
      "files": ["src/tokens/**/*.css", "src/tokens/generated/**/*.css"],
      "rules": {
        "color-no-hex": null
      }
    }
  ]
}
```

- [ ] **Step 4: Run lint to verify no current violations**

Run: `npm run lint`
Expected: passes (Vite template files have no hex/px in src/system/ because that folder doesn't exist yet).

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "chore: configure ESLint + Stylelint with no-hex/no-px rules for src/system/"
```

---

## Task 4: Establish source tree skeleton

**Files:**
- Create: empty directories with `.gitkeep` files for: `src/tokens/primitives/`, `src/tokens/semantic/`, `src/tokens/themes/`, `src/tokens/generated/`, `src/system/primitives/`, `src/system/hooks/`, `src/system/examples/`, `src/system/styles/`, `src/stories/foundations/`, `src/stories/pages/`, `public/fonts/`

- [ ] **Step 1: Create directory skeleton**

```bash
mkdir -p src/tokens/{primitives,semantic,themes,generated} src/system/{primitives,hooks,examples,styles} src/stories/{foundations,pages} public/fonts
touch src/tokens/primitives/.gitkeep src/tokens/semantic/.gitkeep src/tokens/themes/.gitkeep src/system/primitives/.gitkeep src/system/hooks/.gitkeep src/system/examples/.gitkeep src/system/styles/.gitkeep src/stories/foundations/.gitkeep src/stories/pages/.gitkeep public/fonts/.gitkeep
```

Note `src/tokens/generated/` is gitignored so no `.gitkeep` needed.

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "chore: scaffold source tree skeleton"
```

---

# Phase 2 — Token Primitives

Token primitive files are pure data (TypeScript constants). No TDD; the build pipeline tests (Phase 5) verify correctness end-to-end.

## Task 5: Color primitives

**Files:**
- Create: `src/tokens/primitives/color.ts`

- [ ] **Step 1: Create file**

```ts
// src/tokens/primitives/color.ts
// Raw color values. Components must NEVER consume these directly —
// they reach color only via semantic roles in src/tokens/semantic/color.ts.

export const palette = {
  bone: {
    50:  '#FBF8F3',
    100: '#F5EFE5',
    200: '#EBE3D2'
  },
  navy: {
    700: '#1B2740',
    800: '#121A2E',
    900: '#0A1020'
  },
  sky: {
    100: '#E6EDF5',
    200: '#C9D6E6',
    400: '#7C9BBE',
    600: '#3D5878'   // reserved for future deeper-tinted themes
  },
  clay: {
    100: '#F4E4D3',
    200: '#E8C8AC',
    400: '#C68C66',
    600: '#86553A'   // reserved
  },
  sage: {
    100: '#E5EADC',
    200: '#C7D2B7',
    400: '#869670',
    600: '#4F5C40'   // reserved
  }
} as const

export const status = {
  success: '#3F6B4A',
  warning: '#7A5A1F',
  danger:  '#7A3A2A',
  info:    palette.sky[400]
} as const

export const overlay = {
  ink:   'rgba(10, 16, 32, 0.6)',
  scrim: 'rgba(10, 16, 32, 0.85)',
  bone:  'rgba(251, 248, 243, 0.85)'
} as const

export type PaletteFamily = keyof typeof palette
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/tokens/primitives/color.ts
git commit -m "feat(tokens): add color primitives"
```

---

## Task 6: Typography primitives

**Files:**
- Create: `src/tokens/primitives/type.ts`

- [ ] **Step 1: Create file**

```ts
// src/tokens/primitives/type.ts

export const fontFamily = {
  display: `'Cabinet Grotesk', 'Inter', system-ui, sans-serif`,
  body:    `'Satoshi', 'Inter', system-ui, sans-serif`
} as const

export const fontWeight = {
  // Cabinet Grotesk
  'display-light':  300,
  'display-medium': 500,
  // Satoshi
  'body-regular':   400,
  'body-medium':    500
} as const

// Fluid clamp() scale — readable from 320px to 2560px viewport.
export const fontSize = {
  '3xs': 'clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem)',
  '2xs': 'clamp(0.8125rem, 0.75rem + 0.3vw, 0.875rem)',
  'xs':  'clamp(0.875rem, 0.8rem + 0.4vw, 0.9375rem)',
  'sm':  'clamp(0.9375rem, 0.85rem + 0.5vw, 1rem)',
  'md':  'clamp(1rem, 0.95rem + 0.5vw, 1.125rem)',
  'lg':  'clamp(1.125rem, 1rem + 0.8vw, 1.375rem)',
  'xl':  'clamp(1.375rem, 1.1rem + 1.5vw, 1.875rem)',
  '2xl': 'clamp(1.75rem, 1.3rem + 2.5vw, 2.75rem)',
  '3xl': 'clamp(2.25rem, 1.5rem + 4vw, 4rem)',
  '4xl': 'clamp(2.75rem, 1.8rem + 6vw, 5.5rem)',
  '5xl': 'clamp(3.25rem, 2rem + 8vw, 7.5rem)'
} as const

export const lineHeight = {
  none:    '1',
  display: '0.95',
  hero:    '1.0',
  h1:      '1.05',
  h2:      '1.1',
  h3:      '1.15',
  quote:   '1.3',
  body:    '1.55',
  lead:    '1.45',
  meta:    '1.4',
  tag:     '1.2',
  button:  '1.0'
} as const

export const tracking = {
  display: '-0.02em',
  hero:    '-0.015em',
  h1:      '-0.01em',
  h2:      '-0.005em',
  none:    '0',
  caption: '0.01em',
  button:  '0.02em',
  tag:     '0.08em',
  quote:   '-0.005em'
} as const

export type FontSizeKey   = keyof typeof fontSize
export type FontFamilyKey = keyof typeof fontFamily
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/tokens/primitives/type.ts
git commit -m "feat(tokens): add typography primitives"
```

---

## Task 7: Spacing and sizing primitives

**Files:**
- Create: `src/tokens/primitives/space.ts`, `src/tokens/primitives/size.ts`

- [ ] **Step 1: Create `space.ts`**

```ts
// src/tokens/primitives/space.ts
// Base unit 4px. Twelve steps, editorial breathing-room friendly.

export const space = {
  0:  '0',
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '24px',
  6:  '32px',
  7:  '48px',
  8:  '64px',
  9:  '96px',
  10: '128px',
  11: '192px',
  12: '256px'
} as const

export type SpaceKey = keyof typeof space
```

- [ ] **Step 2: Create `size.ts`**

```ts
// src/tokens/primitives/size.ts
// Fixed-size primitives for icons, avatars, frames.

export const size = {
  '3xs': '12px',
  '2xs': '16px',
  'xs':  '20px',
  'sm':  '24px',
  'md':  '32px',
  'lg':  '48px',
  'xl':  '64px',
  '2xl': '96px',
  '3xl': '128px'
} as const

export const iconSize = {
  sm: '16px',
  md: '20px',
  lg: '28px'
} as const

export type SizeKey = keyof typeof size
export type IconSizeKey = keyof typeof iconSize
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/tokens/primitives/space.ts src/tokens/primitives/size.ts
git commit -m "feat(tokens): add spacing and sizing primitives"
```

---

## Task 8: Layout, radius, border, motion, opacity, z primitives

**Files:**
- Create: `src/tokens/primitives/breakpoint.ts`, `src/tokens/primitives/radius.ts`, `src/tokens/primitives/border.ts`, `src/tokens/primitives/motion.ts`, `src/tokens/primitives/opacity.ts`, `src/tokens/primitives/z.ts`

- [ ] **Step 1: Create `breakpoint.ts`**

```ts
// src/tokens/primitives/breakpoint.ts
export const breakpoint = {
  sm: '0px',
  md: '768px',
  lg: '1200px'
} as const

export type BreakpointKey = keyof typeof breakpoint
```

- [ ] **Step 2: Create `radius.ts`**

```ts
// src/tokens/primitives/radius.ts
export const radius = {
  none: '0',
  xs:   '2px',
  sm:   '4px',
  md:   '8px',
  lg:   '16px',
  pill: '9999px',
  full: '50%'
} as const

export type RadiusKey = keyof typeof radius
```

- [ ] **Step 3: Create `border.ts`**

```ts
// src/tokens/primitives/border.ts
export const borderWidth = {
  hairline: '1px',
  thin:     '1px',
  strong:   '2px'
} as const

export type BorderWidthKey = keyof typeof borderWidth
```

- [ ] **Step 4: Create `motion.ts`**

```ts
// src/tokens/primitives/motion.ts
export const duration = {
  instant: '0ms',
  micro:   '120ms',
  fast:    '200ms',
  base:    '320ms',
  slow:    '500ms',
  ambient: '900ms'
} as const

export const easing = {
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
  enter:    'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
  exit:     'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
  emphasis: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
  linear:   'linear'
} as const

export type DurationKey = keyof typeof duration
export type EasingKey   = keyof typeof easing
```

- [ ] **Step 5: Create `opacity.ts`**

```ts
// src/tokens/primitives/opacity.ts
export const opacity = {
  0:   '0',
  25:  '0.25',
  50:  '0.5',
  75:  '0.75',
  100: '1'
} as const

export type OpacityKey = keyof typeof opacity
```

- [ ] **Step 6: Create `z.ts`**

```ts
// src/tokens/primitives/z.ts
export const z = {
  base:    '0',
  raised:  '1',
  sticky:  '10',
  overlay: '50',
  modal:   '100',
  toast:   '200'
} as const

export type ZKey = keyof typeof z
```

- [ ] **Step 7: Typecheck**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 8: Commit**

```bash
git add src/tokens/primitives/
git commit -m "feat(tokens): add layout, radius, border, motion, opacity, z primitives"
```

---

# Phase 3 — Semantic Tokens

Semantic tokens describe usage and intent. Components only consume these. Pure data; no TDD here.

## Task 9: Semantic color roles

**Files:**
- Create: `src/tokens/semantic/color.ts`

- [ ] **Step 1: Create file**

```ts
// src/tokens/semantic/color.ts
// Default theme = bone. Each semantic role references a primitive.
// Other themes (Phase 4) override these mappings.

import { palette, status, overlay } from '../primitives/color'

export const colorRoles = {
  // Surfaces
  'surface-page':    palette.bone[50],
  'surface-raised':  palette.bone[100],
  // Text
  'text-strong':     palette.navy[900],
  'text-default':    palette.navy[800],
  'text-muted':      palette.navy[700],
  'text-on-ink':     palette.bone[50],
  // Borders (currentColor-mixed for theme adaptability)
  'border-subtle':   'color-mix(in oklch, currentColor 10%, transparent)',
  'border-strong':   'color-mix(in oklch, currentColor 20%, transparent)',
  // Accent / focus
  'focus-ring':      palette.sky[400],
  'accent-line':     palette.sky[400],
  // Status (utility)
  'status-success':  status.success,
  'status-warning':  status.warning,
  'status-danger':   status.danger,
  'status-info':     status.info,
  // Overlays
  'overlay-ink':     overlay.ink,
  'overlay-scrim':   overlay.scrim,
  'overlay-bone':    overlay.bone
} as const

export type ColorRoleKey = keyof typeof colorRoles
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/tokens/semantic/color.ts
git commit -m "feat(tokens): add semantic color roles (default bone theme)"
```

---

## Task 10: Semantic typography roles

**Files:**
- Create: `src/tokens/semantic/type.ts`

- [ ] **Step 1: Create file**

```ts
// src/tokens/semantic/type.ts
// Thirteen semantic text roles. <Text role="..."> consumes these.

import type { FontSizeKey, FontFamilyKey } from '../primitives/type'

export type TextRole =
  | 'display' | 'hero' | 'h1' | 'h2' | 'h3'
  | 'lead' | 'body' | 'body-sm'
  | 'caption' | 'meta' | 'tag' | 'quote' | 'button'

type RoleDef = {
  family:    FontFamilyKey
  size:      FontSizeKey
  leading:   string
  tracking:  string
  weight:    number
  transform?: 'uppercase'
  style?:     'italic'
}

export const textRoles: Record<TextRole, RoleDef> = {
  display:   { family: 'display', size: '5xl', leading: '0.95',  tracking: '-0.02em',  weight: 500 },
  hero:      { family: 'display', size: '4xl', leading: '1.0',   tracking: '-0.015em', weight: 500 },
  h1:        { family: 'display', size: '3xl', leading: '1.05',  tracking: '-0.01em',  weight: 500 },
  h2:        { family: 'display', size: '2xl', leading: '1.1',   tracking: '-0.005em', weight: 500 },
  h3:        { family: 'display', size: 'xl',  leading: '1.15',  tracking: '0',        weight: 500 },
  lead:      { family: 'body',    size: 'lg',  leading: '1.45',  tracking: '0',        weight: 400 },
  body:      { family: 'body',    size: 'md',  leading: '1.55',  tracking: '0',        weight: 400 },
  'body-sm': { family: 'body',    size: 'sm',  leading: '1.55',  tracking: '0',        weight: 400 },
  caption:   { family: 'body',    size: 'xs',  leading: '1.4',   tracking: '0.01em',   weight: 400 },
  meta:      { family: 'body',    size: 'xs',  leading: '1.4',   tracking: '0',        weight: 400 },
  tag:       { family: 'body',    size: '2xs', leading: '1.2',   tracking: '0.08em',   weight: 500, transform: 'uppercase' },
  quote:     { family: 'display', size: 'xl',  leading: '1.3',   tracking: '-0.005em', weight: 400, style: 'italic' },
  button:    { family: 'body',    size: 'sm',  leading: '1.0',   tracking: '0.02em',   weight: 500 }
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/tokens/semantic/type.ts
git commit -m "feat(tokens): add semantic typography roles"
```

---

## Task 11: Semantic spacing roles

**Files:**
- Create: `src/tokens/semantic/space.ts`

- [ ] **Step 1: Create file**

```ts
// src/tokens/semantic/space.ts
// Components only consume these. Never reach for space[N] directly.

import { space } from '../primitives/space'

export const spaceRoles = {
  // Section vertical rhythm
  'section-y-sm':     space[7],   // 48
  'section-y-md':     space[9],   // 96
  'section-y-lg':     space[10],  // 128
  'section-y-xl':     space[11],  // 192
  // Stack (vertical) gaps
  'stack-tight':      space[2],
  'stack-snug':       space[3],
  'stack-default':    space[4],
  'stack-loose':      space[5],
  'stack-xl':         space[7],
  // Inline (horizontal) gaps
  'inline-tight':     space[1],
  'inline-default':   space[2],
  'inline-loose':     space[4],
  // Grid gutters
  'grid-gutter-sm':   space[4],
  'grid-gutter-md':   space[5],
  'grid-gutter-lg':   space[6],
  // Container horizontal padding
  'container-pad-sm': space[4],
  'container-pad-md': space[6],
  'container-pad-lg': space[8],
  // Content
  'content-gap':      space[6]
} as const

export type SpaceRoleKey = keyof typeof spaceRoles
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/tokens/semantic/space.ts
git commit -m "feat(tokens): add semantic spacing roles"
```

---

## Task 12: Semantic motion roles

**Files:**
- Create: `src/tokens/semantic/motion.ts`

- [ ] **Step 1: Create file**

```ts
// src/tokens/semantic/motion.ts

import type { DurationKey, EasingKey } from '../primitives/motion'

export type MotionRole =
  | 'hover' | 'press' | 'state-change'
  | 'entrance' | 'reveal' | 'scroll-fade' | 'surface-swap'

export const motionRoles: Record<MotionRole, { duration: DurationKey; easing: EasingKey }> = {
  hover:           { duration: 'micro',   easing: 'standard' },
  press:           { duration: 'instant', easing: 'standard' },
  'state-change':  { duration: 'fast',    easing: 'standard' },
  entrance:        { duration: 'base',    easing: 'enter' },
  reveal:          { duration: 'slow',    easing: 'emphasis' },
  'scroll-fade':   { duration: 'slow',    easing: 'enter' },
  'surface-swap':  { duration: 'base',    easing: 'standard' }
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/tokens/semantic/motion.ts
git commit -m "feat(tokens): add semantic motion roles"
```

---

# Phase 4 — Themes

## Task 13: Theme definitions

**Files:**
- Create: `src/tokens/themes/index.ts`

- [ ] **Step 1: Create file**

```ts
// src/tokens/themes/index.ts
// Each theme is a complete remap of semantic color roles.
// Themes are peers — there is no separate light/dark axis.

import { palette } from '../primitives/color'

export type ThemeName =
  | 'bone' | 'bone-raised'
  | 'sky' | 'clay' | 'sage'
  | 'ink'
  | 'campaign'

type ThemeColors = {
  'surface-page':   string
  'surface-raised': string
  'text-strong':    string
  'text-default':   string
  'text-muted':     string
  'border-subtle':  string
  'border-strong':  string
  'focus-ring':     string
  'accent-line':    string
}

export const themes: Record<ThemeName, ThemeColors> = {
  bone: {
    'surface-page':   palette.bone[50],
    'surface-raised': palette.bone[100],
    'text-strong':    palette.navy[900],
    'text-default':   palette.navy[800],
    'text-muted':     palette.navy[700],
    'border-subtle':  'color-mix(in oklch, currentColor 10%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 20%, transparent)',
    'focus-ring':     palette.sky[400],
    'accent-line':    palette.sky[400]
  },
  'bone-raised': {
    'surface-page':   palette.bone[100],
    'surface-raised': palette.bone[200],
    'text-strong':    palette.navy[900],
    'text-default':   palette.navy[800],
    'text-muted':     palette.navy[700],
    'border-subtle':  'color-mix(in oklch, currentColor 10%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 20%, transparent)',
    'focus-ring':     palette.sky[400],
    'accent-line':    palette.sky[400]
  },
  sky: {
    'surface-page':   palette.sky[100],
    'surface-raised': palette.sky[200],
    'text-strong':    palette.navy[900],
    'text-default':   palette.navy[900],
    'text-muted':     palette.navy[800],
    'border-subtle':  'color-mix(in oklch, currentColor 14%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 22%, transparent)',
    'focus-ring':     palette.navy[900],
    'accent-line':    palette.navy[900]
  },
  clay: {
    'surface-page':   palette.clay[100],
    'surface-raised': palette.clay[200],
    'text-strong':    palette.navy[900],
    'text-default':   palette.navy[900],
    'text-muted':     palette.navy[800],
    'border-subtle':  'color-mix(in oklch, currentColor 14%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 22%, transparent)',
    'focus-ring':     palette.navy[900],
    'accent-line':    palette.navy[900]
  },
  sage: {
    'surface-page':   palette.sage[100],
    'surface-raised': palette.sage[200],
    'text-strong':    palette.navy[900],
    'text-default':   palette.navy[900],
    'text-muted':     palette.navy[800],
    'border-subtle':  'color-mix(in oklch, currentColor 14%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 22%, transparent)',
    'focus-ring':     palette.navy[900],
    'accent-line':    palette.navy[900]
  },
  ink: {
    'surface-page':   palette.navy[900],
    'surface-raised': palette.navy[800],
    'text-strong':    palette.bone[50],
    'text-default':   palette.bone[50],
    'text-muted':     'color-mix(in oklch, ' + palette.bone[50] + ' 75%, transparent)',
    'border-subtle':  'color-mix(in oklch, currentColor 12%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 24%, transparent)',
    'focus-ring':     palette.sky[400],
    'accent-line':    palette.sky[400]
  },
  // Runtime-variable theme. Falls back to bone if --campaign-* vars are unset.
  campaign: {
    'surface-page':   'var(--campaign-surface, ' + palette.bone[50] + ')',
    'surface-raised': 'var(--campaign-surface-raised, ' + palette.bone[100] + ')',
    'text-strong':    'var(--campaign-text-strong, ' + palette.navy[900] + ')',
    'text-default':   'var(--campaign-text, ' + palette.navy[800] + ')',
    'text-muted':     'var(--campaign-text-muted, ' + palette.navy[700] + ')',
    'border-subtle':  'color-mix(in oklch, currentColor 10%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 20%, transparent)',
    'focus-ring':     'var(--campaign-focus-ring, ' + palette.sky[400] + ')',
    'accent-line':    'var(--campaign-accent, ' + palette.sky[400] + ')'
  }
}

export const themeNames: ThemeName[] = ['bone', 'bone-raised', 'sky', 'clay', 'sage', 'ink', 'campaign']
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/tokens/themes/index.ts
git commit -m "feat(tokens): add theme definitions (bone, bone-raised, sky, clay, sage, ink, campaign)"
```

---

# Phase 5 — Token Build Pipeline

## Task 14: Contrast checker (TDD)

**Files:**
- Create: `src/tokens/build/contrast.ts`, `src/tokens/build/contrast.test.ts`

- [ ] **Step 1: Write failing test**

Create `src/tokens/build/contrast.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { contrastRatio, passesAA } from './contrast'

describe('contrast', () => {
  it('reports max contrast for black vs white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0)
  })

  it('reports min contrast for identical colors', () => {
    expect(contrastRatio('#888888', '#888888')).toBeCloseTo(1, 1)
  })

  it('passes AA when ratio >= 4.5', () => {
    expect(passesAA('#0A1020', '#FBF8F3')).toBe(true)
  })

  it('fails AA when ratio < 4.5', () => {
    expect(passesAA('#999999', '#AAAAAA')).toBe(false)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/tokens/build/contrast.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement contrast.ts**

Create `src/tokens/build/contrast.ts`:

```ts
// WCAG 2.1 relative luminance + contrast ratio.

function srgbToLinear(c: number): number {
  c = c / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace('#', '').match(/.{1,2}/g)
  if (!m || m.length < 3) throw new Error(`invalid hex: ${hex}`)
  return [parseInt(m[0], 16), parseInt(m[1], 16), parseInt(m[2], 16)]
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export function passesAA(fg: string, bg: string): boolean {
  return contrastRatio(fg, bg) >= 4.5
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- src/tokens/build/contrast.test.ts`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/tokens/build/contrast.ts src/tokens/build/contrast.test.ts
git commit -m "feat(tokens): add WCAG contrast checker"
```

---

## Task 15: Token build script — emit tokens.css

**Files:**
- Create: `src/tokens/build.ts`, `src/tokens/build/emit.ts`, `src/tokens/build/emit.test.ts`

- [ ] **Step 1: Write failing test for emitter**

Create `src/tokens/build/emit.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { emitTokensCss } from './emit'

describe('emitTokensCss', () => {
  const css = emitTokensCss()

  it('includes :root + [data-theme="bone"] block', () => {
    expect(css).toMatch(/:root,\s*\[data-theme="bone"\]/)
  })

  it('emits every primitive color as a CSS var', () => {
    expect(css).toContain('--bone-50:')
    expect(css).toContain('--navy-900:')
    expect(css).toContain('--sky-400:')
  })

  it('emits semantic surface var', () => {
    expect(css).toContain('--color-surface-page:')
  })

  it('emits a block per theme', () => {
    expect(css).toMatch(/\[data-theme="ink"\]/)
    expect(css).toMatch(/\[data-theme="clay"\]/)
    expect(css).toMatch(/\[data-theme="campaign"\]/)
  })

  it('emits motion role vars', () => {
    expect(css).toContain('--motion-hover-duration:')
    expect(css).toContain('--motion-hover-easing:')
  })

  it('emits fluid font-size vars', () => {
    expect(css).toContain('--fs-3xl:')
    expect(css).toMatch(/--fs-3xl:\s*clamp\(/)
  })

  it('emits space role vars', () => {
    expect(css).toContain('--space-section-y-lg:')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/tokens/build/emit.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement emit.ts**

Create `src/tokens/build/emit.ts`:

```ts
import { palette, status, overlay } from '../primitives/color'
import { fontFamily, fontSize, lineHeight, tracking, fontWeight } from '../primitives/type'
import { space } from '../primitives/space'
import { size, iconSize } from '../primitives/size'
import { breakpoint } from '../primitives/breakpoint'
import { radius } from '../primitives/radius'
import { borderWidth } from '../primitives/border'
import { duration, easing } from '../primitives/motion'
import { opacity } from '../primitives/opacity'
import { z } from '../primitives/z'
import { spaceRoles } from '../semantic/space'
import { motionRoles } from '../semantic/motion'
import { themes, themeNames, type ThemeName } from '../themes'

function indent(s: string, n = 2): string {
  const pad = ' '.repeat(n)
  return s.split('\n').map(l => l ? pad + l : l).join('\n')
}

function vars(record: Record<string, string>, prefix = ''): string {
  return Object.entries(record)
    .map(([k, v]) => `--${prefix}${k}: ${v};`)
    .join('\n')
}

function primitiveBlock(): string {
  const lines: string[] = []
  // palette
  for (const [family, shades] of Object.entries(palette)) {
    for (const [shade, value] of Object.entries(shades)) {
      lines.push(`--${family}-${shade}: ${value};`)
    }
  }
  // status
  for (const [k, v] of Object.entries(status)) lines.push(`--status-${k}: ${v};`)
  // overlay
  for (const [k, v] of Object.entries(overlay)) lines.push(`--overlay-${k}: ${v};`)
  // fonts
  for (const [k, v] of Object.entries(fontFamily)) lines.push(`--font-${k}: ${v};`)
  for (const [k, v] of Object.entries(fontSize))   lines.push(`--fs-${k}: ${v};`)
  for (const [k, v] of Object.entries(lineHeight)) lines.push(`--lh-${k}: ${v};`)
  for (const [k, v] of Object.entries(tracking))   lines.push(`--tracking-${k}: ${v};`)
  for (const [k, v] of Object.entries(fontWeight)) lines.push(`--fw-${k}: ${v};`)
  // space
  for (const [k, v] of Object.entries(space)) lines.push(`--space-${k}: ${v};`)
  for (const [k, v] of Object.entries(size))  lines.push(`--size-${k}: ${v};`)
  for (const [k, v] of Object.entries(iconSize)) lines.push(`--icon-${k}: ${v};`)
  // breakpoints
  for (const [k, v] of Object.entries(breakpoint)) lines.push(`--bp-${k}: ${v};`)
  // radius
  for (const [k, v] of Object.entries(radius)) lines.push(`--radius-${k}: ${v};`)
  // borders
  for (const [k, v] of Object.entries(borderWidth)) lines.push(`--border-${k}: ${v};`)
  // motion (primitives)
  for (const [k, v] of Object.entries(duration)) lines.push(`--duration-${k}: ${v};`)
  for (const [k, v] of Object.entries(easing))   lines.push(`--easing-${k}: ${v};`)
  // opacity
  for (const [k, v] of Object.entries(opacity)) lines.push(`--opacity-${k}: ${v};`)
  // z
  for (const [k, v] of Object.entries(z)) lines.push(`--z-${k}: ${v};`)
  return lines.join('\n')
}

function semanticSpaceBlock(): string {
  return Object.entries(spaceRoles)
    .map(([k, v]) => `--space-${k}: ${v};`)
    .join('\n')
}

function semanticMotionBlock(): string {
  const lines: string[] = []
  for (const [role, { duration: d, easing: e }] of Object.entries(motionRoles)) {
    lines.push(`--motion-${role}-duration: var(--duration-${d});`)
    lines.push(`--motion-${role}-easing: var(--easing-${e});`)
  }
  return lines.join('\n')
}

function themeBlock(name: ThemeName): string {
  const colors = themes[name]
  return Object.entries(colors)
    .map(([k, v]) => `--color-${k}: ${v};`)
    .join('\n')
}

export function emitTokensCss(): string {
  const root = [
    '/* AUTO-GENERATED by src/tokens/build.ts — do not edit. */',
    '',
    ':root,',
    '[data-theme="bone"] {',
    indent(primitiveBlock()),
    '',
    indent('/* semantic — spacing */'),
    indent(semanticSpaceBlock()),
    '',
    indent('/* semantic — motion */'),
    indent(semanticMotionBlock()),
    '',
    indent('/* theme — bone (default) */'),
    indent(themeBlock('bone')),
    '}',
    ''
  ].join('\n')

  const otherThemes = themeNames
    .filter(n => n !== 'bone')
    .map(n => `[data-theme="${n}"] {\n${indent(themeBlock(n))}\n}`)
    .join('\n\n')

  return root + '\n' + otherThemes + '\n'
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- src/tokens/build/emit.test.ts`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/tokens/build/emit.ts src/tokens/build/emit.test.ts
git commit -m "feat(tokens): emit CSS custom properties from token graph"
```

---

## Task 16: Type emitter + entry script + contrast verification

**Files:**
- Create: `src/tokens/build/emit-types.ts`, `src/tokens/build/verify.ts`, `src/tokens/build.ts`
- Create: `src/tokens/build/verify.test.ts`

- [ ] **Step 1: Write failing test for the contrast verifier**

Create `src/tokens/build/verify.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { verifyThemeContrast } from './verify'

describe('verifyThemeContrast', () => {
  it('returns no errors when every theme passes AA', () => {
    const errors = verifyThemeContrast()
    expect(errors).toEqual([])
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/tokens/build/verify.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement verify.ts**

Create `src/tokens/build/verify.ts`:

```ts
import { themes, themeNames } from '../themes'
import { contrastRatio } from './contrast'

const HEX_RE = /#[0-9a-fA-F]{6}/

function extractHex(v: string): string | null {
  const m = v.match(HEX_RE)
  return m ? m[0] : null
}

export type ContrastError = {
  theme: string
  text: string
  surface: string
  ratio: number
}

// AA threshold for normal text.
export const AA_NORMAL = 4.5

export function verifyThemeContrast(): ContrastError[] {
  const errors: ContrastError[] = []
  for (const name of themeNames) {
    if (name === 'campaign') continue // runtime values, not verifiable here
    const t = themes[name]
    const surface = extractHex(t['surface-page'])
    const text    = extractHex(t['text-default'])
    if (!surface || !text) continue
    const ratio = contrastRatio(text, surface)
    if (ratio < AA_NORMAL) {
      errors.push({ theme: name, text, surface, ratio })
    }
  }
  return errors
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- src/tokens/build/verify.test.ts`
Expected: PASS, 1 test. If any theme fails, the test will surface the failing pair — adjust the hex in `src/tokens/primitives/color.ts` (tune lightness only, preserve hue) until AA passes.

- [ ] **Step 5: Implement type emitter**

Create `src/tokens/build/emit-types.ts`:

```ts
import { themeNames } from '../themes'
import { motionRoles } from '../semantic/motion'

export function emitTokensTypes(): string {
  const themesUnion = themeNames.map(n => `'${n}'`).join(' | ')
  const motionUnion = Object.keys(motionRoles).map(n => `'${n}'`).join(' | ')
  return `// AUTO-GENERATED by src/tokens/build.ts — do not edit.

export type ThemeName = ${themesUnion}
export type MotionRole = ${motionUnion}

export const themeNames: ThemeName[] = [${themeNames.map(n => `'${n}'`).join(', ')}]
`
}
```

- [ ] **Step 6: Implement entry script**

Create `src/tokens/build.ts`:

```ts
#!/usr/bin/env tsx
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { emitTokensCss } from './build/emit'
import { emitTokensTypes } from './build/emit-types'
import { verifyThemeContrast } from './build/verify'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, 'generated')

const errors = verifyThemeContrast()
if (errors.length) {
  console.error('Token build failed: theme contrast below AA (4.5:1)')
  for (const e of errors) {
    console.error(`  theme=${e.theme}  text=${e.text}  surface=${e.surface}  ratio=${e.ratio.toFixed(2)}`)
  }
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'tokens.css'), emitTokensCss())
writeFileSync(join(outDir, 'tokens.types.ts'), emitTokensTypes())
console.log('Tokens built: src/tokens/generated/tokens.css + tokens.types.ts')
```

- [ ] **Step 7: Run the build**

Run: `npm run tokens:build`
Expected: `Tokens built: ...` and two files appear under `src/tokens/generated/`.

- [ ] **Step 8: Spot-check the output**

```bash
head -40 src/tokens/generated/tokens.css
```

Expected: opening comment + `:root, [data-theme="bone"] { ... }` block containing primitives and semantic vars.

- [ ] **Step 9: Run full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 10: Commit**

```bash
git add src/tokens/build.ts src/tokens/build/emit-types.ts src/tokens/build/verify.ts src/tokens/build/verify.test.ts
git commit -m "feat(tokens): add build entry script with type emitter and AA contrast gate"
```

---

## Task 17: Re-export tokens at `src/tokens/index.ts`

**Files:**
- Create: `src/tokens/index.ts`

- [ ] **Step 1: Create file**

```ts
// src/tokens/index.ts
// Typed re-export for runtime access. Components rarely import from here —
// most consume CSS vars from tokens.css.

export * from './primitives/color'
export * from './primitives/type'
export * from './primitives/space'
export * from './primitives/size'
export * from './primitives/breakpoint'
export * from './primitives/radius'
export * from './primitives/border'
export * from './primitives/motion'
export * from './primitives/opacity'
export * from './primitives/z'

export { colorRoles, type ColorRoleKey } from './semantic/color'
export { textRoles, type TextRole } from './semantic/type'
export { spaceRoles, type SpaceRoleKey } from './semantic/space'
export { motionRoles, type MotionRole } from './semantic/motion'
export { themes, themeNames, type ThemeName } from './themes'
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/tokens/index.ts
git commit -m "feat(tokens): re-export full token graph from src/tokens/index.ts"
```

---

# Phase 6 — Global Styles & Fonts

## Task 18: Self-host Cabinet Grotesk + Satoshi fonts

**Files:**
- Create: `public/fonts/cabinet-grotesk/CabinetGrotesk-Medium.woff2`, `public/fonts/cabinet-grotesk/CabinetGrotesk-Light.woff2`, `public/fonts/satoshi/Satoshi-Regular.woff2`, `public/fonts/satoshi/Satoshi-Medium.woff2`, `public/fonts/satoshi/Satoshi-Italic.woff2` (binary downloads from Fontshare)
- Create: `public/fonts/LICENSE.txt` (vendor license text)

- [ ] **Step 1: Download font packages from Fontshare**

Open in browser:
- https://www.fontshare.com/fonts/cabinet-grotesk
- https://www.fontshare.com/fonts/satoshi

Use the "Download family" button on each page. Unzip both downloads.

- [ ] **Step 2: Place WOFF2 files**

```bash
mkdir -p public/fonts/cabinet-grotesk public/fonts/satoshi
# Copy from unzipped downloads (paths vary by Fontshare zip layout):
cp ~/Downloads/Cabinet_Grotesk_Complete/Fonts/WEB/fonts/CabinetGrotesk-Medium.woff2 public/fonts/cabinet-grotesk/
cp ~/Downloads/Cabinet_Grotesk_Complete/Fonts/WEB/fonts/CabinetGrotesk-Light.woff2  public/fonts/cabinet-grotesk/
cp ~/Downloads/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Regular.woff2 public/fonts/satoshi/
cp ~/Downloads/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Medium.woff2  public/fonts/satoshi/
cp ~/Downloads/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Italic.woff2  public/fonts/satoshi/
```

If the Fontshare zip layout differs, adapt paths. Both families ship as Indian Type Foundry under permissive licensing — copy the included `LICENSE.txt` or `OFL.txt` to `public/fonts/LICENSE.txt`.

- [ ] **Step 3: Verify files exist**

```bash
ls -la public/fonts/cabinet-grotesk public/fonts/satoshi
```

Expected: each folder contains the WOFF2 files listed above.

- [ ] **Step 4: Commit fonts**

```bash
git add public/fonts/
git commit -m "chore(fonts): self-host Cabinet Grotesk + Satoshi (WOFF2)"
```

---

## Task 19: Global reset + font-face + focus + reduced-motion CSS

**Files:**
- Create: `src/system/styles/fonts.css`, `src/system/styles/reset.css`, `src/system/styles/global.css`

- [ ] **Step 1: Create `fonts.css`**

```css
/* src/system/styles/fonts.css */

@font-face {
  font-family: 'Cabinet Grotesk';
  font-weight: 300;
  font-style: normal;
  font-display: swap;
  src: url('/fonts/cabinet-grotesk/CabinetGrotesk-Light.woff2') format('woff2');
}

@font-face {
  font-family: 'Cabinet Grotesk';
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url('/fonts/cabinet-grotesk/CabinetGrotesk-Medium.woff2') format('woff2');
}

@font-face {
  font-family: 'Cabinet Grotesk';
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  /* Use Medium for italic body fallback if no italic shipped */
  src: url('/fonts/cabinet-grotesk/CabinetGrotesk-Medium.woff2') format('woff2');
}

@font-face {
  font-family: 'Satoshi';
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url('/fonts/satoshi/Satoshi-Regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Satoshi';
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url('/fonts/satoshi/Satoshi-Medium.woff2') format('woff2');
}

@font-face {
  font-family: 'Satoshi';
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  src: url('/fonts/satoshi/Satoshi-Italic.woff2') format('woff2');
}
```

- [ ] **Step 2: Create `reset.css`**

```css
/* src/system/styles/reset.css — minimal modern reset */

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }

body {
  margin: 0;
  font-family: var(--font-body);
  font-weight: var(--fw-body-regular);
  color: var(--color-text-default);
  background: var(--color-surface-page);
  line-height: var(--lh-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  hanging-punctuation: first last;
}

h1, h2, h3, h4, h5, h6, p, figure, blockquote { margin: 0; }
ul, ol { margin: 0; padding: 0; list-style: none; }

a { color: inherit; text-decoration: none; }

img, picture, video, svg { display: block; max-width: 100%; height: auto; }

button {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

:focus { outline: none; }
```

- [ ] **Step 3: Create `global.css`**

```css
/* src/system/styles/global.css */

@import '../../tokens/generated/tokens.css';
@import './fonts.css';
@import './reset.css';

/* Global focus state — sky-400 ring on every theme */
:focus-visible {
  outline: var(--border-strong) solid var(--color-focus-ring);
  outline-offset: 3px;
  border-radius: var(--radius-xs);
}

/* Smooth theme transitions — color only, never layout */
[data-theme] {
  transition:
    background-color var(--motion-surface-swap-duration) var(--motion-surface-swap-easing),
    color            var(--motion-surface-swap-duration) var(--motion-surface-swap-easing),
    border-color     var(--motion-surface-swap-duration) var(--motion-surface-swap-easing);
}

/* Reduced-motion global override */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0ms !important;
    scroll-behavior: auto !important;
  }
}

/* Tabular numerals for meta / data text via utility class */
.tabular-nums {
  font-feature-settings: 'ss01', 'tnum';
}

/* Visually hidden but accessible (skip links etc.) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only:focus,
.sr-only:focus-visible {
  position: static;
  width: auto;
  height: auto;
  padding: var(--space-3) var(--space-4);
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
  background: var(--color-surface-page);
  color: var(--color-text-strong);
}
```

- [ ] **Step 4: Import in app root**

Replace `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './system/styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

Replace `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main>
      <p>MTG design system foundations — open Storybook (<code>npm run storybook</code>) to view.</p>
    </main>
  )
}
```

- [ ] **Step 5: Add a `data-theme="bone"` default on `<html>`**

Edit `index.html` — change the opening `<html>` to:

```html
<html lang="en" data-theme="bone">
```

- [ ] **Step 6: Verify dev server boots**

Run: `npm run dev`
Expected: page renders on bone background; navy text. Open DevTools and confirm `:root` has `--color-surface-page` defined.

Stop the server.

- [ ] **Step 7: Commit**

```bash
git add src/system/styles/ src/main.tsx src/App.tsx index.html
git commit -m "feat(styles): add global reset, font-face, focus, reduced-motion, theme transition"
```

---

# Phase 7 — Layout Primitives

Each primitive gets a co-located CSS Module + TypeScript file + test. Public exports through `src/system/primitives/index.ts`.

## Task 20: `<Container>` primitive (TDD)

**Files:**
- Create: `src/system/primitives/Container.tsx`, `Container.module.css`, `Container.test.tsx`
- Create: `src/system/primitives/index.ts` (will be appended through phase)

- [ ] **Step 1: Write failing test**

Create `src/system/primitives/Container.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Container } from './Container'

describe('Container', () => {
  it('renders children', () => {
    const { getByText } = render(<Container>hello</Container>)
    expect(getByText('hello')).toBeInTheDocument()
  })

  it('applies size=default class by default', () => {
    const { container } = render(<Container>x</Container>)
    expect(container.firstChild).toHaveClass('size-default')
  })

  it('applies size=prose class', () => {
    const { container } = render(<Container size="prose">x</Container>)
    expect(container.firstChild).toHaveClass('size-prose')
  })

  it('applies size=bleed class with no horizontal padding marker', () => {
    const { container } = render(<Container size="bleed">x</Container>)
    expect(container.firstChild).toHaveClass('size-bleed')
  })

  it('renders as <div> by default and accepts `as` override', () => {
    const { container } = render(<Container as="section">x</Container>)
    expect(container.firstChild?.nodeName).toBe('SECTION')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/primitives/Container.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement CSS module**

Create `src/system/primitives/Container.module.css`:

```css
.container {
  margin-inline: auto;
  padding-inline: var(--space-container-pad-sm);
}

@media (min-width: 768px) {
  .container { padding-inline: var(--space-container-pad-md); }
}

@media (min-width: 1200px) {
  .container { padding-inline: var(--space-container-pad-lg); }
}

.size-prose   { max-inline-size: 65ch; }
.size-default { max-inline-size: 1440px; }
.size-wide    { max-inline-size: 1680px; }
.size-bleed {
  max-inline-size: none;
  padding-inline: 0;
}
```

- [ ] **Step 4: Implement Container**

Create `src/system/primitives/Container.tsx`:

```tsx
import { type ElementType, type ReactNode } from 'react'
import s from './Container.module.css'

type ContainerSize = 'prose' | 'default' | 'wide' | 'bleed'

export type ContainerProps = {
  size?: ContainerSize
  as?: ElementType
  className?: string
  children: ReactNode
}

export function Container({ size = 'default', as: Tag = 'div', className, children }: ContainerProps) {
  const cls = [s.container, s[`size-${size}`], className].filter(Boolean).join(' ')
  return <Tag className={cls}>{children}</Tag>
}
```

- [ ] **Step 5: Create primitives barrel file**

Create `src/system/primitives/index.ts`:

```ts
export { Container, type ContainerProps } from './Container'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/primitives/Container.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 7: Commit**

```bash
git add src/system/primitives/Container.tsx src/system/primitives/Container.module.css src/system/primitives/Container.test.tsx src/system/primitives/index.ts
git commit -m "feat(system): add Container primitive (sizes: prose, default, wide, bleed)"
```

---

## Task 21: `<Section>` primitive (TDD)

**Files:**
- Create: `src/system/primitives/Section.tsx`, `Section.module.css`, `Section.test.tsx`
- Modify: `src/system/primitives/index.ts`

- [ ] **Step 1: Write failing test**

Create `src/system/primitives/Section.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Section } from './Section'

describe('Section', () => {
  it('renders as <section> by default', () => {
    const { container } = render(<Section>x</Section>)
    expect(container.firstChild?.nodeName).toBe('SECTION')
  })

  it('applies spacing=md class by default', () => {
    const { container } = render(<Section>x</Section>)
    expect(container.firstChild).toHaveClass('spacing-md')
  })

  it('sets data-theme attribute when theme prop is given', () => {
    const { container } = render(<Section theme="clay">x</Section>)
    expect(container.firstChild).toHaveAttribute('data-theme', 'clay')
  })

  it('does not set data-theme when prop omitted', () => {
    const { container } = render(<Section>x</Section>)
    expect(container.firstChild).not.toHaveAttribute('data-theme')
  })

  it('applies bleed class when bleed prop is true', () => {
    const { container } = render(<Section bleed>x</Section>)
    expect(container.firstChild).toHaveClass('bleed')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/primitives/Section.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement CSS module**

Create `src/system/primitives/Section.module.css`:

```css
.section {
  background: var(--color-surface-page);
  color: var(--color-text-default);
}

.spacing-sm { padding-block: var(--space-section-y-sm); }
.spacing-md { padding-block: var(--space-section-y-md); }
.spacing-lg { padding-block: var(--space-section-y-lg); }
.spacing-xl { padding-block: var(--space-section-y-xl); }

.bleed {
  margin-inline: calc(var(--space-container-pad-sm) * -1);
}

@media (min-width: 768px) {
  .bleed { margin-inline: calc(var(--space-container-pad-md) * -1); }
}

@media (min-width: 1200px) {
  .bleed { margin-inline: calc(var(--space-container-pad-lg) * -1); }
}
```

- [ ] **Step 4: Implement Section**

Create `src/system/primitives/Section.tsx`:

```tsx
import { type HTMLAttributes, type ReactNode } from 'react'
import type { ThemeName } from '@tokens/themes'
import s from './Section.module.css'

export type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl'

export type SectionProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  theme?: ThemeName
  spacing?: SectionSpacing
  bleed?: boolean
  className?: string
  children: ReactNode
}

export function Section({ theme, spacing = 'md', bleed, className, children, ...rest }: SectionProps) {
  const cls = [s.section, s[`spacing-${spacing}`], bleed && s.bleed, className].filter(Boolean).join(' ')
  return (
    <section {...rest} className={cls} data-theme={theme}>
      {children}
    </section>
  )
}
```

- [ ] **Step 5: Update barrel**

Append to `src/system/primitives/index.ts`:

```ts
export { Section, type SectionProps, type SectionSpacing } from './Section'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/primitives/Section.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 7: Commit**

```bash
git add src/system/primitives/Section.* src/system/primitives/index.ts
git commit -m "feat(system): add Section primitive (theme + spacing + bleed)"
```

---

## Task 22: `<Grid>` + `<Col>` primitives (TDD)

**Files:**
- Create: `src/system/primitives/Grid.tsx`, `Grid.module.css`, `Grid.test.tsx`
- Create: `src/system/primitives/Col.tsx`, `Col.module.css`, `Col.test.tsx`
- Modify: `src/system/primitives/index.ts`

- [ ] **Step 1: Write failing test for Grid**

Create `src/system/primitives/Grid.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Grid } from './Grid'

describe('Grid', () => {
  it('renders a div with the grid class', () => {
    const { container } = render(<Grid>x</Grid>)
    expect(container.firstChild).toHaveClass('grid')
  })

  it('renders children', () => {
    const { getByText } = render(<Grid>hello</Grid>)
    expect(getByText('hello')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Write failing test for Col**

Create `src/system/primitives/Col.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Col } from './Col'

describe('Col', () => {
  it('renders children', () => {
    const { getByText } = render(<Col>hello</Col>)
    expect(getByText('hello')).toBeInTheDocument()
  })

  it('sets inline style custom properties for span per breakpoint', () => {
    const { container } = render(<Col span={{ sm: 1, md: 2, lg: 3 }}>x</Col>)
    const el = container.firstChild as HTMLElement
    expect(el.style.getPropertyValue('--col-span-sm')).toBe('1')
    expect(el.style.getPropertyValue('--col-span-md')).toBe('2')
    expect(el.style.getPropertyValue('--col-span-lg')).toBe('3')
  })

  it('sets inline style custom property for lg start when provided', () => {
    const { container } = render(<Col span={{ lg: 3 }} start={{ lg: 2 }}>x</Col>)
    const el = container.firstChild as HTMLElement
    expect(el.style.getPropertyValue('--col-start-lg')).toBe('2')
  })
})
```

- [ ] **Step 3: Run both tests, verify they fail**

Run: `npm test -- src/system/primitives/Grid.test.tsx src/system/primitives/Col.test.tsx`
Expected: FAIL.

- [ ] **Step 4: Implement Grid CSS module**

Create `src/system/primitives/Grid.module.css`:

```css
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-grid-gutter-sm);
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-grid-gutter-md);
  }
}

@media (min-width: 1200px) {
  .grid {
    grid-template-columns: repeat(5, 1fr);
    gap: var(--space-grid-gutter-lg);
  }
}
```

- [ ] **Step 5: Implement Col CSS module**

Create `src/system/primitives/Col.module.css`:

```css
.col {
  grid-column: span var(--col-span-sm, 1);
}

@media (min-width: 768px) {
  .col {
    grid-column: span var(--col-span-md, 2);
  }
}

@media (min-width: 1200px) {
  .col {
    grid-column-start: var(--col-start-lg, auto);
    grid-column-end: span var(--col-span-lg, 5);
  }
}
```

- [ ] **Step 6: Implement Grid**

Create `src/system/primitives/Grid.tsx`:

```tsx
import { type ReactNode } from 'react'
import s from './Grid.module.css'

export type GridProps = {
  className?: string
  children: ReactNode
}

export function Grid({ className, children }: GridProps) {
  return <div className={[s.grid, className].filter(Boolean).join(' ')}>{children}</div>
}
```

- [ ] **Step 7: Implement Col**

Create `src/system/primitives/Col.tsx`:

```tsx
import { type CSSProperties, type ReactNode } from 'react'
import s from './Col.module.css'

type Bp = 'sm' | 'md' | 'lg'

export type ColProps = {
  span?: Partial<Record<Bp, number>>
  start?: Partial<Record<Bp, number>>
  className?: string
  children: ReactNode
}

export function Col({ span = {}, start = {}, className, children }: ColProps) {
  const style: CSSProperties & Record<string, string | number> = {}
  if (span.sm !== undefined) style['--col-span-sm'] = String(span.sm)
  if (span.md !== undefined) style['--col-span-md'] = String(span.md)
  if (span.lg !== undefined) style['--col-span-lg'] = String(span.lg)
  if (start.lg !== undefined) style['--col-start-lg'] = String(start.lg)
  return <div className={[s.col, className].filter(Boolean).join(' ')} style={style}>{children}</div>
}
```

- [ ] **Step 8: Update barrel**

Append to `src/system/primitives/index.ts`:

```ts
export { Grid, type GridProps } from './Grid'
export { Col, type ColProps } from './Col'
```

- [ ] **Step 9: Run tests, verify they pass**

Run: `npm test -- src/system/primitives/Grid.test.tsx src/system/primitives/Col.test.tsx`
Expected: PASS, 5 tests total.

- [ ] **Step 10: Commit**

```bash
git add src/system/primitives/Grid.* src/system/primitives/Col.* src/system/primitives/index.ts
git commit -m "feat(system): add Grid + Col primitives (5-col lg, 2-col md, 1-col sm)"
```

---

## Task 23: `<Stack>` + `<Inline>` primitives (TDD)

**Files:**
- Create: `src/system/primitives/Stack.tsx`, `Stack.module.css`, `Stack.test.tsx`
- Create: `src/system/primitives/Inline.tsx`, `Inline.module.css`, `Inline.test.tsx`
- Modify: `src/system/primitives/index.ts`

- [ ] **Step 1: Write failing tests**

Create `src/system/primitives/Stack.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Stack } from './Stack'

describe('Stack', () => {
  it('applies gap=default class by default', () => {
    const { container } = render(<Stack>x</Stack>)
    expect(container.firstChild).toHaveClass('gap-default')
  })

  it('applies gap=loose class when prop set', () => {
    const { container } = render(<Stack gap="loose">x</Stack>)
    expect(container.firstChild).toHaveClass('gap-loose')
  })

  it('applies align=start class when prop set', () => {
    const { container } = render(<Stack align="start">x</Stack>)
    expect(container.firstChild).toHaveClass('align-start')
  })
})
```

Create `src/system/primitives/Inline.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Inline } from './Inline'

describe('Inline', () => {
  it('applies gap=default class by default', () => {
    const { container } = render(<Inline>x</Inline>)
    expect(container.firstChild).toHaveClass('gap-default')
  })

  it('applies wrap class when wrap prop true', () => {
    const { container } = render(<Inline wrap>x</Inline>)
    expect(container.firstChild).toHaveClass('wrap')
  })
})
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test -- src/system/primitives/Stack.test.tsx src/system/primitives/Inline.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement CSS modules**

Create `src/system/primitives/Stack.module.css`:

```css
.stack {
  display: flex;
  flex-direction: column;
}

.gap-tight   { gap: var(--space-stack-tight); }
.gap-snug    { gap: var(--space-stack-snug); }
.gap-default { gap: var(--space-stack-default); }
.gap-loose   { gap: var(--space-stack-loose); }
.gap-xl      { gap: var(--space-stack-xl); }

.align-start  { align-items: flex-start; }
.align-center { align-items: center; }
.align-end    { align-items: flex-end; }
.align-stretch { align-items: stretch; }
```

Create `src/system/primitives/Inline.module.css`:

```css
.inline {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.gap-tight   { gap: var(--space-inline-tight); }
.gap-default { gap: var(--space-inline-default); }
.gap-loose   { gap: var(--space-inline-loose); }

.wrap { flex-wrap: wrap; }

.justify-start   { justify-content: flex-start; }
.justify-center  { justify-content: center; }
.justify-end     { justify-content: flex-end; }
.justify-between { justify-content: space-between; }

.align-start    { align-items: flex-start; }
.align-center   { align-items: center; }
.align-end      { align-items: flex-end; }
.align-baseline { align-items: baseline; }
```

- [ ] **Step 4: Implement Stack**

Create `src/system/primitives/Stack.tsx`:

```tsx
import { type ReactNode } from 'react'
import s from './Stack.module.css'

export type StackGap = 'tight' | 'snug' | 'default' | 'loose' | 'xl'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch'

export type StackProps = {
  gap?: StackGap
  align?: StackAlign
  className?: string
  children: ReactNode
}

export function Stack({ gap = 'default', align, className, children }: StackProps) {
  const cls = [s.stack, s[`gap-${gap}`], align && s[`align-${align}`], className].filter(Boolean).join(' ')
  return <div className={cls}>{children}</div>
}
```

- [ ] **Step 5: Implement Inline**

Create `src/system/primitives/Inline.tsx`:

```tsx
import { type ReactNode } from 'react'
import s from './Inline.module.css'

export type InlineGap = 'tight' | 'default' | 'loose'
export type InlineJustify = 'start' | 'center' | 'end' | 'between'
export type InlineAlign = 'start' | 'center' | 'end' | 'baseline'

export type InlineProps = {
  gap?: InlineGap
  wrap?: boolean
  justify?: InlineJustify
  align?: InlineAlign
  className?: string
  children: ReactNode
}

export function Inline({ gap = 'default', wrap, justify, align, className, children }: InlineProps) {
  const cls = [s.inline, s[`gap-${gap}`], wrap && s.wrap, justify && s[`justify-${justify}`], align && s[`align-${align}`], className].filter(Boolean).join(' ')
  return <div className={cls}>{children}</div>
}
```

- [ ] **Step 6: Update barrel**

Append to `src/system/primitives/index.ts`:

```ts
export { Stack, type StackProps, type StackGap, type StackAlign } from './Stack'
export { Inline, type InlineProps, type InlineGap, type InlineJustify, type InlineAlign } from './Inline'
```

- [ ] **Step 7: Run tests, verify they pass**

Run: `npm test -- src/system/primitives/Stack.test.tsx src/system/primitives/Inline.test.tsx`
Expected: PASS, 5 tests total.

- [ ] **Step 8: Commit**

```bash
git add src/system/primitives/Stack.* src/system/primitives/Inline.* src/system/primitives/index.ts
git commit -m "feat(system): add Stack + Inline flex primitives"
```

---

## Task 24: `<Text>` primitive (TDD)

**Files:**
- Create: `src/system/primitives/Text.tsx`, `Text.module.css`, `Text.test.tsx`
- Modify: `src/system/primitives/index.ts`

- [ ] **Step 1: Write failing test**

Create `src/system/primitives/Text.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Text } from './Text'

describe('Text', () => {
  it('renders body role as <p> by default', () => {
    const { container } = render(<Text role="body">x</Text>)
    expect(container.firstChild?.nodeName).toBe('P')
  })

  it('renders h1 role as <h1> by default', () => {
    const { container } = render(<Text role="h1">x</Text>)
    expect(container.firstChild?.nodeName).toBe('H1')
  })

  it('renders display role as <h1> by default', () => {
    const { container } = render(<Text role="display">x</Text>)
    expect(container.firstChild?.nodeName).toBe('H1')
  })

  it('renders tag role as <span> by default', () => {
    const { container } = render(<Text role="tag">x</Text>)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('respects `as` override', () => {
    const { container } = render(<Text role="display" as="h2">x</Text>)
    expect(container.firstChild?.nodeName).toBe('H2')
  })

  it('applies the role class', () => {
    const { container } = render(<Text role="lead">x</Text>)
    expect(container.firstChild).toHaveClass('role-lead')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/primitives/Text.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement CSS module**

Create `src/system/primitives/Text.module.css`:

```css
.text {
  margin: 0;
  color: inherit;
}

.role-display {
  font-family: var(--font-display);
  font-size: var(--fs-5xl);
  line-height: var(--lh-display);
  letter-spacing: var(--tracking-display);
  font-weight: var(--fw-display-medium);
}
.role-hero {
  font-family: var(--font-display);
  font-size: var(--fs-4xl);
  line-height: var(--lh-hero);
  letter-spacing: var(--tracking-hero);
  font-weight: var(--fw-display-medium);
}
.role-h1 {
  font-family: var(--font-display);
  font-size: var(--fs-3xl);
  line-height: var(--lh-h1);
  letter-spacing: var(--tracking-h1);
  font-weight: var(--fw-display-medium);
}
.role-h2 {
  font-family: var(--font-display);
  font-size: var(--fs-2xl);
  line-height: var(--lh-h2);
  letter-spacing: var(--tracking-h2);
  font-weight: var(--fw-display-medium);
}
.role-h3 {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  line-height: var(--lh-h3);
  letter-spacing: var(--tracking-none);
  font-weight: var(--fw-display-medium);
}
.role-lead {
  font-family: var(--font-body);
  font-size: var(--fs-lg);
  line-height: var(--lh-lead);
  letter-spacing: var(--tracking-none);
  font-weight: var(--fw-body-regular);
}
.role-body {
  font-family: var(--font-body);
  font-size: var(--fs-md);
  line-height: var(--lh-body);
  font-weight: var(--fw-body-regular);
}
.role-bodysm {
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  line-height: var(--lh-body);
  font-weight: var(--fw-body-regular);
}
.role-caption {
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  line-height: var(--lh-meta);
  letter-spacing: var(--tracking-caption);
  font-weight: var(--fw-body-regular);
}
.role-meta {
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  line-height: var(--lh-meta);
  font-weight: var(--fw-body-regular);
  font-feature-settings: 'ss01', 'tnum';
}
.role-tag {
  font-family: var(--font-body);
  font-size: var(--fs-2xs);
  line-height: var(--lh-tag);
  letter-spacing: var(--tracking-tag);
  font-weight: var(--fw-body-medium);
  text-transform: uppercase;
}
.role-quote {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  line-height: var(--lh-quote);
  letter-spacing: var(--tracking-quote);
  font-weight: var(--fw-body-regular);
  font-style: italic;
}
.role-button {
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  line-height: var(--lh-button);
  letter-spacing: var(--tracking-button);
  font-weight: var(--fw-body-medium);
}

.tone-strong  { color: var(--color-text-strong); }
.tone-default { color: var(--color-text-default); }
.tone-muted   { color: var(--color-text-muted); }
```

- [ ] **Step 4: Implement Text**

Create `src/system/primitives/Text.tsx`:

```tsx
import { type ElementType, type ReactNode } from 'react'
import type { TextRole } from '@tokens/semantic/type'
import s from './Text.module.css'

const defaultTag: Record<TextRole, ElementType> = {
  display: 'h1', hero: 'h1', h1: 'h1', h2: 'h2', h3: 'h3',
  lead: 'p', body: 'p', 'body-sm': 'p',
  caption: 'span', meta: 'span', tag: 'span', quote: 'blockquote', button: 'span'
}

const roleClass: Record<TextRole, string> = {
  display: 'role-display', hero: 'role-hero', h1: 'role-h1', h2: 'role-h2', h3: 'role-h3',
  lead: 'role-lead', body: 'role-body', 'body-sm': 'role-bodysm',
  caption: 'role-caption', meta: 'role-meta', tag: 'role-tag', quote: 'role-quote', button: 'role-button'
}

export type TextTone = 'strong' | 'default' | 'muted'

export type TextProps = {
  role: TextRole
  as?: ElementType
  tone?: TextTone
  className?: string
  children: ReactNode
}

export function Text({ role, as, tone, className, children }: TextProps) {
  const Tag = as ?? defaultTag[role]
  const cls = [s.text, s[roleClass[role]], tone && s[`tone-${tone}`], className].filter(Boolean).join(' ')
  return <Tag className={cls}>{children}</Tag>
}
```

- [ ] **Step 5: Update barrel**

Append to `src/system/primitives/index.ts`:

```ts
export { Text, type TextProps, type TextTone } from './Text'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/primitives/Text.test.tsx`
Expected: PASS, 6 tests.

- [ ] **Step 7: Commit**

```bash
git add src/system/primitives/Text.* src/system/primitives/index.ts
git commit -m "feat(system): add Text primitive (13 roles, role/as decoupled)"
```

---

## Task 25: `<Image>`, `<Divider>`, `<Surface>` primitives (TDD)

**Files:**
- Create: `src/system/primitives/Image.tsx`, `Image.module.css`, `Image.test.tsx`
- Create: `src/system/primitives/Divider.tsx`, `Divider.module.css`, `Divider.test.tsx`
- Create: `src/system/primitives/Surface.tsx`, `Surface.module.css`
- Modify: `src/system/primitives/index.ts`

- [ ] **Step 1: Write failing tests**

Create `src/system/primitives/Image.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Image } from './Image'

describe('Image', () => {
  it('renders an <img> with required alt + src', () => {
    const { container } = render(<Image src="/x.jpg" alt="hello" />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', '/x.jpg')
    expect(img).toHaveAttribute('alt', 'hello')
  })

  it('applies radius=md class when prop set', () => {
    const { container } = render(<Image src="/x.jpg" alt="hello" radius="md" />)
    expect(container.querySelector('img')).toHaveClass('radius-md')
  })

  it('sets object-position via focalPoint', () => {
    const { container } = render(<Image src="/x.jpg" alt="hello" focalPoint="top" />)
    const img = container.querySelector('img') as HTMLImageElement
    expect(img.style.objectPosition).toBe('top')
  })
})
```

Create `src/system/primitives/Divider.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders an <hr> with the divider class', () => {
    const { container } = render(<Divider />)
    expect(container.firstChild?.nodeName).toBe('HR')
    expect(container.firstChild).toHaveClass('divider')
  })

  it('applies weight=strong class', () => {
    const { container } = render(<Divider weight="strong" />)
    expect(container.firstChild).toHaveClass('weight-strong')
  })
})
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test -- src/system/primitives/Image.test.tsx src/system/primitives/Divider.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement Image module + component**

Create `src/system/primitives/Image.module.css`:

```css
.image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.radius-none { border-radius: var(--radius-none); }
.radius-sm   { border-radius: var(--radius-sm); }
.radius-md   { border-radius: var(--radius-md); }
.radius-lg   { border-radius: var(--radius-lg); }

.aspect-square    { aspect-ratio: 1 / 1; object-fit: cover; }
.aspect-portrait  { aspect-ratio: 3 / 4; object-fit: cover; }
.aspect-landscape { aspect-ratio: 4 / 3; object-fit: cover; }
.aspect-wide      { aspect-ratio: 16 / 9; object-fit: cover; }
.aspect-cinematic { aspect-ratio: 21 / 9; object-fit: cover; }
```

Create `src/system/primitives/Image.tsx`:

```tsx
import { type CSSProperties } from 'react'
import s from './Image.module.css'

export type ImageRadius = 'none' | 'sm' | 'md' | 'lg'
export type ImageAspect = 'square' | 'portrait' | 'landscape' | 'wide' | 'cinematic'
export type ImageFocalPoint = 'top' | 'center' | 'bottom' | 'left' | 'right'

export type ImageProps = {
  src: string
  alt: string
  radius?: ImageRadius
  aspect?: ImageAspect
  focalPoint?: ImageFocalPoint
  loading?: 'lazy' | 'eager'
  className?: string
}

export function Image({ src, alt, radius = 'none', aspect, focalPoint = 'center', loading = 'lazy', className }: ImageProps) {
  const style: CSSProperties = { objectPosition: focalPoint }
  const cls = [s.image, s[`radius-${radius}`], aspect && s[`aspect-${aspect}`], className].filter(Boolean).join(' ')
  return <img src={src} alt={alt} loading={loading} className={cls} style={style} />
}
```

- [ ] **Step 4: Implement Divider**

Create `src/system/primitives/Divider.module.css`:

```css
.divider {
  border: 0;
  margin: 0;
  height: var(--border-hairline);
  background: var(--color-border-subtle);
  width: 100%;
}

.weight-strong { height: var(--border-strong); background: var(--color-border-strong); }
```

Create `src/system/primitives/Divider.tsx`:

```tsx
import s from './Divider.module.css'

export type DividerWeight = 'thin' | 'strong'

export type DividerProps = {
  weight?: DividerWeight
  className?: string
}

export function Divider({ weight = 'thin', className }: DividerProps) {
  const cls = [s.divider, weight === 'strong' && s['weight-strong'], className].filter(Boolean).join(' ')
  return <hr className={cls} />
}
```

- [ ] **Step 5: Implement Surface (theme scope wrapper)**

Create `src/system/primitives/Surface.module.css`:

```css
.surface {
  background: var(--color-surface-page);
  color: var(--color-text-default);
}
```

Create `src/system/primitives/Surface.tsx`:

```tsx
import { type ReactNode } from 'react'
import type { ThemeName } from '@tokens/themes'
import s from './Surface.module.css'

export type SurfaceProps = {
  theme?: ThemeName
  className?: string
  children: ReactNode
}

export function Surface({ theme, className, children }: SurfaceProps) {
  return (
    <div className={[s.surface, className].filter(Boolean).join(' ')} data-theme={theme}>
      {children}
    </div>
  )
}
```

- [ ] **Step 6: Update barrel**

Append to `src/system/primitives/index.ts`:

```ts
export { Image, type ImageProps, type ImageRadius, type ImageAspect, type ImageFocalPoint } from './Image'
export { Divider, type DividerProps, type DividerWeight } from './Divider'
export { Surface, type SurfaceProps } from './Surface'
```

- [ ] **Step 7: Run tests, verify they pass**

Run: `npm test -- src/system/primitives/Image.test.tsx src/system/primitives/Divider.test.tsx`
Expected: PASS, 5 tests total.

- [ ] **Step 8: Commit**

```bash
git add src/system/primitives/Image.* src/system/primitives/Divider.* src/system/primitives/Surface.* src/system/primitives/index.ts
git commit -m "feat(system): add Image, Divider, Surface primitives"
```

---

## Task 26: `<Icon>` + `<TextLink>` primitives (TDD)

**Files:**
- Create: `src/system/primitives/Icon.tsx`, `Icon.module.css`, `Icon.test.tsx`
- Create: `src/system/primitives/TextLink.tsx`, `TextLink.module.css`, `TextLink.test.tsx`
- Create: `src/system/primitives/icons/ArrowRight.tsx`, `Check.tsx`, `MapPin.tsx`
- Modify: `src/system/primitives/index.ts`

- [ ] **Step 1: Write failing tests**

Create `src/system/primitives/Icon.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders ArrowRight svg by name', () => {
    const { container } = render(<Icon name="arrow-right" aria-label="next" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies size=md class by default', () => {
    const { container } = render(<Icon name="check" aria-hidden />)
    expect(container.querySelector('svg')).toHaveClass('size-md')
  })

  it('applies size=lg class when prop set', () => {
    const { container } = render(<Icon name="map-pin" size="lg" aria-hidden />)
    expect(container.querySelector('svg')).toHaveClass('size-lg')
  })
})
```

Create `src/system/primitives/TextLink.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TextLink } from './TextLink'

describe('TextLink', () => {
  it('renders an <a> with href', () => {
    const { container } = render(<TextLink href="/x">go</TextLink>)
    const a = container.querySelector('a')
    expect(a).toHaveAttribute('href', '/x')
  })

  it('renders an arrow icon when arrow prop is true', () => {
    const { container } = render(<TextLink href="/x" arrow>go</TextLink>)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npm test -- src/system/primitives/Icon.test.tsx src/system/primitives/TextLink.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement icon SVGs**

Create `src/system/primitives/icons/ArrowRight.tsx`:

```tsx
export function ArrowRight() {
  return (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </>
  )
}
```

Create `src/system/primitives/icons/Check.tsx`:

```tsx
export function Check() {
  return <polyline points="4 12 10 18 20 6" />
}
```

Create `src/system/primitives/icons/MapPin.tsx`:

```tsx
export function MapPin() {
  return (
    <>
      <path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  )
}
```

- [ ] **Step 4: Implement Icon module + component**

Create `src/system/primitives/Icon.module.css`:

```css
.icon {
  display: inline-block;
  vertical-align: middle;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}

.size-sm { width: var(--icon-sm); height: var(--icon-sm); }
.size-md { width: var(--icon-md); height: var(--icon-md); }
.size-lg { width: var(--icon-lg); height: var(--icon-lg); }
```

Create `src/system/primitives/Icon.tsx`:

```tsx
import { type SVGProps } from 'react'
import { ArrowRight } from './icons/ArrowRight'
import { Check } from './icons/Check'
import { MapPin } from './icons/MapPin'
import s from './Icon.module.css'

export type IconName = 'arrow-right' | 'check' | 'map-pin'
export type IconSize = 'sm' | 'md' | 'lg'

export type IconProps = {
  name: IconName
  size?: IconSize
  className?: string
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'fill' | 'stroke'>

const glyphs: Record<IconName, () => JSX.Element> = {
  'arrow-right': ArrowRight,
  'check': Check,
  'map-pin': MapPin
}

export function Icon({ name, size = 'md', className, ...rest }: IconProps) {
  const Glyph = glyphs[name]
  const cls = [s.icon, s[`size-${size}`], className].filter(Boolean).join(' ')
  return (
    <svg viewBox="0 0 24 24" className={cls} role={rest['aria-label'] ? 'img' : undefined} {...rest}>
      <Glyph />
    </svg>
  )
}
```

- [ ] **Step 5: Implement TextLink**

Create `src/system/primitives/TextLink.module.css`:

```css
.link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-inline-default);
  color: inherit;
  text-decoration: none;
  border-bottom: var(--border-thin) solid var(--color-accent-line);
  padding-block-end: 2px;
  transition: opacity var(--motion-hover-duration) var(--motion-hover-easing);
}

@media (hover: hover) {
  .link:hover { opacity: 0.7; }
}
```

Create `src/system/primitives/TextLink.tsx`:

```tsx
import { type AnchorHTMLAttributes, type ReactNode } from 'react'
import { Icon } from './Icon'
import s from './TextLink.module.css'

export type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  arrow?: boolean
  children: ReactNode
}

export function TextLink({ arrow, className, children, ...rest }: TextLinkProps) {
  return (
    <a className={[s.link, className].filter(Boolean).join(' ')} {...rest}>
      <span>{children}</span>
      {arrow && <Icon name="arrow-right" size="sm" aria-hidden />}
    </a>
  )
}
```

- [ ] **Step 6: Update barrel**

Append to `src/system/primitives/index.ts`:

```ts
export { Icon, type IconProps, type IconName, type IconSize } from './Icon'
export { TextLink, type TextLinkProps } from './TextLink'
```

- [ ] **Step 7: Run tests, verify they pass**

Run: `npm test -- src/system/primitives/Icon.test.tsx src/system/primitives/TextLink.test.tsx`
Expected: PASS, 5 tests total.

- [ ] **Step 8: Commit**

```bash
git add src/system/primitives/Icon.* src/system/primitives/TextLink.* src/system/primitives/icons src/system/primitives/index.ts
git commit -m "feat(system): add Icon (3 placeholder glyphs) + TextLink primitives"
```

---

# Phase 8 — Theme Override System

## Task 27: `ThemeOverrideProvider` + `useThemeOverride` hook (TDD)

**Files:**
- Create: `src/system/hooks/ThemeOverride.tsx`, `ThemeOverride.test.tsx`
- Create: `src/system/hooks/index.ts`

- [ ] **Step 1: Write failing test**

Create `src/system/hooks/ThemeOverride.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useState } from 'react'
import { ThemeOverrideProvider, useThemeOverride } from './ThemeOverride'

function TestConsumer({ theme }: { theme: 'sky' | 'clay' | null }) {
  useThemeOverride(theme)
  return null
}

function App({ initial }: { initial: 'sky' | 'clay' | null }) {
  const [theme, setTheme] = useState<'sky' | 'clay' | null>(initial)
  ;(window as any).__setTheme = setTheme
  return (
    <ThemeOverrideProvider>
      <TestConsumer theme={theme} />
    </ThemeOverrideProvider>
  )
}

describe('ThemeOverride', () => {
  beforeEach(() => {
    document.body.removeAttribute('data-theme')
  })

  it('sets data-theme on body when an override is active', () => {
    render(<App initial="sky" />)
    expect(document.body.getAttribute('data-theme')).toBe('sky')
  })

  it('removes data-theme when override clears', () => {
    render(<App initial="sky" />)
    act(() => { (window as any).__setTheme(null) })
    expect(document.body.hasAttribute('data-theme')).toBe(false)
  })

  it('most recently pushed override wins when multiple are active', () => {
    function Two() {
      useThemeOverride('sky')
      useThemeOverride('clay')
      return null
    }
    render(
      <ThemeOverrideProvider>
        <Two />
      </ThemeOverrideProvider>
    )
    expect(document.body.getAttribute('data-theme')).toBe('clay')
  })

  it('reverts to previous override after newest pops', () => {
    function Switcher({ showSecond }: { showSecond: boolean }) {
      useThemeOverride('sky')
      return showSecond ? <Inner /> : null
    }
    function Inner() {
      useThemeOverride('clay')
      return null
    }
    function Wrapper() {
      const [show, setShow] = useState(true)
      ;(window as any).__hide = () => setShow(false)
      return (
        <ThemeOverrideProvider>
          <Switcher showSecond={show} />
        </ThemeOverrideProvider>
      )
    }
    render(<Wrapper />)
    expect(document.body.getAttribute('data-theme')).toBe('clay')
    act(() => { (window as any).__hide() })
    expect(document.body.getAttribute('data-theme')).toBe('sky')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/hooks/ThemeOverride.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement provider + hook**

Create `src/system/hooks/ThemeOverride.tsx`:

```tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ThemeName } from '@tokens/themes'

type StackEntry = { id: number; theme: ThemeName }

type Ctx = {
  push: (theme: ThemeName) => number
  pop: (id: number) => void
}

const ThemeOverrideContext = createContext<Ctx | null>(null)

export type ThemeOverrideProviderProps = {
  scope?: 'body' | 'html'
  children: ReactNode
}

export function ThemeOverrideProvider({ scope = 'body', children }: ThemeOverrideProviderProps) {
  const [stack, setStack] = useState<StackEntry[]>([])
  const nextId = useRef(0)

  const push = useCallback((theme: ThemeName) => {
    const id = ++nextId.current
    setStack(s => [...s, { id, theme }])
    return id
  }, [])

  const pop = useCallback((id: number) => {
    setStack(s => s.filter(e => e.id !== id))
  }, [])

  useEffect(() => {
    const target = scope === 'html' ? document.documentElement : document.body
    const top = stack[stack.length - 1]
    if (top) target.setAttribute('data-theme', top.theme)
    else target.removeAttribute('data-theme')
    return () => {
      target.removeAttribute('data-theme')
    }
  }, [stack, scope])

  const value = useMemo(() => ({ push, pop }), [push, pop])

  return <ThemeOverrideContext.Provider value={value}>{children}</ThemeOverrideContext.Provider>
}

export function useThemeOverride(theme: ThemeName | null): void {
  const ctx = useContext(ThemeOverrideContext)
  const idRef = useRef<number | null>(null)

  useEffect(() => {
    if (!ctx) return
    if (theme) {
      idRef.current = ctx.push(theme)
      return () => {
        if (idRef.current !== null) {
          ctx.pop(idRef.current)
          idRef.current = null
        }
      }
    }
  }, [ctx, theme])
}
```

- [ ] **Step 4: Create hooks barrel**

Create `src/system/hooks/index.ts`:

```ts
export { ThemeOverrideProvider, useThemeOverride, type ThemeOverrideProviderProps } from './ThemeOverride'
```

- [ ] **Step 5: Run test, verify it passes**

Run: `npm test -- src/system/hooks/ThemeOverride.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add src/system/hooks/ThemeOverride.* src/system/hooks/index.ts
git commit -m "feat(system): add ThemeOverrideProvider + useThemeOverride (stack-based, last-wins)"
```

---

# Phase 9 — Motion Hooks

## Task 28: `useReveal` hook (TDD)

**Files:**
- Create: `src/system/hooks/useReveal.ts`, `useReveal.test.tsx`
- Modify: `src/system/hooks/index.ts`

- [ ] **Step 1: Write failing test**

Create `src/system/hooks/useReveal.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useReveal } from './useReveal'

let observerCallback: IntersectionObserverCallback | null = null

class MockObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb
  }
}

beforeEach(() => {
  ;(globalThis as any).IntersectionObserver = MockObserver
  observerCallback = null
})

function Comp() {
  const { ref, revealed } = useReveal()
  return <div ref={ref} data-revealed={revealed ? 'true' : 'false'}>x</div>
}

describe('useReveal', () => {
  it('starts not revealed', () => {
    const { container } = render(<Comp />)
    expect(container.firstChild).toHaveAttribute('data-revealed', 'false')
  })

  it('transitions to revealed when the element intersects', () => {
    const { container } = render(<Comp />)
    act(() => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    })
    expect(container.firstChild).toHaveAttribute('data-revealed', 'true')
  })

  it('does not revert once revealed', () => {
    const { container } = render(<Comp />)
    act(() => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    })
    act(() => {
      observerCallback?.([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver)
    })
    expect(container.firstChild).toHaveAttribute('data-revealed', 'true')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/hooks/useReveal.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement hook**

Create `src/system/hooks/useReveal.ts`:

```ts
import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export type RevealOptions = {
  /** Margin around the root in IntersectionObserver. */
  rootMargin?: string
  /** Threshold (0-1). */
  threshold?: number
}

export function useReveal({ rootMargin = '0px 0px -10% 0px', threshold = 0.15 }: RevealOptions = {}) {
  const ref = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setRevealed(true)
      return
    }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin, threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return { ref, revealed }
}
```

- [ ] **Step 4: Update hooks barrel**

Append to `src/system/hooks/index.ts`:

```ts
export { useReveal, type RevealOptions } from './useReveal'
```

- [ ] **Step 5: Run test, verify it passes**

Run: `npm test -- src/system/hooks/useReveal.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 6: Commit**

```bash
git add src/system/hooks/useReveal.* src/system/hooks/index.ts
git commit -m "feat(system): add useReveal hook (intersection-based fade+lift, one-shot)"
```

---

## Task 29: `useScrollFade` + `useHover` hooks

**Files:**
- Create: `src/system/hooks/useScrollFade.ts`, `useScrollFade.test.tsx`
- Create: `src/system/hooks/useHover.ts`
- Modify: `src/system/hooks/index.ts`

- [ ] **Step 1: Write failing test for useScrollFade**

Create `src/system/hooks/useScrollFade.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useScrollFade } from './useScrollFade'

function Comp() {
  const { ref, progress } = useScrollFade()
  return <div ref={ref} data-progress={progress.toFixed(2)}>x</div>
}

describe('useScrollFade', () => {
  it('initially reports progress=0', () => {
    const { container } = render(<Comp />)
    expect(container.firstChild).toHaveAttribute('data-progress', '0.00')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/hooks/useScrollFade.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement useScrollFade**

Create `src/system/hooks/useScrollFade.ts`:

```ts
import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useScrollFade() {
  const ref = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return

    let raf = 0
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect()
        const vh = window.innerHeight || 1
        // 0 when element just enters from bottom; 1 when its top reaches viewport top.
        const p = Math.min(1, Math.max(0, 1 - rect.top / vh))
        setProgress(p)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { ref, progress }
}
```

- [ ] **Step 4: Implement useHover**

Create `src/system/hooks/useHover.ts`:

```ts
import { useState, useCallback } from 'react'

/** Tiny hover wrapper. Mostly CSS — useful when a component needs to gate React behavior on cursor hover. */
export function useHover() {
  const [hovered, setHovered] = useState(false)
  const onMouseEnter = useCallback(() => setHovered(true), [])
  const onMouseLeave = useCallback(() => setHovered(false), [])
  return { hovered, bind: { onMouseEnter, onMouseLeave } }
}
```

- [ ] **Step 5: Update hooks barrel**

Append to `src/system/hooks/index.ts`:

```ts
export { useScrollFade } from './useScrollFade'
export { useHover } from './useHover'
```

- [ ] **Step 6: Run test**

Run: `npm test -- src/system/hooks/useScrollFade.test.tsx`
Expected: PASS, 1 test.

- [ ] **Step 7: Commit**

```bash
git add src/system/hooks/useScrollFade.* src/system/hooks/useHover.ts src/system/hooks/index.ts
git commit -m "feat(system): add useScrollFade + useHover hooks"
```

---

# Phase 10 — Example Blocks

Every example block follows the same shape:
- `Block.tsx` — React component, header comment marking it `// EXAMPLE`.
- `types.ts` — content type the block accepts.
- `Block.test.tsx` — render + content-variant tests.

Storybook stories for each block come in Phase 13.

## Task 30: `HeroText` example block

**Files:**
- Create: `src/system/examples/HeroText/HeroText.tsx`, `types.ts`, `HeroText.test.tsx`, `index.ts`

- [ ] **Step 1: Write failing test**

Create `src/system/examples/HeroText/HeroText.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroText } from './HeroText'

describe('HeroText', () => {
  it('renders headline as display text', () => {
    render(<HeroText content={{ headline: 'Move to Gothenburg' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Move to Gothenburg')
  })

  it('renders lead when provided', () => {
    render(<HeroText content={{ headline: 'A', lead: 'A practical guide.' }} />)
    expect(screen.getByText('A practical guide.')).toBeInTheDocument()
  })

  it('omits lead when not provided', () => {
    const { container } = render(<HeroText content={{ headline: 'A' }} />)
    expect(container.querySelectorAll('p').length).toBe(0)
  })

  it('renders eyebrow tag when provided', () => {
    render(<HeroText content={{ headline: 'A', eyebrow: 'Welcome' }} />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/examples/HeroText/HeroText.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create content type**

Create `src/system/examples/HeroText/types.ts`:

```ts
import type { ThemeName } from '@tokens/themes'

export type HeroTextContent = {
  eyebrow?: string
  headline: string
  lead?: string
  cta?: { label: string; href: string }
  theme?: ThemeName
}
```

- [ ] **Step 4: Implement HeroText**

Create `src/system/examples/HeroText/HeroText.tsx`:

```tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, TextLink } from '@system/primitives'
import type { HeroTextContent } from './types'

export type HeroTextProps = { content: HeroTextContent }

export function HeroText({ content }: HeroTextProps) {
  return (
    <Section theme={content.theme} spacing="xl">
      <Container>
        <Grid>
          <Col span={{ sm: 1, md: 2, lg: 2 }}>
            {content.eyebrow && (
              <Text role="tag" tone="muted">{content.eyebrow}</Text>
            )}
          </Col>
          <Col span={{ sm: 1, md: 2, lg: 3 }}>
            <Stack gap="loose">
              <Text role="display" as="h1" tone="strong">{content.headline}</Text>
              {content.lead && <Text role="lead">{content.lead}</Text>}
              {content.cta && <TextLink href={content.cta.href} arrow>{content.cta.label}</TextLink>}
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 5: Add re-export**

Create `src/system/examples/HeroText/index.ts`:

```ts
export { HeroText, type HeroTextProps } from './HeroText'
export type { HeroTextContent } from './types'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/examples/HeroText/HeroText.test.tsx`
Expected: PASS, 4 tests.

- [ ] **Step 7: Commit**

```bash
git add src/system/examples/HeroText/
git commit -m "feat(examples): add HeroText example block (2+3 asym lg layout)"
```

---

## Task 31: `EditorialText` example block

**Files:**
- Create: `src/system/examples/EditorialText/EditorialText.tsx`, `types.ts`, `EditorialText.test.tsx`, `index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/system/examples/EditorialText/EditorialText.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EditorialText } from './EditorialText'

describe('EditorialText', () => {
  it('renders the prose paragraphs', () => {
    render(<EditorialText content={{ paragraphs: ['Para A.', 'Para B.'] }} />)
    expect(screen.getByText('Para A.')).toBeInTheDocument()
    expect(screen.getByText('Para B.')).toBeInTheDocument()
  })

  it('renders heading when provided', () => {
    render(<EditorialText content={{ heading: 'A city of', paragraphs: ['x'] }} />)
    expect(screen.getByRole('heading')).toHaveTextContent('A city of')
  })

  it('renders pull quote when provided', () => {
    render(<EditorialText content={{ paragraphs: ['x'], pullQuote: 'Hello world.' }} />)
    expect(screen.getByText('Hello world.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/examples/EditorialText/EditorialText.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create content type**

```ts
// src/system/examples/EditorialText/types.ts
import type { ThemeName } from '@tokens/themes'

export type EditorialTextContent = {
  heading?: string
  paragraphs: string[]
  pullQuote?: string
  theme?: ThemeName
}
```

- [ ] **Step 4: Implement EditorialText**

```tsx
// src/system/examples/EditorialText/EditorialText.tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Stack, Text } from '@system/primitives'
import type { EditorialTextContent } from './types'

export type EditorialTextProps = { content: EditorialTextContent }

export function EditorialText({ content }: EditorialTextProps) {
  return (
    <Section theme={content.theme} spacing="lg">
      <Container size="prose">
        <Stack gap="loose">
          {content.heading && <Text role="h2">{content.heading}</Text>}
          {content.paragraphs.map((p, i) => (
            <Text role="body" key={i}>{p}</Text>
          ))}
          {content.pullQuote && <Text role="quote">{content.pullQuote}</Text>}
        </Stack>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 5: Add re-export**

```ts
// src/system/examples/EditorialText/index.ts
export { EditorialText, type EditorialTextProps } from './EditorialText'
export type { EditorialTextContent } from './types'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/examples/EditorialText/EditorialText.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 7: Commit**

```bash
git add src/system/examples/EditorialText/
git commit -m "feat(examples): add EditorialText example block (prose width)"
```

---

## Task 32: `ImageText` example block

**Files:**
- Create: `src/system/examples/ImageText/ImageText.tsx`, `types.ts`, `ImageText.test.tsx`, `index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/system/examples/ImageText/ImageText.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageText } from './ImageText'

const baseContent = {
  headline: 'Living by the water',
  body: 'Some prose.',
  image: { src: '/x.jpg', alt: 'archipelago' }
}

describe('ImageText', () => {
  it('renders headline and body', () => {
    render(<ImageText content={baseContent} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Living by the water')
    expect(screen.getByText('Some prose.')).toBeInTheDocument()
  })

  it('renders image with required alt', () => {
    const { container } = render(<ImageText content={baseContent} />)
    expect(container.querySelector('img')).toHaveAttribute('alt', 'archipelago')
  })

  it('applies reversed layout via Col start when reversed=true', () => {
    const { container } = render(<ImageText content={{ ...baseContent, reversed: true }} />)
    // When reversed, the image column starts at col 3 on lg (text on col 1).
    const cols = container.querySelectorAll('[class*="col"]')
    const imageCol = cols[0] as HTMLElement
    expect(imageCol.style.getPropertyValue('--col-start-lg')).toBe('3')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/examples/ImageText/ImageText.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create content type**

```ts
// src/system/examples/ImageText/types.ts
import type { ThemeName } from '@tokens/themes'
import type { ImageAspect, ImageFocalPoint } from '@system/primitives'

export type ImageTextContent = {
  eyebrow?: string
  headline: string
  body?: string
  image: { src: string; alt: string; aspect?: ImageAspect; focalPoint?: ImageFocalPoint }
  cta?: { label: string; href: string }
  reversed?: boolean
  bleed?: boolean
  theme?: ThemeName
}
```

- [ ] **Step 4: Implement ImageText**

```tsx
// src/system/examples/ImageText/ImageText.tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, Image, TextLink } from '@system/primitives'
import type { ImageTextContent } from './types'

export type ImageTextProps = { content: ImageTextContent }

export function ImageText({ content }: ImageTextProps) {
  const r = content.reversed ?? false
  return (
    <Section theme={content.theme} spacing="lg" bleed={content.bleed}>
      <Container size={content.bleed ? 'bleed' : 'default'}>
        <Grid>
          <Col span={{ sm: 1, md: 2, lg: 3 }} start={r ? { lg: 3 } : undefined}>
            <Image
              src={content.image.src}
              alt={content.image.alt}
              aspect={content.image.aspect ?? 'wide'}
              focalPoint={content.image.focalPoint}
              radius="md"
            />
          </Col>
          <Col span={{ sm: 1, md: 2, lg: 2 }} start={r ? { lg: 1 } : undefined}>
            <Stack gap="loose">
              {content.eyebrow && <Text role="tag" tone="muted">{content.eyebrow}</Text>}
              <Text role="h2">{content.headline}</Text>
              {content.body && <Text role="body">{content.body}</Text>}
              {content.cta && <TextLink href={content.cta.href} arrow>{content.cta.label}</TextLink>}
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 5: Add re-export**

```ts
// src/system/examples/ImageText/index.ts
export { ImageText, type ImageTextProps } from './ImageText'
export type { ImageTextContent } from './types'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/examples/ImageText/ImageText.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 7: Commit**

```bash
git add src/system/examples/ImageText/
git commit -m "feat(examples): add ImageText example block (3+2 layout, reversed/bleed variants)"
```

---

## Task 33: `Signpost` example block

**Files:**
- Create: `src/system/examples/Signpost/Signpost.tsx`, `types.ts`, `Signpost.test.tsx`, `index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/system/examples/Signpost/Signpost.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Signpost } from './Signpost'

const content = {
  heading: 'Start where you are',
  items: [
    { label: 'Career', href: '/career' },
    { label: 'Family', href: '/family' },
    { label: 'Community', href: '/community' }
  ]
}

describe('Signpost', () => {
  it('renders the heading', () => {
    render(<Signpost content={content} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Start where you are')
  })

  it('renders one link per item', () => {
    render(<Signpost content={content} />)
    expect(screen.getAllByRole('link')).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/examples/Signpost/Signpost.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create content type**

```ts
// src/system/examples/Signpost/types.ts
import type { ThemeName } from '@tokens/themes'

export type SignpostItem = { label: string; href: string; description?: string }
export type SignpostContent = {
  eyebrow?: string
  heading: string
  items: SignpostItem[]
  theme?: ThemeName
}
```

- [ ] **Step 4: Implement Signpost**

```tsx
// src/system/examples/Signpost/Signpost.tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, TextLink, Divider } from '@system/primitives'
import type { SignpostContent } from './types'

export type SignpostProps = { content: SignpostContent }

export function Signpost({ content }: SignpostProps) {
  return (
    <Section theme={content.theme} spacing="lg">
      <Container>
        <Grid>
          <Col span={{ sm: 1, md: 2, lg: 2 }}>
            <Stack gap="snug">
              {content.eyebrow && <Text role="tag" tone="muted">{content.eyebrow}</Text>}
              <Text role="h2">{content.heading}</Text>
            </Stack>
          </Col>
          <Col span={{ sm: 1, md: 2, lg: 3 }}>
            <Stack gap="default">
              {content.items.map((item, i) => (
                <Stack key={item.href} gap="snug">
                  {i > 0 && <Divider />}
                  <TextLink href={item.href} arrow>{item.label}</TextLink>
                  {item.description && <Text role="body-sm" tone="muted">{item.description}</Text>}
                </Stack>
              ))}
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 5: Add re-export**

```ts
// src/system/examples/Signpost/index.ts
export { Signpost, type SignpostProps } from './Signpost'
export type { SignpostContent, SignpostItem } from './types'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/examples/Signpost/Signpost.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 7: Commit**

```bash
git add src/system/examples/Signpost/
git commit -m "feat(examples): add Signpost example block (lead column + 3 links)"
```

---

## Task 34: `JobTeaser` example block

**Files:**
- Create: `src/system/examples/JobTeaser/JobTeaser.tsx`, `types.ts`, `JobTeaser.test.tsx`, `index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/system/examples/JobTeaser/JobTeaser.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { JobTeaser } from './JobTeaser'

const content = {
  tag: 'Engineering',
  role: 'Senior Software Engineer',
  location: 'Gothenburg · Hybrid',
  summary: 'Help build the future of automotive software.',
  meta: { company: 'Volvo Cars', posted: 'Posted 3 days ago' },
  cta: { label: 'See role', href: '/jobs/123' }
}

describe('JobTeaser', () => {
  it('renders role headline', () => {
    render(<JobTeaser content={content} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Senior Software Engineer')
  })

  it('renders location and meta', () => {
    render(<JobTeaser content={content} />)
    expect(screen.getByText('Gothenburg · Hybrid')).toBeInTheDocument()
    expect(screen.getByText(/Volvo Cars/)).toBeInTheDocument()
  })

  it('renders only role when meta+summary+cta omitted', () => {
    render(<JobTeaser content={{ role: 'Engineer', location: 'Gothenburg' }} />)
    expect(screen.getByText('Engineer')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/examples/JobTeaser/JobTeaser.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create content type**

```ts
// src/system/examples/JobTeaser/types.ts
import type { ThemeName } from '@tokens/themes'

export type JobTeaserContent = {
  tag?: string
  role: string
  location: string
  summary?: string
  meta?: { company?: string; posted?: string }
  cta?: { label: string; href: string }
  theme?: ThemeName
}
```

- [ ] **Step 4: Implement JobTeaser**

```tsx
// src/system/examples/JobTeaser/JobTeaser.tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Stack, Text, TextLink, Inline } from '@system/primitives'
import type { JobTeaserContent } from './types'

export type JobTeaserProps = { content: JobTeaserContent }

export function JobTeaser({ content }: JobTeaserProps) {
  return (
    <Stack gap="snug">
      {content.tag && <Text role="tag" tone="muted">{content.tag}</Text>}
      <Text role="h3" as="h3">{content.role}</Text>
      <Text role="body-sm" tone="muted">{content.location}</Text>
      {content.summary && <Text role="body">{content.summary}</Text>}
      {content.meta && (content.meta.company || content.meta.posted) && (
        <Inline gap="default">
          {content.meta.company && <Text role="meta">{content.meta.company}</Text>}
          {content.meta.posted && <Text role="meta" tone="muted">· {content.meta.posted}</Text>}
        </Inline>
      )}
      {content.cta && <TextLink href={content.cta.href} arrow>{content.cta.label}</TextLink>}
    </Stack>
  )
}
```

- [ ] **Step 5: Add re-export**

```ts
// src/system/examples/JobTeaser/index.ts
export { JobTeaser, type JobTeaserProps } from './JobTeaser'
export type { JobTeaserContent } from './types'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/examples/JobTeaser/JobTeaser.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 7: Commit**

```bash
git add src/system/examples/JobTeaser/
git commit -m "feat(examples): add JobTeaser example block"
```

---

## Task 35: `ChecklistTeaser` example block

**Files:**
- Create: `src/system/examples/ChecklistTeaser/ChecklistTeaser.tsx`, `types.ts`, `ChecklistTeaser.test.tsx`, `index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/system/examples/ChecklistTeaser/ChecklistTeaser.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChecklistTeaser } from './ChecklistTeaser'

const content = {
  heading: 'Pre-arrival',
  items: [
    { label: 'Apply for personnummer' },
    { label: 'Sort temporary housing' },
    { label: 'Translate key documents' }
  ]
}

describe('ChecklistTeaser', () => {
  it('renders heading + all items', () => {
    render(<ChecklistTeaser content={content} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Pre-arrival')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/examples/ChecklistTeaser/ChecklistTeaser.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create content type**

```ts
// src/system/examples/ChecklistTeaser/types.ts
import type { ThemeName } from '@tokens/themes'

export type ChecklistItem = { label: string; description?: string }
export type ChecklistTeaserContent = {
  eyebrow?: string
  heading: string
  intro?: string
  items: ChecklistItem[]
  theme?: ThemeName
}
```

- [ ] **Step 4: Implement ChecklistTeaser**

```tsx
// src/system/examples/ChecklistTeaser/ChecklistTeaser.tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, Icon, Inline } from '@system/primitives'
import type { ChecklistTeaserContent } from './types'

export type ChecklistTeaserProps = { content: ChecklistTeaserContent }

export function ChecklistTeaser({ content }: ChecklistTeaserProps) {
  return (
    <Section theme={content.theme} spacing="lg">
      <Container>
        <Grid>
          <Col span={{ sm: 1, md: 2, lg: 2 }}>
            <Stack gap="snug">
              {content.eyebrow && <Text role="tag" tone="muted">{content.eyebrow}</Text>}
              <Text role="h2">{content.heading}</Text>
              {content.intro && <Text role="body" tone="muted">{content.intro}</Text>}
            </Stack>
          </Col>
          <Col span={{ sm: 1, md: 2, lg: 3 }}>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <Stack gap="loose">
                {content.items.map((item, i) => (
                  <li key={i}>
                    <Inline gap="default" align="start">
                      <Icon name="check" size="md" aria-hidden />
                      <Stack gap="tight">
                        <Text role="body">{item.label}</Text>
                        {item.description && <Text role="body-sm" tone="muted">{item.description}</Text>}
                      </Stack>
                    </Inline>
                  </li>
                ))}
              </Stack>
            </ol>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 5: Add re-export**

```ts
// src/system/examples/ChecklistTeaser/index.ts
export { ChecklistTeaser, type ChecklistTeaserProps } from './ChecklistTeaser'
export type { ChecklistTeaserContent, ChecklistItem } from './types'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/examples/ChecklistTeaser/ChecklistTeaser.test.tsx`
Expected: PASS, 1 test.

- [ ] **Step 7: Commit**

```bash
git add src/system/examples/ChecklistTeaser/
git commit -m "feat(examples): add ChecklistTeaser example block"
```

---

## Task 36: `AICompanionTeaser` example block

**Files:**
- Create: `src/system/examples/AICompanionTeaser/AICompanionTeaser.tsx`, `types.ts`, `AICompanionTeaser.test.tsx`, `index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/system/examples/AICompanionTeaser/AICompanionTeaser.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AICompanionTeaser } from './AICompanionTeaser'

describe('AICompanionTeaser', () => {
  it('renders headline + prompt', () => {
    render(<AICompanionTeaser content={{
      headline: 'Ask the guide anything.',
      prompt: 'How much does childcare cost?',
      cta: { label: 'Open guide', href: '/guide' }
    }} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Ask the guide anything.')
    expect(screen.getByText('How much does childcare cost?')).toBeInTheDocument()
  })

  it('renders on ink theme by default', () => {
    const { container } = render(<AICompanionTeaser content={{
      headline: 'x', prompt: 'y', cta: { label: 'go', href: '/' }
    }} />)
    expect(container.firstChild).toHaveAttribute('data-theme', 'ink')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/examples/AICompanionTeaser/AICompanionTeaser.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create content type**

```ts
// src/system/examples/AICompanionTeaser/types.ts
import type { ThemeName } from '@tokens/themes'

export type AICompanionTeaserContent = {
  eyebrow?: string
  headline: string
  body?: string
  prompt: string
  cta: { label: string; href: string }
  theme?: ThemeName
}
```

- [ ] **Step 4: Implement AICompanionTeaser**

```tsx
// src/system/examples/AICompanionTeaser/AICompanionTeaser.tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, TextLink } from '@system/primitives'
import type { AICompanionTeaserContent } from './types'

export type AICompanionTeaserProps = { content: AICompanionTeaserContent }

export function AICompanionTeaser({ content }: AICompanionTeaserProps) {
  return (
    <Section theme={content.theme ?? 'ink'} spacing="xl">
      <Container>
        <Grid>
          <Col span={{ sm: 1, md: 2, lg: 5 }}>
            <Stack gap="loose" align="start">
              {content.eyebrow && <Text role="tag">{content.eyebrow}</Text>}
              <Text role="hero" as="h2">{content.headline}</Text>
              {content.body && <Text role="lead">{content.body}</Text>}
              <Text role="quote">"{content.prompt}"</Text>
              <TextLink href={content.cta.href} arrow>{content.cta.label}</TextLink>
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 5: Add re-export**

```ts
// src/system/examples/AICompanionTeaser/index.ts
export { AICompanionTeaser, type AICompanionTeaserProps } from './AICompanionTeaser'
export type { AICompanionTeaserContent } from './types'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/examples/AICompanionTeaser/AICompanionTeaser.test.tsx`
Expected: PASS, 2 tests.

- [ ] **Step 7: Commit**

```bash
git add src/system/examples/AICompanionTeaser/
git commit -m "feat(examples): add AICompanionTeaser example block (ink theme default)"
```

---

## Task 37: `StoryTeaser` example block

**Files:**
- Create: `src/system/examples/StoryTeaser/StoryTeaser.tsx`, `types.ts`, `StoryTeaser.test.tsx`, `index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/system/examples/StoryTeaser/StoryTeaser.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoryTeaser } from './StoryTeaser'

const base = {
  tag: 'Stories',
  headline: 'Building a life by the archipelago',
  excerpt: 'Sara moved from Madrid in 2024.',
  image: { src: '/x.jpg', alt: 'Sara' },
  byline: { name: 'Sara P.', role: 'Researcher' },
  cta: { label: 'Read', href: '/stories/sara' }
}

describe('StoryTeaser', () => {
  it('renders headline + byline', () => {
    render(<StoryTeaser content={base} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Building a life by the archipelago')
    expect(screen.getByText(/Sara P\./)).toBeInTheDocument()
  })

  it('omits image when content.image is absent', () => {
    const { container } = render(<StoryTeaser content={{ ...base, image: undefined }} />)
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders headline alone when only headline supplied', () => {
    render(<StoryTeaser content={{ headline: 'Just a headline' }} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Just a headline')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/examples/StoryTeaser/StoryTeaser.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create content type**

```ts
// src/system/examples/StoryTeaser/types.ts
import type { ThemeName } from '@tokens/themes'
import type { ImageFocalPoint } from '@system/primitives'

export type StoryTeaserContent = {
  tag?: string
  headline: string
  excerpt?: string
  image?: { src: string; alt: string; focalPoint?: ImageFocalPoint }
  byline?: { name: string; role?: string }
  cta?: { label: string; href: string }
  theme?: ThemeName
}
```

- [ ] **Step 4: Implement StoryTeaser**

```tsx
// src/system/examples/StoryTeaser/StoryTeaser.tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, Image, TextLink } from '@system/primitives'
import type { StoryTeaserContent } from './types'

export type StoryTeaserProps = { content: StoryTeaserContent }

export function StoryTeaser({ content }: StoryTeaserProps) {
  return (
    <Section theme={content.theme} spacing="lg">
      <Container>
        <Grid>
          {content.image && (
            <Col span={{ sm: 1, md: 2, lg: 3 }}>
              <Image
                src={content.image.src}
                alt={content.image.alt}
                aspect="portrait"
                focalPoint={content.image.focalPoint}
                radius="md"
              />
            </Col>
          )}
          <Col span={{ sm: 1, md: 2, lg: 2 }}>
            <Stack gap="loose">
              {content.tag && <Text role="tag" tone="muted">{content.tag}</Text>}
              <Text role="h2" as="h2">{content.headline}</Text>
              {content.excerpt && <Text role="lead">{content.excerpt}</Text>}
              {content.byline && (
                <Text role="meta">
                  {content.byline.name}{content.byline.role && ` · ${content.byline.role}`}
                </Text>
              )}
              {content.cta && <TextLink href={content.cta.href} arrow>{content.cta.label}</TextLink>}
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 5: Add re-export**

```ts
// src/system/examples/StoryTeaser/index.ts
export { StoryTeaser, type StoryTeaserProps } from './StoryTeaser'
export type { StoryTeaserContent } from './types'
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/system/examples/StoryTeaser/StoryTeaser.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 7: Commit**

```bash
git add src/system/examples/StoryTeaser/
git commit -m "feat(examples): add StoryTeaser example block"
```

---

## Task 38: `ThemedAccordion` example block (interactive theme override)

**Files:**
- Create: `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`, `types.ts`, `ThemedAccordion.test.tsx`, `ThemedAccordion.module.css`, `index.ts`

- [ ] **Step 1: Write failing test**

```tsx
// src/system/examples/ThemedAccordion/ThemedAccordion.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeOverrideProvider } from '@system/hooks'
import { ThemedAccordion } from './ThemedAccordion'

function setup() {
  return render(
    <ThemeOverrideProvider>
      <ThemedAccordion content={{ theme: 'clay', summary: 'Family' }}>
        <div>Inner</div>
      </ThemedAccordion>
    </ThemeOverrideProvider>
  )
}

describe('ThemedAccordion', () => {
  it('renders the summary text', () => {
    setup()
    expect(screen.getByText('Family')).toBeInTheDocument()
  })

  it('does not set page theme when closed', () => {
    document.body.removeAttribute('data-theme')
    setup()
    expect(document.body.hasAttribute('data-theme')).toBe(false)
  })

  it('sets page theme to clay when opened', () => {
    document.body.removeAttribute('data-theme')
    const { container } = setup()
    const details = container.querySelector('details')!
    fireEvent.click(container.querySelector('summary')!)
    // jsdom doesn't toggle details on click — simulate the toggle event explicitly
    details.open = true
    fireEvent(details, new Event('toggle'))
    expect(document.body.getAttribute('data-theme')).toBe('clay')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/system/examples/ThemedAccordion/ThemedAccordion.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create content type**

```ts
// src/system/examples/ThemedAccordion/types.ts
import type { ThemeName } from '@tokens/themes'

export type ThemedAccordionContent = {
  summary: string
  theme: ThemeName
}
```

- [ ] **Step 4: Implement CSS module**

```css
/* src/system/examples/ThemedAccordion/ThemedAccordion.module.css */
.root {
  border-block-start: var(--border-hairline) solid var(--color-border-subtle);
  border-block-end:   var(--border-hairline) solid var(--color-border-subtle);
  padding-block: var(--space-stack-loose);
}

.summary {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none;
}

.summary::-webkit-details-marker { display: none; }

.body {
  padding-block-start: var(--space-stack-default);
}
```

- [ ] **Step 5: Implement ThemedAccordion**

```tsx
// src/system/examples/ThemedAccordion/ThemedAccordion.tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { useState, type ReactNode } from 'react'
import { Text, Icon } from '@system/primitives'
import { useThemeOverride } from '@system/hooks'
import type { ThemedAccordionContent } from './types'
import s from './ThemedAccordion.module.css'

export type ThemedAccordionProps = {
  content: ThemedAccordionContent
  children: ReactNode
}

export function ThemedAccordion({ content, children }: ThemedAccordionProps) {
  const [open, setOpen] = useState(false)
  useThemeOverride(open ? content.theme : null)
  return (
    <details className={s.root} onToggle={e => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary className={s.summary}>
        <Text role="h3" as="span">{content.summary}</Text>
        <Icon name={open ? 'check' : 'arrow-right'} size="md" aria-hidden />
      </summary>
      <div className={s.body}>{children}</div>
    </details>
  )
}
```

- [ ] **Step 6: Add re-export**

```ts
// src/system/examples/ThemedAccordion/index.ts
export { ThemedAccordion, type ThemedAccordionProps } from './ThemedAccordion'
export type { ThemedAccordionContent } from './types'
```

- [ ] **Step 7: Run test, verify it passes**

Run: `npm test -- src/system/examples/ThemedAccordion/ThemedAccordion.test.tsx`
Expected: PASS, 3 tests.

- [ ] **Step 8: Commit**

```bash
git add src/system/examples/ThemedAccordion/
git commit -m "feat(examples): add ThemedAccordion (interactive page-wide theme override)"
```

---

# Phase 11 — Storybook Setup

## Task 39: Install Storybook + base config

**Files:**
- Modify: `package.json`, `tsconfig.json`
- Create (via init): `.storybook/main.ts`, `.storybook/preview.tsx`

- [ ] **Step 1: Initialize Storybook**

```bash
npx storybook@latest init --type react --builder vite --yes
```

This installs `storybook`, `@storybook/react-vite`, `@storybook/addon-essentials`, `@storybook/addon-a11y`, generates `.storybook/main.ts` and `.storybook/preview.tsx`, and adds example stories under `src/stories/`. Delete the auto-generated example stories (we'll add real ones):

```bash
rm -rf src/stories/Button.* src/stories/Header.* src/stories/Page.* src/stories/button.css src/stories/header.css src/stories/page.css src/stories/assets src/stories/Configure.mdx
```

(Keep `src/stories/foundations/` and `src/stories/pages/` directories.)

- [ ] **Step 2: Replace `.storybook/main.ts`**

```ts
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/stories/foundations/**/*.mdx',
    '../src/stories/foundations/**/*.stories.@(ts|tsx)',
    '../src/system/examples/**/*.stories.@(ts|tsx)',
    '../src/stories/pages/**/*.stories.@(ts|tsx)'
  ],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { backgrounds: false } // themes replace backgrounds
    },
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  typescript: { reactDocgen: 'react-docgen-typescript' }
}

export default config
```

- [ ] **Step 3: Add `tsx`-friendly preview file**

If init created `.storybook/preview.ts`, rename to `.storybook/preview.tsx`. Replace contents (we'll flesh this out in Task 40):

```tsx
import type { Preview } from '@storybook/react'
import '../src/system/styles/global.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
    layout: 'fullscreen'
  }
}

export default preview
```

- [ ] **Step 4: Verify Storybook starts**

```bash
npm run storybook
```

Expected: opens at `http://localhost:6006` with an empty sidebar (no stories yet — that's fine). Stop the server.

- [ ] **Step 5: Commit**

```bash
git add .storybook package.json package-lock.json src/stories tsconfig.json
git commit -m "chore(storybook): install Storybook 8 + addon-a11y, clean default examples"
```

---

## Task 40: Theme decorator + viewport + reduced-motion toolbar

**Files:**
- Modify: `.storybook/preview.tsx`
- Create: `.storybook/decorators/withTheme.tsx`
- Create: `.storybook/decorators/withReducedMotion.tsx`
- Create: `.storybook/decorators/withProviders.tsx`

- [ ] **Step 1: Create `withTheme` decorator**

```tsx
// .storybook/decorators/withTheme.tsx
import { useEffect } from 'react'
import type { Decorator } from '@storybook/react'

export const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'bone'
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    return () => {
      document.documentElement.setAttribute('data-theme', 'bone')
    }
  }, [theme])
  return <Story />
}
```

- [ ] **Step 2: Create `withReducedMotion` decorator**

```tsx
// .storybook/decorators/withReducedMotion.tsx
import { useEffect } from 'react'
import type { Decorator } from '@storybook/react'

export const withReducedMotion: Decorator = (Story, context) => {
  const reduced = context.globals.reducedMotion === 'on'
  useEffect(() => {
    if (reduced) {
      document.documentElement.classList.add('force-reduced-motion')
    } else {
      document.documentElement.classList.remove('force-reduced-motion')
    }
    return () => {
      document.documentElement.classList.remove('force-reduced-motion')
    }
  }, [reduced])
  return <Story />
}
```

Add a global CSS hook for force-reduced-motion in `src/system/styles/global.css` (append at the end):

```css
.force-reduced-motion *,
.force-reduced-motion *::before,
.force-reduced-motion *::after {
  animation-duration: 0ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0ms !important;
  scroll-behavior: auto !important;
}
```

- [ ] **Step 3: Create `withProviders` decorator**

```tsx
// .storybook/decorators/withProviders.tsx
import type { Decorator } from '@storybook/react'
import { ThemeOverrideProvider } from '../../src/system/hooks'

export const withProviders: Decorator = (Story) => (
  <ThemeOverrideProvider>
    <Story />
  </ThemeOverrideProvider>
)
```

- [ ] **Step 4: Wire up preview.tsx**

Replace `.storybook/preview.tsx`:

```tsx
import type { Preview } from '@storybook/react'
import '../src/system/styles/global.css'
import { withTheme } from './decorators/withTheme'
import { withReducedMotion } from './decorators/withReducedMotion'
import { withProviders } from './decorators/withProviders'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
    layout: 'fullscreen',
    viewport: {
      viewports: {
        sm: { name: 'sm (mobile)',  styles: { width: '375px',  height: '812px' } },
        md: { name: 'md (tablet)',  styles: { width: '900px',  height: '1200px' } },
        lg: { name: 'lg (desktop)', styles: { width: '1440px', height: '1000px' } }
      }
    },
    options: {
      storySort: {
        order: ['Foundations', ['Introduction', 'Tokens & Architecture', 'Color', 'Typography', 'Spacing & Sizing', 'Layout & 5-Column Grid', 'Theming', 'Motion', 'Accessibility'], 'Examples', 'Pages']
      }
    }
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Sets data-theme on <html>',
      defaultValue: 'bone',
      toolbar: {
        icon: 'paintbrush',
        title: 'Theme',
        items: [
          { value: 'bone',        title: 'Bone (default)' },
          { value: 'bone-raised', title: 'Bone raised' },
          { value: 'sky',         title: 'Sky' },
          { value: 'clay',        title: 'Clay' },
          { value: 'sage',        title: 'Sage' },
          { value: 'ink',         title: 'Ink' },
          { value: 'campaign',    title: 'Campaign (fallback)' }
        ],
        dynamicTitle: true
      }
    },
    reducedMotion: {
      name: 'Reduced motion',
      description: 'Force prefers-reduced-motion behavior',
      defaultValue: 'off',
      toolbar: {
        icon: 'lightning',
        title: 'Reduced motion',
        items: [
          { value: 'off', title: 'Off' },
          { value: 'on',  title: 'On' }
        ]
      }
    }
  },
  decorators: [withProviders, withReducedMotion, withTheme]
}

export default preview
```

- [ ] **Step 5: Smoke-check Storybook**

```bash
npm run storybook
```

Expected: opens at `http://localhost:6006`; toolbar has Theme + Reduced motion controls; sidebar is empty. Stop.

- [ ] **Step 6: Commit**

```bash
git add .storybook src/system/styles/global.css
git commit -m "chore(storybook): add theme/reduced-motion globals, viewports, providers"
```

---

## Task 41: Storybook chrome theme (bone background)

**Files:**
- Create: `.storybook/manager.ts`, `.storybook/sbTheme.ts`

- [ ] **Step 1: Create custom Storybook theme**

```ts
// .storybook/sbTheme.ts
import { create } from '@storybook/theming/create'

export default create({
  base: 'light',
  brandTitle: 'Move to Gothenburg — Foundations',
  colorPrimary: '#0A1020',
  colorSecondary: '#7C9BBE',

  appBg:        '#FBF8F3',
  appContentBg: '#FBF8F3',
  appBorderColor: 'rgba(10,16,32,0.10)',
  appBorderRadius: 0,

  textColor:        '#121A2E',
  textInverseColor: '#FBF8F3',

  barTextColor:       '#1B2740',
  barSelectedColor:   '#0A1020',
  barBg:              '#F5EFE5',

  inputBg:           '#FFFFFF',
  inputBorder:       'rgba(10,16,32,0.14)',
  inputTextColor:    '#0A1020',
  inputBorderRadius: 2,

  fontBase: `'Satoshi', 'Inter', system-ui, sans-serif`,
  fontCode: 'ui-monospace, SFMono-Regular, monospace'
})
```

- [ ] **Step 2: Apply theme via manager**

```ts
// .storybook/manager.ts
import { addons } from '@storybook/manager-api'
import theme from './sbTheme'

addons.setConfig({ theme })
```

- [ ] **Step 3: Restart Storybook and confirm visually**

```bash
npm run storybook
```

Expected: Storybook chrome now has the bone background + navy text. Stop.

- [ ] **Step 4: Commit**

```bash
git add .storybook/manager.ts .storybook/sbTheme.ts
git commit -m "chore(storybook): custom bone/navy chrome theme"
```

---

# Phase 12 — Foundation Stories

MDX foundation pages use the system's own primitives in their visual examples. Realistic copy, never lorem.

## Task 42: Introduction + Tokens & Architecture MDX

**Files:**
- Create: `src/stories/foundations/Introduction.mdx`, `src/stories/foundations/TokensArchitecture.mdx`

- [ ] **Step 1: Create `Introduction.mdx`**

```mdx
{/* src/stories/foundations/Introduction.mdx */}
import { Meta } from '@storybook/blocks'

<Meta title="Foundations/Introduction" />

# Move to Gothenburg — Design System Foundations

A token-driven foundation for a future Move to Gothenburg digital platform. Built to support content about international professionals, families, jobs, communities, and AI-assisted moving guidance.

**This is foundations only.** Tokens, layout primitives, theming, motion, and example pages — not a production component library.

## How to read this Storybook

- **Foundations** — the building blocks: color, type, spacing, layout, theming, motion, accessibility.
- **Examples** — _not production components._ Simple blocks that demonstrate the foundations.
- **Pages** — assembled examples showing how the foundations create a cohesive editorial experience.

Use the **Theme** toolbar to preview any story on bone / sky / clay / sage / ink / campaign surfaces. Use the **Reduced motion** toggle to verify accessible behavior.

## Three rules the whole system enforces

1. **No raw color, spacing, or font values in any component.** Only CSS vars.
2. **Layout primitives are the only place spacing or themes are set.**
3. **Theme variants remap semantic tokens, never re-style components.**
```

- [ ] **Step 2: Create `TokensArchitecture.mdx`**

```mdx
{/* src/stories/foundations/TokensArchitecture.mdx */}
import { Meta } from '@storybook/blocks'

<Meta title="Foundations/Tokens & Architecture" />

# Tokens & Architecture

Tokens flow in one direction: **primitive → semantic → component**.

## Layers

- **Primitives** (`src/tokens/primitives/`) — raw values. Components never read these directly.
- **Semantic** (`src/tokens/semantic/`) — usage and intent. Roles like `text-default`, `surface-page`, `section-y-lg`.
- **Themes** (`src/tokens/themes/`) — complete remaps of semantic color roles. Applied via `[data-theme="..."]`.

## Build

```bash
npm run tokens:build
```

Reads the TS token graph and emits:
- `src/tokens/generated/tokens.css` — all primitives and semantic vars, plus a block per theme.
- `src/tokens/generated/tokens.types.ts` — typed re-exports.

The build fails if any theme's text-on-surface combination is below WCAG AA (4.5:1).

## Adding a new theme

One file. Add an entry to `src/tokens/themes/index.ts`; rebuild. No component changes.

## Three discipline rules

1. **No raw hex or px in `src/system/`.** Enforced by ESLint + Stylelint.
2. **No new color tokens without a semantic role.**
3. **A component never queries the theme.** Visuals come from CSS vars.
```

- [ ] **Step 3: Verify rendering in Storybook**

```bash
npm run storybook
```

Expected: sidebar shows Foundations → Introduction + Tokens & Architecture. Stop.

- [ ] **Step 4: Commit**

```bash
git add src/stories/foundations/Introduction.mdx src/stories/foundations/TokensArchitecture.mdx
git commit -m "docs(storybook): add Introduction + Tokens & Architecture MDX"
```

---

## Task 43: Color foundation story

**Files:**
- Create: `src/stories/foundations/Color.stories.tsx`, `src/stories/foundations/_internal/Swatch.tsx`, `_internal/Swatch.module.css`

- [ ] **Step 1: Create swatch helper**

`src/stories/foundations/_internal/Swatch.module.css`:

```css
.swatch {
  display: flex;
  flex-direction: column;
  gap: var(--space-stack-tight);
}

.chip {
  inline-size: 100%;
  block-size: 96px;
  border-radius: var(--radius-md);
  border: var(--border-hairline) solid var(--color-border-subtle);
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-grid-gutter-md);
}
```

`src/stories/foundations/_internal/Swatch.tsx`:

```tsx
import { Text } from '@system/primitives'
import s from './Swatch.module.css'

export function Swatch({ name, value, color }: { name: string; value: string; color: string }) {
  return (
    <div className={s.swatch}>
      <div className={s.chip} style={{ background: color }} />
      <Text role="meta" as="span">{name}</Text>
      <Text role="caption" tone="muted" as="span">{value}</Text>
    </div>
  )
}

export function SwatchRow({ children }: { children: React.ReactNode }) {
  return <div className={s.row}>{children}</div>
}
```

- [ ] **Step 2: Create Color story**

```tsx
// src/stories/foundations/Color.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text } from '@system/primitives'
import { palette } from '@tokens/primitives/color'
import { themeNames } from '@tokens/themes'
import { Swatch, SwatchRow } from './_internal/Swatch'

const meta: Meta = { title: 'Foundations/Color' }
export default meta

type S = StoryObj

export const Primitives: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Text role="display" as="h1">Color primitives</Text>
          <Text role="lead">Five families. Reserved tints (600) exist for future deeper themes.</Text>
          {Object.entries(palette).map(([family, shades]) => (
            <Stack key={family} gap="default">
              <Text role="h3" as="h2">{family}</Text>
              <SwatchRow>
                {Object.entries(shades).map(([shade, value]) => (
                  <Swatch key={shade} name={`--${family}-${shade}`} value={value} color={value} />
                ))}
              </SwatchRow>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Section>
  )
}

export const ThemeRhythm: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map(theme => (
        <Section key={theme} theme={theme} spacing="md">
          <Container>
            <Stack gap="snug">
              <Text role="tag" tone="muted">data-theme="{theme}"</Text>
              <Text role="h2">A warm welcome to a new city.</Text>
              <Text role="body">Strong text sits comfortably on every theme. Borders, focus rings and accents adapt automatically.</Text>
            </Stack>
          </Container>
        </Section>
      ))}
    </Stack>
  )
}
```

- [ ] **Step 3: Verify**

```bash
npm run storybook
```

Expected: Foundations → Color shows Primitives + ThemeRhythm stories. Toggle theme in toolbar to confirm rhythm.

- [ ] **Step 4: Commit**

```bash
git add src/stories/foundations/Color.stories.tsx src/stories/foundations/_internal
git commit -m "docs(storybook): add Color foundation stories (primitives + theme rhythm)"
```

---

## Task 44: Typography foundation story

**Files:**
- Create: `src/stories/foundations/Typography.stories.tsx`

- [ ] **Step 1: Create story**

```tsx
// src/stories/foundations/Typography.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, Grid, Col } from '@system/primitives'
import type { TextRole } from '@tokens/semantic/type'

const meta: Meta = { title: 'Foundations/Typography' }
export default meta

type S = StoryObj

const roles: TextRole[] = ['display','hero','h1','h2','h3','lead','body','body-sm','caption','meta','tag','quote','button']
const sampleText: Record<TextRole, string> = {
  display:   'Move to Gothenburg.',
  hero:      'A different kind of move.',
  h1:        'Living by the water.',
  h2:        'Family and partner support.',
  h3:        'Industry & careers.',
  lead:      'A practical guide for international professionals, partners, and families.',
  body:      'West Sweden is a region of purposeful work, livability, and quiet ambition. There is room here to do good work, and room to live alongside it.',
  'body-sm': 'Secondary copy reads at smaller size with the same generous leading.',
  caption:   'Photograph by Sara P. — Hisingen, 2025.',
  meta:      'Posted 3 days ago',
  tag:       'Stories',
  quote:     'I came for the job. I stayed for the rhythm of the place.',
  button:    'Read the story'
}

export const Roles: S = {
  render: () => (
    <Section spacing="lg">
      <Container size="prose">
        <Stack gap="xl">
          <Text role="display" as="h1">Typography</Text>
          {roles.map(role => (
            <Stack key={role} gap="snug">
              <Text role="tag" tone="muted">role="{role}"</Text>
              <Text role={role}>{sampleText[role]}</Text>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Section>
  )
}

export const Composition: S = {
  render: () => (
    <Section spacing="xl">
      <Container>
        <Grid>
          <Col span={{ lg: 2 }}>
            <Text role="tag" tone="muted">Edition 01 · Welcome</Text>
          </Col>
          <Col span={{ lg: 3 }}>
            <Stack gap="loose">
              <Text role="display" as="h1">Move to Gothenburg.</Text>
              <Text role="lead">A different kind of move — practical, warm, and built around the real questions people ask before relocating.</Text>
              <Text role="body">This page demonstrates the discipline rule: maximum three distinct text roles in a single viewport.</Text>
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 2: Verify in Storybook, then commit**

```bash
git add src/stories/foundations/Typography.stories.tsx
git commit -m "docs(storybook): add Typography foundation stories (roles + composition)"
```

---

## Task 45: Spacing & Sizing foundation story

**Files:**
- Create: `src/stories/foundations/Spacing.stories.tsx`

- [ ] **Step 1: Create story**

```tsx
// src/stories/foundations/Spacing.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, Grid, Col } from '@system/primitives'
import { space } from '@tokens/primitives/space'

const meta: Meta = { title: 'Foundations/Spacing & Sizing' }
export default meta

type S = StoryObj

export const Scale: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Text role="display" as="h1">Spacing scale</Text>
          <Text role="lead">Twelve steps from 0 to 256. Consumed only via semantic roles in components.</Text>
          <Stack gap="default">
            {Object.entries(space).map(([k, v]) => (
              <Grid key={k}>
                <Col span={{ lg: 1 }}><Text role="meta">space[{k}]</Text></Col>
                <Col span={{ lg: 1 }}><Text role="meta" tone="muted">{v}</Text></Col>
                <Col span={{ lg: 3 }}>
                  <div style={{ height: '16px', width: v, background: 'var(--color-accent-line)' }} />
                </Col>
              </Grid>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Section>
  )
}

export const SectionRhythm: S = {
  render: () => (
    <>
      {(['sm','md','lg','xl'] as const).map(s => (
        <Section key={s} spacing={s}>
          <Container>
            <Stack gap="snug">
              <Text role="tag" tone="muted">spacing="{s}"</Text>
              <Text role="h2">A section with {s} vertical rhythm.</Text>
            </Stack>
          </Container>
        </Section>
      ))}
    </>
  )
}
```

- [ ] **Step 2: Verify and commit**

```bash
git add src/stories/foundations/Spacing.stories.tsx
git commit -m "docs(storybook): add Spacing foundation stories (scale + section rhythm)"
```

---

## Task 46: Layout & 5-Column Grid story

**Files:**
- Create: `src/stories/foundations/Layout.stories.tsx`, `src/stories/foundations/_internal/GridOverlay.tsx`, `_internal/GridOverlay.module.css`

- [ ] **Step 1: Create grid overlay helper**

`src/stories/foundations/_internal/GridOverlay.module.css`:

```css
.overlay {
  position: relative;
}

.overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right,
      transparent 0,
      transparent calc((100% - var(--space-grid-gutter-lg) * 4) / 5),
      var(--color-accent-line) 0,
      var(--color-accent-line) calc((100% - var(--space-grid-gutter-lg) * 4) / 5 + 1px),
      transparent 0
    );
  opacity: 0.15;
}
```

`src/stories/foundations/_internal/GridOverlay.tsx`:

```tsx
import type { ReactNode } from 'react'
import s from './GridOverlay.module.css'

export function GridOverlay({ children, on }: { children: ReactNode; on: boolean }) {
  return <div className={on ? s.overlay : ''}>{children}</div>
}

export function Block({ label }: { label: string }) {
  return (
    <div style={{
      background: 'var(--color-surface-raised)',
      padding: 'var(--space-stack-loose)',
      borderRadius: 'var(--radius-sm)',
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-sm)',
      color: 'var(--color-text-muted)'
    }}>{label}</div>
  )
}
```

- [ ] **Step 2: Create Layout story**

```tsx
// src/stories/foundations/Layout.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Grid, Col, Stack, Text } from '@system/primitives'
import { Block } from './_internal/GridOverlay'

const meta: Meta = { title: 'Foundations/Layout & 5-Column Grid' }
export default meta

type S = StoryObj

function Composition({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap="snug">
      <Text role="tag" tone="muted">{title}</Text>
      <Grid>{children}</Grid>
    </Stack>
  )
}

export const Compositions: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Text role="display" as="h1">5-column compositions</Text>

          <Composition title="Full · span 5">
            <Col span={{ lg: 5 }}><Block label="5" /></Col>
          </Composition>

          <Composition title="Asym left · 2 + 3">
            <Col span={{ lg: 2 }}><Block label="2" /></Col>
            <Col span={{ lg: 3 }}><Block label="3" /></Col>
          </Composition>

          <Composition title="Asym right · 3 + 2">
            <Col span={{ lg: 3 }}><Block label="3" /></Col>
            <Col span={{ lg: 2 }}><Block label="2" /></Col>
          </Composition>

          <Composition title="Lead column · 1 + 3 (start col 2)">
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 3 }} start={{ lg: 2 }}><Block label="3 @ col 2" /></Col>
          </Composition>

          <Composition title="Wide single · 3 starting col 2">
            <Col span={{ lg: 3 }} start={{ lg: 2 }}><Block label="3 @ col 2 (col 1 + 5 = air)" /></Col>
          </Composition>

          <Composition title="Sidekick · 1 + 4">
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 4 }}><Block label="4" /></Col>
          </Composition>

          <Composition title="Even pair · 2 + 2 (col 5 air)">
            <Col span={{ lg: 2 }}><Block label="2" /></Col>
            <Col span={{ lg: 2 }}><Block label="2" /></Col>
          </Composition>

          <Composition title="Five-up · 1+1+1+1+1 (use rarely)">
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
          </Composition>
        </Stack>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 3: Verify across viewports**

Open Storybook → Foundations → Layout → Compositions, then toggle the viewport addon: sm collapses to 1 column, md to 2, lg shows the 5-column compositions.

- [ ] **Step 4: Commit**

```bash
git add src/stories/foundations/Layout.stories.tsx src/stories/foundations/_internal/GridOverlay.*
git commit -m "docs(storybook): add Layout & 5-Column Grid story (canonical compositions)"
```

---

## Task 47: Theming foundation story

**Files:**
- Create: `src/stories/foundations/Theming.stories.tsx`

- [ ] **Step 1: Create story**

```tsx
// src/stories/foundations/Theming.stories.tsx
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, TextLink } from '@system/primitives'
import { useThemeOverride } from '@system/hooks'
import { themeNames, type ThemeName } from '@tokens/themes'

const meta: Meta = { title: 'Foundations/Theming' }
export default meta

type S = StoryObj

function ThemedRow({ theme }: { theme: ThemeName }) {
  return (
    <Section theme={theme} spacing="md">
      <Container>
        <Stack gap="snug">
          <Text role="tag" tone="muted">data-theme="{theme}"</Text>
          <Text role="h2">Move to Gothenburg.</Text>
          <Text role="body">All theme switching happens on a single attribute. Components don't know which theme they're in.</Text>
          <TextLink href="#" arrow>Read more</TextLink>
        </Stack>
      </Container>
    </Section>
  )
}

export const AllThemes: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map(t => <ThemedRow key={t} theme={t} />)}
    </Stack>
  )
}

function Demo({ active }: { active: ThemeName | null }) {
  useThemeOverride(active)
  return null
}

export const InteractiveOverride: S = {
  render: () => {
    const [active, setActive] = useState<ThemeName | null>(null)
    return (
      <Section spacing="lg">
        <Container>
          <Stack gap="loose">
            <Text role="display" as="h1">Interactive override</Text>
            <Text role="lead">Toggle a theme below. The entire page re-skins via <code>useThemeOverride</code>. Toggle off to revert.</Text>
            <Stack gap="default" align="start">
              {(['sky','clay','sage','ink'] as ThemeName[]).map(t => (
                <TextLink key={t} href="#" onClick={(e) => { e.preventDefault(); setActive(active === t ? null : t) }}>
                  {active === t ? `Clear ${t}` : `Apply ${t}`}
                </TextLink>
              ))}
            </Stack>
          </Stack>
        </Container>
        <Demo active={active} />
      </Section>
    )
  }
}
```

- [ ] **Step 2: Verify**

In Storybook, open Theming → InteractiveOverride. Clicking links should reskin the whole page.

- [ ] **Step 3: Commit**

```bash
git add src/stories/foundations/Theming.stories.tsx
git commit -m "docs(storybook): add Theming stories (all themes + interactive override)"
```

---

## Task 48: Motion foundation story

**Files:**
- Create: `src/stories/foundations/Motion.stories.tsx`

- [ ] **Step 1: Create story**

```tsx
// src/stories/foundations/Motion.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, Image } from '@system/primitives'
import { useReveal, useScrollFade } from '@system/hooks'
import { duration, easing } from '@tokens/primitives/motion'

const meta: Meta = { title: 'Foundations/Motion' }
export default meta

type S = StoryObj

export const Tokens: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Text role="display" as="h1">Motion tokens</Text>

          <Stack gap="default">
            <Text role="h2">Durations</Text>
            {Object.entries(duration).map(([k, v]) => (
              <Stack key={k} gap="tight">
                <Text role="meta">--duration-{k} · {v}</Text>
                <div style={{
                  height: '24px',
                  width: '40%',
                  background: 'var(--color-accent-line)',
                  borderRadius: 'var(--radius-sm)',
                  animation: `slide ${v} var(--easing-standard) infinite alternate`
                }} />
              </Stack>
            ))}
          </Stack>

          <Stack gap="default">
            <Text role="h2">Easings</Text>
            {Object.entries(easing).map(([k, v]) => (
              <Stack key={k} gap="tight">
                <Text role="meta">--easing-{k}</Text>
                <Text role="caption" tone="muted">{v}</Text>
              </Stack>
            ))}
          </Stack>

          <style>{`
            @keyframes slide {
              from { transform: translateX(0); }
              to   { transform: translateX(60%); }
            }
          `}</style>
        </Stack>
      </Container>
    </Section>
  )
}

function RevealDemo() {
  const { ref, revealed } = useReveal()
  return (
    <div
      ref={ref as any}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity var(--motion-reveal-duration) var(--motion-reveal-easing), transform var(--motion-reveal-duration) var(--motion-reveal-easing)`
      }}
    >
      <Text role="hero" as="h2">Scroll-revealed text.</Text>
    </div>
  )
}

export const Reveal: S = {
  render: () => (
    <>
      <Section spacing="xl"><Container><Text role="body">Scroll down…</Text></Container></Section>
      <Section spacing="xl"><Container><Text role="body">…and a little more…</Text></Container></Section>
      <Section spacing="xl"><Container><RevealDemo /></Container></Section>
    </>
  )
}

function ScrollFadeDemo() {
  const { ref, progress } = useScrollFade()
  return (
    <div ref={ref as any} style={{ opacity: 1 - progress * 0.7 }}>
      <Image src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1600" alt="Coastal forest" aspect="cinematic" radius="md" />
    </div>
  )
}

export const ScrollFade: S = {
  render: () => (
    <>
      <Section spacing="xl"><Container><ScrollFadeDemo /></Container></Section>
      <Section spacing="xl"><Container><Text role="body">Scroll the image up — opacity follows scroll progress.</Text></Container></Section>
    </>
  )
}
```

- [ ] **Step 2: Verify reveal + scroll fade visually**

```bash
npm run storybook
```

Open Foundations → Motion → Reveal, scroll the canvas. Then ScrollFade.

- [ ] **Step 3: Commit**

```bash
git add src/stories/foundations/Motion.stories.tsx
git commit -m "docs(storybook): add Motion stories (tokens + reveal + scroll-fade)"
```

---

## Task 49: Accessibility foundation story

**Files:**
- Create: `src/stories/foundations/Accessibility.stories.tsx`

- [ ] **Step 1: Create story**

```tsx
// src/stories/foundations/Accessibility.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, TextLink, Inline, Icon } from '@system/primitives'

const meta: Meta = { title: 'Foundations/Accessibility' }
export default meta

type S = StoryObj

export const FocusStates: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="loose">
          <Text role="display" as="h1">Focus states</Text>
          <Text role="lead">Tab through the controls below. The focus ring uses sky-400 on every theme; switch themes in the toolbar.</Text>
          <Inline gap="loose" wrap>
            <button>Button</button>
            <a href="#">Native link</a>
            <TextLink href="#" arrow>System TextLink</TextLink>
            <input type="text" placeholder="Input" />
          </Inline>
        </Stack>
      </Container>
    </Section>
  )
}

export const SkipLink: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <a className="sr-only" href="#main-content">Skip to main content</a>
        <Stack gap="loose">
          <Text role="display" as="h1">Skip link</Text>
          <Text role="lead">Tab into this story — the first focusable is a visually-hidden "Skip to main content" link.</Text>
          <div id="main-content">
            <Text role="body">This is the main content target.</Text>
          </div>
        </Stack>
      </Container>
    </Section>
  )
}

export const StatusSignaling: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="loose">
          <Text role="display" as="h1">Status signaling</Text>
          <Text role="lead">Color is paired with an icon + text — never the sole signal.</Text>
          <Stack gap="default">
            <Inline gap="default"><Icon name="check" size="md" aria-hidden /><Text role="body" tone="strong">Approved</Text></Inline>
            <Inline gap="default"><Icon name="arrow-right" size="md" aria-hidden /><Text role="body" tone="muted">In progress</Text></Inline>
          </Stack>
        </Stack>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 2: Verify**

In Storybook, Foundations → Accessibility. Open the a11y panel; expect zero violations.

- [ ] **Step 3: Commit**

```bash
git add src/stories/foundations/Accessibility.stories.tsx
git commit -m "docs(storybook): add Accessibility stories (focus, skip link, status signaling)"
```

---

# Phase 13 — Example Block Stories

Each block gets a story file co-located with the component, exporting the required content variants: **Default**, **Short**, **Long**, **NoImage**, **NoCTA**, **EmptyOptionals**, **ThemeVariants**. Where a variant is irrelevant (e.g. NoImage on a no-image block), it's omitted.

A small shared "fixtures" helper exposes realistic placeholder copy so stories never use lorem ipsum.

## Task 50: Story fixtures (shared realistic copy)

**Files:**
- Create: `src/stories/_fixtures/copy.ts`, `src/stories/_fixtures/images.ts`

- [ ] **Step 1: Create copy fixtures**

```ts
// src/stories/_fixtures/copy.ts
// Realistic placeholder copy reflecting the platform's voice.
// Never lorem ipsum.

export const SHORT_HEADLINE = 'A different kind of move.'
export const LONG_HEADLINE  = 'A practical, warm guide for international professionals moving to Gothenburg and West Sweden.'

export const SHORT_LEAD = 'Built for the questions people actually ask before relocating.'
export const LONG_LEAD  = 'From housing and personnummer to childcare, weather, and weekend trips into the archipelago — start where you are, and let the city meet you halfway.'

export const SHORT_BODY = 'West Sweden has a quiet ambition. Room to do good work, and room to live alongside it.'
export const LONG_BODY  = 'West Sweden has a quiet ambition. The region is shaped by water, granite, and a kind of seriousness that never tips into self-importance. There is room here to do good work — at companies that take craft seriously — and room to live alongside it. Mornings begin with a walk to the tram. Evenings include the sea.'

export const STORY_EXCERPT = 'Sara moved from Madrid in early 2024 with her partner and two children. A year in, she shares what she wishes she had known about housing, language, and the rhythm of a Swedish week.'
```

- [ ] **Step 2: Create image fixtures**

```ts
// src/stories/_fixtures/images.ts
// Public Unsplash images. Replace with licensed photography before production.

export const IMAGES = {
  water:     { src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1600&q=80', alt: 'Coastal forest meeting the sea, West Sweden' },
  portrait:  { src: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1200&q=80', alt: 'Portrait of a woman with short hair in a warm interior' },
  archipelago: { src: 'https://images.unsplash.com/photo-1493217465235-252dd9c0d632?w=1600&q=80', alt: 'Wooden boats moored at a quiet archipelago harbor' },
  city:      { src: 'https://images.unsplash.com/photo-1601824581942-44f1a82c9d27?w=1600&q=80', alt: 'Tram crossing a Gothenburg avenue at dusk' },
  industry:  { src: 'https://images.unsplash.com/photo-1581091224003-d6d4e6cdbc6f?w=1600&q=80', alt: 'Engineers collaborating around a screen' }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/stories/_fixtures
git commit -m "chore(stories): add realistic copy + image fixtures"
```

---

## Task 51: HeroText stories

**Files:**
- Create: `src/system/examples/HeroText/HeroText.stories.tsx`

- [ ] **Step 1: Create story**

```tsx
// src/system/examples/HeroText/HeroText.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HeroText } from './HeroText'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'
import { SHORT_HEADLINE, LONG_HEADLINE, SHORT_LEAD, LONG_LEAD } from '../../../stories/_fixtures/copy'

const meta: Meta<typeof HeroText> = {
  title: 'Examples/HeroText',
  component: HeroText,
  parameters: {
    docs: {
      description: { component: 'EXAMPLE — demonstrates foundations only. Not a production component.' }
    }
  }
}
export default meta

type S = StoryObj<typeof HeroText>

export const Default: S = {
  args: { content: { eyebrow: 'Edition 01', headline: SHORT_HEADLINE, lead: SHORT_LEAD, cta: { label: 'Start here', href: '#' } } }
}

export const Short: S = { args: { content: { headline: SHORT_HEADLINE } } }
export const Long:  S = { args: { content: { eyebrow: 'Welcome', headline: LONG_HEADLINE, lead: LONG_LEAD, cta: { label: 'Open the guide', href: '#' } } } }
export const NoCTA: S = { args: { content: { headline: SHORT_HEADLINE, lead: SHORT_LEAD } } }
export const EmptyOptionals: S = { args: { content: { headline: SHORT_HEADLINE } } }

export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map((t: ThemeName) => (
        <HeroText key={t} content={{ eyebrow: t, headline: SHORT_HEADLINE, lead: SHORT_LEAD, theme: t }} />
      ))}
    </Stack>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run storybook
```

Open Examples → HeroText, page through stories.

- [ ] **Step 3: Commit**

```bash
git add src/system/examples/HeroText/HeroText.stories.tsx
git commit -m "docs(storybook): add HeroText stories (Default/Short/Long/NoCTA/Themes)"
```

---

## Task 52: EditorialText stories

**Files:**
- Create: `src/system/examples/EditorialText/EditorialText.stories.tsx`

```tsx
// src/system/examples/EditorialText/EditorialText.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { EditorialText } from './EditorialText'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'
import { SHORT_BODY, LONG_BODY } from '../../../stories/_fixtures/copy'

const meta: Meta<typeof EditorialText> = { title: 'Examples/EditorialText', component: EditorialText }
export default meta
type S = StoryObj<typeof EditorialText>

export const Default: S = { args: { content: { heading: 'A region of purposeful work.', paragraphs: [LONG_BODY], pullQuote: 'I came for the job. I stayed for the rhythm of the place.' } } }
export const Short:   S = { args: { content: { paragraphs: [SHORT_BODY] } } }
export const Long:    S = { args: { content: { heading: 'The shape of a Gothenburg week.', paragraphs: [LONG_BODY, LONG_BODY, LONG_BODY] } } }
export const NoHeading: S = { args: { content: { paragraphs: [LONG_BODY] } } }
export const NoPullQuote: S = { args: { content: { heading: 'Why we wrote this.', paragraphs: [SHORT_BODY] } } }
export const EmptyOptionals: S = { args: { content: { paragraphs: [SHORT_BODY] } } }
export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map((t: ThemeName) => (
        <EditorialText key={t} content={{ heading: `Theme: ${t}`, paragraphs: [SHORT_BODY], theme: t }} />
      ))}
    </Stack>
  )
}
```

- [ ] **Step 1: Add file shown above**

- [ ] **Step 2: Verify in Storybook**

- [ ] **Step 3: Commit**

```bash
git add src/system/examples/EditorialText/EditorialText.stories.tsx
git commit -m "docs(storybook): add EditorialText stories"
```

---

## Task 53: ImageText stories

**Files:**
- Create: `src/system/examples/ImageText/ImageText.stories.tsx`

```tsx
// src/system/examples/ImageText/ImageText.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ImageText } from './ImageText'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'
import { SHORT_HEADLINE, SHORT_BODY, LONG_HEADLINE, LONG_BODY } from '../../../stories/_fixtures/copy'
import { IMAGES } from '../../../stories/_fixtures/images'

const meta: Meta<typeof ImageText> = { title: 'Examples/ImageText', component: ImageText }
export default meta
type S = StoryObj<typeof ImageText>

const base = { headline: SHORT_HEADLINE, body: SHORT_BODY, image: IMAGES.water, cta: { label: 'Continue', href: '#' } }

export const Default: S       = { args: { content: { ...base } } }
export const Short: S         = { args: { content: { headline: SHORT_HEADLINE, image: IMAGES.water } } }
export const Long: S          = { args: { content: { eyebrow: 'Region', headline: LONG_HEADLINE, body: LONG_BODY, image: IMAGES.archipelago } } }
export const Reversed: S      = { args: { content: { ...base, reversed: true } } }
export const Bleed: S         = { args: { content: { ...base, bleed: true, image: IMAGES.water } } }
export const NoCTA: S         = { args: { content: { headline: SHORT_HEADLINE, body: SHORT_BODY, image: IMAGES.water } } }
export const EmptyOptionals: S = { args: { content: { headline: SHORT_HEADLINE, image: IMAGES.water } } }
export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map((t: ThemeName) => (
        <ImageText key={t} content={{ ...base, theme: t, image: IMAGES.water }} />
      ))}
    </Stack>
  )
}
```

- [ ] **Step 1: Add the file above**
- [ ] **Step 2: Verify in Storybook**
- [ ] **Step 3: Commit**

```bash
git add src/system/examples/ImageText/ImageText.stories.tsx
git commit -m "docs(storybook): add ImageText stories"
```

---

## Task 54: Signpost stories

**Files:**
- Create: `src/system/examples/Signpost/Signpost.stories.tsx`

```tsx
// src/system/examples/Signpost/Signpost.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Signpost } from './Signpost'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'

const meta: Meta<typeof Signpost> = { title: 'Examples/Signpost', component: Signpost }
export default meta
type S = StoryObj<typeof Signpost>

const items = [
  { label: 'Career', href: '/career', description: 'Find your role and your team.' },
  { label: 'Family', href: '/family', description: 'School, childcare, partner support.' },
  { label: 'Community', href: '/community', description: 'Where to land softly.' },
  { label: 'Housing', href: '/housing', description: 'Renting, buying, moving in.' }
]

export const Default: S = { args: { content: { heading: 'Start where you are', items } } }
export const Short: S   = { args: { content: { heading: 'Pick a path', items: items.slice(0, 2) } } }
export const Long: S    = { args: { content: { eyebrow: 'For your move', heading: 'Start where you are', items } } }
export const NoDescriptions: S = { args: { content: { heading: 'Pick a path', items: items.map(i => ({ label: i.label, href: i.href })) } } }
export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map((t: ThemeName) => (
        <Signpost key={t} content={{ heading: `Theme: ${t}`, items: items.slice(0,3), theme: t }} />
      ))}
    </Stack>
  )
}
```

- [ ] **Step 1: Add the file**
- [ ] **Step 2: Verify**
- [ ] **Step 3: Commit**

```bash
git add src/system/examples/Signpost/Signpost.stories.tsx
git commit -m "docs(storybook): add Signpost stories"
```

---

## Task 55: JobTeaser, ChecklistTeaser, AICompanionTeaser, StoryTeaser, ThemedAccordion stories

Five story files, same structure. Steps to follow for each: create the file with the content shown, verify in Storybook, commit.

**File 1 — `src/system/examples/JobTeaser/JobTeaser.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { JobTeaser } from './JobTeaser'
import { Section, Container, Grid, Col, Stack } from '@system/primitives'

const meta: Meta<typeof JobTeaser> = { title: 'Examples/JobTeaser', component: JobTeaser }
export default meta
type S = StoryObj<typeof JobTeaser>

const sample = { tag: 'Engineering', role: 'Senior Software Engineer', location: 'Gothenburg · Hybrid', summary: 'Help build the future of automotive software at a company that takes craft seriously.', meta: { company: 'Volvo Cars', posted: 'Posted 3 days ago' }, cta: { label: 'See role', href: '#' } }

export const Default: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Grid>
          <Col span={{ lg: 2 }}><JobTeaser content={sample} /></Col>
        </Grid>
      </Container>
    </Section>
  )
}

export const Short: S = { render: () => <Section spacing="lg"><Container><Grid><Col span={{ lg: 2 }}><JobTeaser content={{ role: 'Senior Engineer', location: 'Gothenburg' }} /></Col></Grid></Container></Section> }
export const ThreeUp: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Grid>
          <Col span={{ lg: 1 }}><Stack gap="snug">{/* meta column */}</Stack></Col>
          <Col span={{ lg: 1 }}><JobTeaser content={sample} /></Col>
          <Col span={{ lg: 1 }}><JobTeaser content={{ ...sample, role: 'UX Researcher', tag: 'Research' }} /></Col>
          <Col span={{ lg: 1 }}><JobTeaser content={{ ...sample, role: 'Battery Engineer', tag: 'Hardware' }} /></Col>
        </Grid>
      </Container>
    </Section>
  )
}
```

**File 2 — `src/system/examples/ChecklistTeaser/ChecklistTeaser.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ChecklistTeaser } from './ChecklistTeaser'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'

const meta: Meta<typeof ChecklistTeaser> = { title: 'Examples/ChecklistTeaser', component: ChecklistTeaser }
export default meta
type S = StoryObj<typeof ChecklistTeaser>

const items = [
  { label: 'Apply for personnummer', description: 'Skatteverket appointment, ~6 weeks lead time.' },
  { label: 'Sort temporary housing',  description: 'Short-let or company housing for the first 30 days.' },
  { label: 'Translate key documents', description: 'Birth certificates, marriage certificates, medical records.' },
  { label: 'Open a bank account',     description: 'Requires personnummer.' }
]

export const Default: S = { args: { content: { heading: 'Pre-arrival', items, intro: 'A few things to start on before you fly.' } } }
export const Short:   S = { args: { content: { heading: 'Pre-arrival', items: items.slice(0,2) } } }
export const Long:    S = { args: { content: { eyebrow: 'Step 1 of 3', heading: 'Pre-arrival', items, intro: 'A few things to start on before you fly.' } } }
export const EmptyOptionals: S = { args: { content: { heading: 'Pre-arrival', items: items.slice(0,2) } } }
export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {(['bone','clay','sage'] as ThemeName[]).map(t => (
        <ChecklistTeaser key={t} content={{ heading: `Theme: ${t}`, items: items.slice(0,3), theme: t }} />
      ))}
    </Stack>
  )
}
```

**File 3 — `src/system/examples/AICompanionTeaser/AICompanionTeaser.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { AICompanionTeaser } from './AICompanionTeaser'

const meta: Meta<typeof AICompanionTeaser> = { title: 'Examples/AICompanionTeaser', component: AICompanionTeaser }
export default meta
type S = StoryObj<typeof AICompanionTeaser>

export const Default: S = { args: { content: { eyebrow: 'Guide', headline: 'Ask the guide anything.', body: 'A quiet, AI-assisted companion for the real questions about your move.', prompt: 'How much does childcare cost in Gothenburg for a 3-year-old?', cta: { label: 'Open the guide', href: '#' } } } }
export const Short: S = { args: { content: { headline: 'Ask anything.', prompt: 'Where should I live?', cta: { label: 'Open', href: '#' } } } }
export const Long: S  = { args: { content: { eyebrow: 'AI moving companion', headline: 'A practical, patient guide built for relocation.', body: 'It draws on the rest of this platform — moving guides, stories, job data — so you get answers grounded in what real people have done.', prompt: 'My partner has a Swedish job offer. I work remotely for a UK firm. What does this look like tax-wise in our first year?', cta: { label: 'Open the guide', href: '#' } } } }
export const OnSky: S = { args: { content: { headline: 'On sky.', prompt: 'Try a different theme.', cta: { label: 'Open', href: '#' }, theme: 'sky' } } }
```

**File 4 — `src/system/examples/StoryTeaser/StoryTeaser.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { StoryTeaser } from './StoryTeaser'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'
import { STORY_EXCERPT } from '../../../stories/_fixtures/copy'
import { IMAGES } from '../../../stories/_fixtures/images'

const meta: Meta<typeof StoryTeaser> = { title: 'Examples/StoryTeaser', component: StoryTeaser }
export default meta
type S = StoryObj<typeof StoryTeaser>

const base = { tag: 'Stories', headline: 'Building a life by the archipelago', excerpt: STORY_EXCERPT, image: IMAGES.portrait, byline: { name: 'Sara P.', role: 'Researcher' }, cta: { label: 'Read Sara\'s story', href: '#' } }

export const Default: S = { args: { content: base } }
export const Short:   S = { args: { content: { headline: 'A short story.' } } }
export const Long:    S = { args: { content: { ...base, excerpt: STORY_EXCERPT + ' ' + STORY_EXCERPT } } }
export const NoImage: S = { args: { content: { ...base, image: undefined } } }
export const NoCTA:   S = { args: { content: { ...base, cta: undefined } } }
export const EmptyOptionals: S = { args: { content: { headline: base.headline } } }
export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map((t: ThemeName) => (
        <StoryTeaser key={t} content={{ ...base, theme: t }} />
      ))}
    </Stack>
  )
}
```

**File 5 — `src/system/examples/ThemedAccordion/ThemedAccordion.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ThemedAccordion } from './ThemedAccordion'
import { Section, Container, Stack, Text } from '@system/primitives'

const meta: Meta<typeof ThemedAccordion> = { title: 'Examples/ThemedAccordion', component: ThemedAccordion }
export default meta
type S = StoryObj<typeof ThemedAccordion>

export const Default: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="loose">
          <Text role="display" as="h1">Themed accordions</Text>
          <Text role="lead">Open one. The page reskins for as long as it is open.</Text>
          <ThemedAccordion content={{ summary: 'Family & partner support', theme: 'clay' }}>
            <Text role="body">Childcare, school options, partner work support, and community.</Text>
          </ThemedAccordion>
          <ThemedAccordion content={{ summary: 'Industry & careers', theme: 'sky' }}>
            <Text role="body">Volvo, Astra Zeneca, SKF, and the small studios doing quietly excellent work.</Text>
          </ThemedAccordion>
          <ThemedAccordion content={{ summary: 'Livability', theme: 'sage' }}>
            <Text role="body">The shape of a week. Light and dark seasons. Saturday saunas.</Text>
          </ThemedAccordion>
          <ThemedAccordion content={{ summary: 'AI moving guide', theme: 'ink' }}>
            <Text role="body">A patient companion for the real questions.</Text>
          </ThemedAccordion>
        </Stack>
      </Container>
    </Section>
  )
}
```

- [ ] **Step 1: Create all five story files**
- [ ] **Step 2: Verify each in Storybook**
- [ ] **Step 3: Commit**

```bash
git add src/system/examples/JobTeaser/JobTeaser.stories.tsx src/system/examples/ChecklistTeaser/ChecklistTeaser.stories.tsx src/system/examples/AICompanionTeaser/AICompanionTeaser.stories.tsx src/system/examples/StoryTeaser/StoryTeaser.stories.tsx src/system/examples/ThemedAccordion/ThemedAccordion.stories.tsx
git commit -m "docs(storybook): add stories for Job/Checklist/AI/Story/ThemedAccordion blocks"
```

---

# Phase 14 — Example Pages

Each page is a Storybook story that assembles example blocks in a real editorial flow.

## Task 56: Editorial homepage flow

**Files:**
- Create: `src/stories/pages/EditorialHomepage.stories.tsx`

- [ ] **Step 1: Create story**

```tsx
// src/stories/pages/EditorialHomepage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HeroText } from '@system/examples/HeroText'
import { ImageText } from '@system/examples/ImageText'
import { Signpost } from '@system/examples/Signpost'
import { EditorialText } from '@system/examples/EditorialText'
import { StoryTeaser } from '@system/examples/StoryTeaser'
import { AICompanionTeaser } from '@system/examples/AICompanionTeaser'
import { IMAGES } from '../_fixtures/images'

const meta: Meta = {
  title: 'Pages/Editorial homepage flow',
  parameters: {
    docs: { description: { component: 'EXAMPLE — assembled from foundation blocks. Theme rhythm: bone → ink → clay → bone → sage → bone → ink.' } }
  }
}
export default meta

type S = StoryObj

export const Page: S = {
  render: () => (
    <>
      <HeroText content={{ eyebrow: 'Edition 01', headline: 'Move to Gothenburg. A different kind of move.', lead: 'A practical, warm guide for international professionals, partners and families.', cta: { label: 'Start where you are', href: '#' }, theme: 'bone' }} />
      <ImageText content={{ headline: 'Water shapes the week.', body: 'The archipelago is not a weekend trip. It is part of the rhythm of the city.', image: IMAGES.water, theme: 'ink', bleed: true }} />
      <Signpost content={{ eyebrow: 'Pick a path', heading: 'Start where you are.', items: [
        { label: 'Career', href: '#', description: 'Find your role.' },
        { label: 'Family', href: '#', description: 'Childcare, schools, partner support.' },
        { label: 'Community', href: '#', description: 'Where to land softly.' },
        { label: 'Housing', href: '#', description: 'Renting, buying, moving in.' }
      ], theme: 'clay' }} />
      <EditorialText content={{ heading: 'A region of purposeful work.', paragraphs: [
        'West Sweden has a quiet ambition. It is shaped by water, granite, and a kind of seriousness that never tips into self-importance.',
        'There is room here to do good work — at companies that take craft seriously — and room to live alongside it.'
      ], pullQuote: 'I came for the job. I stayed for the rhythm of the place.', theme: 'bone' }} />
      <StoryTeaser content={{ tag: 'Stories', headline: 'Building a life by the archipelago.', excerpt: 'Sara moved from Madrid in 2024 with her partner and two children.', image: IMAGES.portrait, byline: { name: 'Sara P.', role: 'Researcher' }, cta: { label: 'Read Sara\'s story', href: '#' }, theme: 'sage' }} />
      <AICompanionTeaser content={{ eyebrow: 'AI moving companion', headline: 'A patient guide for the real questions.', body: 'Ask anything — and get answers grounded in what real people have done.', prompt: 'How much does childcare cost in Gothenburg for a 3-year-old?', cta: { label: 'Open the guide', href: '#' }, theme: 'ink' }} />
      <ImageText content={{ headline: 'Stay close to the water.', image: IMAGES.archipelago, theme: 'bone', bleed: true }} />
    </>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run storybook
```

Pages → Editorial homepage flow → Page. Scroll the canvas. Test viewports.

- [ ] **Step 3: Commit**

```bash
git add src/stories/pages/EditorialHomepage.stories.tsx
git commit -m "docs(storybook): add Editorial homepage flow example page"
```

---

## Task 57: Moving journey flow

**Files:**
- Create: `src/stories/pages/MovingJourney.stories.tsx`

```tsx
// src/stories/pages/MovingJourney.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HeroText } from '@system/examples/HeroText'
import { ChecklistTeaser } from '@system/examples/ChecklistTeaser'
import { EditorialText } from '@system/examples/EditorialText'
import { AICompanionTeaser } from '@system/examples/AICompanionTeaser'
import { Signpost } from '@system/examples/Signpost'

const meta: Meta = { title: 'Pages/Moving journey flow' }
export default meta
type S = StoryObj

export const Page: S = {
  render: () => (
    <>
      <HeroText content={{ eyebrow: 'The move', headline: 'What to expect when you move.', lead: 'A practical sequence — pre-arrival, first 30 days, settling in.', theme: 'bone', cta: { label: 'Open the full guide', href: '#' } }} />
      <ChecklistTeaser content={{ eyebrow: 'Step 1', heading: 'Pre-arrival', intro: 'Start these before you fly.', items: [
        { label: 'Apply for personnummer', description: 'Skatteverket booking, ~6 weeks lead time.' },
        { label: 'Sort temporary housing',  description: 'Short-let or company housing for the first 30 days.' },
        { label: 'Translate key documents', description: 'Birth, marriage, medical records.' }
      ], theme: 'clay' }} />
      <ChecklistTeaser content={{ eyebrow: 'Step 2', heading: 'First 30 days', intro: 'Once you are on the ground.', items: [
        { label: 'Register with the Migration Agency' },
        { label: 'Open a bank account' },
        { label: 'Choose a school or förskola' },
        { label: 'Get a transit card' }
      ], theme: 'sage' }} />
      <EditorialText content={{ heading: 'Bringing a partner.', paragraphs: [
        'Moving a partner well is its own project. Many international families assume the trailing partner will find work easily. The reality is more textured.',
        'There is help here — at the city level, at the regional level, and in informal communities of people who have done the same thing.'
      ], theme: 'bone' }} />
      <AICompanionTeaser content={{ eyebrow: 'AI guide', headline: 'Ask anything about your move.', body: 'A patient companion built for relocation questions.', prompt: 'My partner has a Swedish job offer. What does this look like tax-wise in our first year?', cta: { label: 'Open the guide', href: '#' }, theme: 'ink' }} />
      <Signpost content={{ heading: 'Resources', items: [
        { label: 'Moving guides', href: '#' },
        { label: 'Housing options', href: '#' },
        { label: 'Partner support', href: '#' }
      ], theme: 'bone' }} />
    </>
  )
}
```

- [ ] **Step 1: Add the file**
- [ ] **Step 2: Verify**
- [ ] **Step 3: Commit**

```bash
git add src/stories/pages/MovingJourney.stories.tsx
git commit -m "docs(storybook): add Moving journey flow example page"
```

---

## Task 58: Industry & careers flow

**Files:**
- Create: `src/stories/pages/IndustryCareers.stories.tsx`

```tsx
// src/stories/pages/IndustryCareers.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HeroText } from '@system/examples/HeroText'
import { ImageText } from '@system/examples/ImageText'
import { JobTeaser } from '@system/examples/JobTeaser'
import { StoryTeaser } from '@system/examples/StoryTeaser'
import { Signpost } from '@system/examples/Signpost'
import { Section, Container, Grid, Col, Stack, Text } from '@system/primitives'
import { IMAGES } from '../_fixtures/images'

const meta: Meta = { title: 'Pages/Industry & careers flow' }
export default meta
type S = StoryObj

const jobs = [
  { tag: 'Engineering', role: 'Senior Software Engineer', location: 'Gothenburg · Hybrid', summary: 'Help build the future of automotive software.', meta: { company: 'Volvo Cars', posted: 'Posted 3 days ago' }, cta: { label: 'See role', href: '#' } },
  { tag: 'Research',    role: 'Clinical Data Scientist', location: 'Mölndal · On-site',     summary: 'Translational research at scale.',                  meta: { company: 'AstraZeneca', posted: 'Posted 1 week ago' }, cta: { label: 'See role', href: '#' } },
  { tag: 'Hardware',    role: 'Battery Engineer',         location: 'Lindholmen',            summary: 'Battery pack development for next-gen platforms.',  meta: { company: 'Polestar',    posted: 'Posted today' },     cta: { label: 'See role', href: '#' } }
]

export const Page: S = {
  render: () => (
    <>
      <HeroText content={{ eyebrow: 'Industry & careers', headline: 'Purposeful work in a small, ambitious region.', lead: 'West Sweden punches above its weight in automotive, life sciences, energy, and digital.', cta: { label: 'See open roles', href: '#' }, theme: 'bone' }} />
      <ImageText content={{ headline: 'Companies that take craft seriously.', body: 'From Volvo to AstraZeneca, from SKF to small studios — the work here matters.', image: IMAGES.industry, theme: 'ink', bleed: true }} />
      <Section spacing="lg" theme="bone">
        <Container>
          <Grid>
            <Col span={{ lg: 1 }}>
              <Stack gap="snug">
                <Text role="tag" tone="muted">Sample roles</Text>
                <Text role="h2" as="h2">Open now.</Text>
              </Stack>
            </Col>
            {jobs.map((j, i) => (
              <Col key={i} span={{ lg: 1, md: 1, sm: 1 }} start={i === 0 ? { lg: 2 } : undefined}>
                <JobTeaser content={j} />
              </Col>
            ))}
          </Grid>
        </Container>
      </Section>
      <StoryTeaser content={{ tag: 'Stories', headline: 'A senior engineer\'s first year.', excerpt: 'Marek moved from Warsaw in 2023. He reflects on what he wishes he had known before his first standup.', image: IMAGES.portrait, byline: { name: 'Marek J.', role: 'Senior Engineer' }, cta: { label: 'Read', href: '#' }, theme: 'sky' }} />
      <Signpost content={{ heading: 'Industry hubs', items: [
        { label: 'Automotive', href: '#' },
        { label: 'Life sciences', href: '#' },
        { label: 'Digital & game dev', href: '#' },
        { label: 'Energy & cleantech', href: '#' }
      ], theme: 'bone' }} />
    </>
  )
}
```

- [ ] **Step 1: Add file**
- [ ] **Step 2: Verify**
- [ ] **Step 3: Commit**

```bash
git add src/stories/pages/IndustryCareers.stories.tsx
git commit -m "docs(storybook): add Industry & careers flow example page"
```

---

## Task 59: Regional & livability flow

**Files:**
- Create: `src/stories/pages/RegionalLivability.stories.tsx`

```tsx
// src/stories/pages/RegionalLivability.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HeroText } from '@system/examples/HeroText'
import { ImageText } from '@system/examples/ImageText'
import { EditorialText } from '@system/examples/EditorialText'
import { Signpost } from '@system/examples/Signpost'
import { StoryTeaser } from '@system/examples/StoryTeaser'
import { IMAGES } from '../_fixtures/images'

const meta: Meta = { title: 'Pages/Regional & livability flow' }
export default meta
type S = StoryObj

export const Page: S = {
  render: () => (
    <>
      <HeroText content={{ eyebrow: 'Region', headline: 'West Sweden, beyond the city.', lead: 'Coastline, forest, and small towns within an hour of the tram.', theme: 'bone', cta: { label: 'Open the regional guide', href: '#' } }} />
      <ImageText content={{ headline: 'Coast, archipelago, forest.', body: 'There are 8,000 islands. Most of the year you have them to yourself.', image: IMAGES.archipelago, theme: 'sage', bleed: true }} />
      <EditorialText content={{ heading: 'Livability is not lifestyle.', paragraphs: [
        'Livability here means the practical things working. Childcare. Healthcare. Transit. Water that is safe and beautiful.',
        'It also means a culture that lets you go home at five and call it a day. The country is not in a hurry. The work still gets done.'
      ], theme: 'bone' }} />
      <Signpost content={{ eyebrow: 'Explore', heading: 'Sub-regions', items: [
        { label: 'Gothenburg', href: '#', description: 'Centre, Hisingen, Majorna, Linné.' },
        { label: 'Bohuslän coast', href: '#', description: 'Marstrand, Smögen, Fjällbacka.' },
        { label: 'Inland forest', href: '#', description: 'Borås, Dalsland, the lakes.' }
      ], theme: 'clay' }} />
      <StoryTeaser content={{ tag: 'Stories', headline: 'A family who moved to a smaller town.', excerpt: 'Anna and Tom moved from London to Marstrand. A year in, they reflect on commute, schools, and the practical realities.', image: IMAGES.city, byline: { name: 'Anna & Tom', role: 'Design + Engineering' }, cta: { label: 'Read', href: '#' }, theme: 'sage' }} />
    </>
  )
}
```

- [ ] **Step 1: Add file**
- [ ] **Step 2: Verify**
- [ ] **Step 3: Commit**

```bash
git add src/stories/pages/RegionalLivability.stories.tsx
git commit -m "docs(storybook): add Regional & livability flow example page"
```

---

# Phase 15 — CMS Docs, README, Final Verification

## Task 60: "Wiring to a CMS" + "From foundations to production" MDX

**Files:**
- Create: `src/stories/foundations/WiringToACMS.mdx`, `src/stories/foundations/FoundationsToProduction.mdx`

- [ ] **Step 1: Create WiringToACMS.mdx**

```mdx
{/* src/stories/foundations/WiringToACMS.mdx */}
import { Meta } from '@storybook/blocks'

<Meta title="Foundations/Wiring to a CMS" />

# Wiring to a CMS

This system is foundations only — there is no CMS integration code in this repo. What follows documents the integration **shape** so future production blocks can be wired to Optimizely, Contentful, Sanity, Storyblok, or any headless CMS with the same patterns.

## Three principles built into every example block

1. **Content-shape first.** Every block accepts a typed content object — not props scattered across the call site.
2. **Optional everything is optional.** Image, CTA, metadata, tags can all be absent. Blocks render gracefully.
3. **Variable-length tolerant.** Short, medium, long, empty-optionals content variants are verified in every block's Storybook stories.

## Block content type pattern

```ts
export type StoryTeaserContent = {
  tag?: string
  headline: string                       // required
  excerpt?: string
  image?: { src: string; alt: string; focalPoint?: 'top' | 'center' | 'bottom' }
  byline?: { name: string; role?: string }
  cta?: { label: string; href: string }
  theme?: ThemeName                      // editor-authored
}
```

## Adapter pattern

```
CMS response  →  adapter function  →  block content type  →  block renders
```

```ts
// One adapter per block, lives next to the production block (future).
function toStoryTeaserContent(cmsBlock: CmsContentArea): StoryTeaserContent {
  return {
    tag:      cmsBlock.fields.tag,
    headline: cmsBlock.fields.headline,
    excerpt:  cmsBlock.fields.excerpt,
    image:    cmsBlock.fields.image && {
      src: cmsBlock.fields.image.url,
      alt: cmsBlock.fields.image.altText ?? '',
      focalPoint: cmsBlock.fields.image.focalPoint ?? 'center'
    },
    byline:   cmsBlock.fields.author && { name: cmsBlock.fields.author.name, role: cmsBlock.fields.author.role },
    cta:      cmsBlock.fields.cta?.url && { label: cmsBlock.fields.cta.label, href: cmsBlock.fields.cta.url },
    theme:    cmsBlock.fields.theme
  }
}
```

Adapters live in a future `src/cms/adapters/` folder when a CMS is chosen. The example blocks today have no `cms/` folder — that's deliberate. The integration boundary is just **one type per block**.

## Editor-authored theming

Editors should be able to set a block's `theme` from a CMS dropdown matching the keys in `src/tokens/themes/index.ts`. The block renders the chosen theme via the `theme` prop on `<Section>`.
```

- [ ] **Step 2: Create FoundationsToProduction.mdx**

```mdx
{/* src/stories/foundations/FoundationsToProduction.mdx */}
import { Meta } from '@storybook/blocks'

<Meta title="Foundations/From foundations to production" />

# From foundations to production

This is the path forward, in order. Each step is independent and can ship behind its own decision.

## 1. Choose a CMS

When Optimizely (or other) is picked, scaffold `src/cms/` with one adapter per block. Adapters convert CMS responses to the existing content types.

## 2. Promote one example block to production at a time

- Move from `src/system/examples/` to `src/blocks/`.
- Add the adapter.
- Add real-data Storybook stories alongside the existing variant stories.
- Add unit + a11y tests against real-data fixtures.
- Drop the `// EXAMPLE` header.

## 3. Page templates emerge from CMS page types

A page template is just an ordered list of blocks + a default theme. No new foundation work is needed. The example pages in `src/stories/pages/` show the shape.

## 4. Component-level tokens only when truly needed

Token architecture supports a third layer (`component/`). Keep it empty until a production block proves it requires its own tokens not already covered semantically.

## 5. AI companion as a real surface

The `AICompanionTeaser` becomes a real interactive surface (chat, recommendation). The `ink` and `campaign` themes already handle its visual treatment. The foundation supports it.

## 6. Personalization & recommendations

Blocks already accept content objects — a recommendation engine just supplies different content. No layout work needed.
```

- [ ] **Step 3: Verify**

```bash
npm run storybook
```

Expected: two new MDX entries in the Foundations sidebar.

- [ ] **Step 4: Commit**

```bash
git add src/stories/foundations/WiringToACMS.mdx src/stories/foundations/FoundationsToProduction.mdx
git commit -m "docs(storybook): add Wiring to a CMS + From foundations to production MDX"
```

---

## Task 61: README + final verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create `README.md`**

```markdown
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

| Script                   | What it does                                                           |
| ------------------------ | ---------------------------------------------------------------------- |
| `npm run dev`            | Vite dev server (port 5173). Builds tokens first.                      |
| `npm run build`          | Production build. Builds tokens, type-checks, then Vite build.         |
| `npm run storybook`      | Storybook dev (port 6006). Primary documentation surface.              |
| `npm run build-storybook` | Static Storybook build into `storybook-static/`.                      |
| `npm run tokens:build`   | Compile tokens to `src/tokens/generated/tokens.css` + types. AA gate.  |
| `npm test`               | Vitest unit + component tests.                                         |
| `npm run typecheck`      | `tsc -b --noEmit`.                                                     |
| `npm run lint`           | ESLint + Stylelint. Enforces no-hex / no-px in `src/system/`.          |

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

React 18 · Vite 5 · TypeScript 5 · Vitest · Storybook 8 · CSS Modules · Cabinet Grotesk + Satoshi.
```

- [ ] **Step 2: Run the full verification gauntlet**

```bash
npm run tokens:build
npm run typecheck
npm run lint
npm test
npm run build-storybook
```

Expected (in order):
- Tokens build → "Tokens built: ..."
- Typecheck → no errors
- Lint → 0 errors (warnings acceptable)
- Tests → all pass
- Storybook build → static site emitted under `storybook-static/`

Fix any issues that surface before continuing.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README"
```

- [ ] **Step 4: Final scan for leftover scaffolding artefacts**

```bash
find src -name "*.svg" -path "*assets*" 2>/dev/null
find src -name "vite.svg" 2>/dev/null
```

If any Vite template artefacts remain (e.g. `src/assets/react.svg`, `public/vite.svg`, default `App.css`), delete them. Commit cleanup if any:

```bash
git add -A
git commit -m "chore: remove leftover Vite template artefacts"
```

---

# Plan complete

All deliverables from Section 12 of the spec are covered:

1. **Token source** — Phases 2–4 (Tasks 5–13).
2. **Build pipeline** — Phase 5 (Tasks 14–17). AA contrast gate is the test in Task 14, integrated in Task 16.
3. **Layout primitives** — Phase 7 (Tasks 20–26).
4. **Theme system** — Phase 8 (Task 27).
5. **Example blocks** — Phase 10 (Tasks 30–38). Nine blocks as listed in spec Section 10.
6. **Storybook** — Phases 11–14. Foundations stories, example block stories with content variants, four assembled page stories, MDX docs.
7. **A11y** — focus states in Phase 6 (Task 19), addon-a11y in Phase 11 (Task 39), `useReveal`/`useScrollFade` reduced-motion checks in Phase 9, dedicated story in Phase 12 (Task 49).
8. **Fonts** — Phase 6 (Tasks 18, 19).
9. **Lint rules** — Phase 1 (Task 3).
10. **Future extension docs** — Phase 15 (Task 60).
