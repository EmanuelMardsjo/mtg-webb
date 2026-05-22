# Move to Gothenburg — Design System Foundations

**Status:** Approved design, ready for implementation planning
**Date:** 2026-05-22
**Scope:** Foundations only — tokens, layout, type, color, spacing, motion, theming, Storybook, four example pages. No production component library.

---

## 1. Purpose & Success Criteria

Build the token-driven design foundations for the future Move to Gothenburg digital platform. The platform helps highly skilled international professionals, partners, and families understand Gothenburg and West Sweden as a place to live, work, move, settle, and thrive.

Foundations only. Not finished production blocks. Not final page templates. The system must make it obvious how a future site can become a warm, modern, spacious, story-led, intelligent digital platform.

### Success looks like

- A token-driven foundation with primitives and semantic tokens clearly separated.
- Updating a primitive value flows through the entire system automatically.
- The system supports a distinct Move to Gothenburg expression, not a generic website look.
- The design feels spacious, modern, editorial — strong typography, clear layout rhythm.
- The system is easy to wire into Optimizely CMS or another headless CMS.
- Storybook documents foundations visually, not as noisy technical tables.
- Storybook is understandable for designers, developers, and stakeholders.
- Example pages demonstrate cohesive expression without becoming final templates.
- Mobile-first, accessible, supports future theming and content flexibility.

### Brand expression

Forward-looking, modern, airy, warm, sophisticated, confident, story-led, human, editorial, useful, non-generic.

### Anti-goals

Generic startup SaaS aesthetics. Heavy card systems. Unnecessary borders or boxes. Visual noise. Decorative shadows. Overbuilt components. Rigid page templates. Hard-coded values.

---

## 2. Technology Decisions

| Area              | Choice                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| Framework         | React 18 + Vite + TypeScript                                           |
| Tokens            | TS/JSON source → CSS custom properties via small build script          |
| Documentation     | Storybook 8.x (`@storybook/react-vite`)                                |
| Type stack        | Cabinet Grotesk (display) + Satoshi (body), self-hosted via Fontshare  |
| Color anchor      | Warm bone off-white base + sky / clay / sage pastel triad + deep navy  |
| Example pages     | Storybook full-page stories (no separate route layer)                  |
| Accessibility     | axe-core in dev + CI, build-time WCAG contrast verification            |
| No-go             | No Tailwind, no CSS-in-JS runtime, no animation libraries, no shadows  |

---

## 3. Architecture

A single Vite + React + TypeScript repo with Storybook as the documentation surface. Source is split into two distinct layers: `tokens/` (single source of truth, no React) and `system/` (thin React primitives + example blocks).

### Repository layout

```
mtg-webb/
├── src/
│   ├── tokens/
│   │   ├── primitives/           # raw values (palette, scale, font stacks, etc.)
│   │   │   ├── color.ts
│   │   │   ├── space.ts
│   │   │   ├── type.ts
│   │   │   ├── radius.ts
│   │   │   ├── border.ts
│   │   │   ├── motion.ts
│   │   │   ├── breakpoint.ts
│   │   │   ├── opacity.ts
│   │   │   └── z.ts
│   │   ├── semantic/             # role + intent tokens referencing primitives
│   │   │   ├── color.ts
│   │   │   ├── type.ts
│   │   │   ├── space.ts
│   │   │   └── motion.ts
│   │   ├── themes/               # bone, sky, clay, sage, ink, campaign
│   │   ├── build.ts              # emits tokens.css + tokens.types.ts
│   │   ├── generated/            # build output (gitignored or committed)
│   │   └── index.ts              # typed re-export for runtime access
│   ├── system/
│   │   ├── primitives/           # Container, Grid, Col, Section, Stack, Inline,
│   │   │                         # Text, Surface, Divider, Image, Icon, TextLink
│   │   ├── hooks/                # useReveal, useHover, useScrollFade, useThemeOverride
│   │   ├── examples/             # example blocks ("// EXAMPLE" tagged)
│   │   └── styles/               # global reset + tokens.css import
│   └── stories/
│       ├── foundations/          # color, type, spacing, grid, motion, theming, a11y
│       └── pages/                # 4 example page assemblies
├── public/fonts/                 # Cabinet Grotesk + Satoshi (WOFF2)
├── .storybook/                   # preview, theme switcher, viewport addon
├── docs/
│   └── superpowers/specs/        # this spec lives here
└── package.json
```

### Three system-wide rules

1. **No raw color, spacing, or font values in any component or example.** Only CSS vars or token references. Enforced by an ESLint rule banning hex literals and px values inside `src/system/`.
2. **Layout primitives are the only place that sets spacing, columns, or themes.** Example blocks compose primitives; they never re-implement layout.
3. **Theme variants remap semantic tokens, never re-style components.** A clay-themed section sets `--color-surface-page`, `--color-text-default`, `--color-border-subtle` on its root — every descendant inherits.

### Build pipeline

`tsx src/tokens/build.ts` reads the TS token graph and emits:

- `src/tokens/generated/tokens.css` — all primitives and semantic tokens as CSS custom properties; theme blocks under `[data-theme="x"]`.
- `src/tokens/generated/tokens.types.ts` — TypeScript types and a typed re-export for runtime access.

Hooked into `predev` and `prebuild`. Editing a primitive → re-running the build → CSS updates across the system.

### Example blocks vs. production blocks

Every example component carries:

- A visible `[example]` tag in Storybook docs.
- A file header comment: `// EXAMPLE — demonstrates foundations only. Replace before production with a CMS-wired block.`
- Location under `src/system/examples/`.
- A Storybook sidebar category "Examples" with a banner: "Demonstrates the foundations. Not production components. Replace before launch."

---

## 4. Token Architecture

Three layers, strictly one-directional: **primitives → semantic → component**. Components never read primitives directly.

### Layer 1 — Primitives

#### Color primitives

Five families. Final hexes locked during the implementation contrast pass (see Section 5).

```ts
// src/tokens/primitives/color.ts
export const palette = {
  bone: { 50: '#FBF8F3', 100: '#F5EFE5', 200: '#EBE3D2' },
  navy: { 700: '#1B2740', 800: '#121A2E', 900: '#0A1020' },
  sky:  { 100: '#E6EDF5', 200: '#C9D6E6', 400: '#7C9BBE', 600: '#3D5878' },
  clay: { 100: '#F4E4D3', 200: '#E8C8AC', 400: '#C68C66', 600: '#86553A' },
  sage: { 100: '#E5EADC', 200: '#C7D2B7', 400: '#869670', 600: '#4F5C40' }
} as const
```

The `600` shades on sky / clay / sage are not consumed by any theme in the default emission. They are reserved as primitives so future deeper-tinted themes (`sky-deep`, `clay-deep`, etc.) can be added as one-file additions without expanding the primitive layer.

#### Spacing primitives

Base unit 4px. Twelve steps, no off-scale values:

```
0→0  1→4  2→8  3→12  4→16  5→24  6→32  7→48  8→64  9→96  10→128  11→192  12→256
```

#### Type primitives

```ts
export const fontFamily = {
  display: `'Cabinet Grotesk', 'Inter', system-ui, sans-serif`,
  body:    `'Satoshi', 'Inter', system-ui, sans-serif`
} as const

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
```

Two weights per family: Cabinet Grotesk 500 (workhorse) + 300 (display-only); Satoshi 400 (regular) + 500 (emphasis/button).

#### Other primitive files

- `breakpoint.ts` — sm (0), md (768), lg (1200)
- `radius.ts` — none, xs (2), sm (4), md (8), lg (16), pill (9999), full (50%)
- `border.ts` — hairline (1), thin (1), strong (2)
- `motion.ts` — durations (instant 0, micro 120, fast 200, base 320, slow 500, ambient 900) + easings (standard, enter, exit, emphasis, linear)
- `opacity.ts` — 0, 25, 50, 75, 100, plus token aliases for overlays
- `z.ts` — base, raised, sticky, overlay, modal, toast

### Layer 2 — Semantic

Roles named by intent, not value. Components only consume these.

#### Semantic color (default theme = `bone`)

```ts
export const colorRoles = {
  'surface-page':    palette.bone[50],
  'surface-raised':  palette.bone[100],
  'text-strong':     palette.navy[900],
  'text-default':    palette.navy[800],
  'text-muted':      palette.navy[700],
  'text-on-ink':     palette.bone[50],
  'border-subtle':   'color-mix(in oklch, currentColor 10%, transparent)',
  'border-strong':   'color-mix(in oklch, currentColor 20%, transparent)',
  'focus-ring':      palette.sky[400],
  'accent-line':     palette.sky[400]
}
```

#### Semantic typography roles

| Role        | Family  | Size  | Leading | Tracking  | Weight | Notes              |
| ----------- | ------- | ----- | ------- | --------- | ------ | ------------------ |
| `display`   | display | 5xl   | 0.95    | -0.02em   | 500    | One per page max.  |
| `hero`      | display | 4xl   | 1.00    | -0.015em  | 500    |                    |
| `h1`        | display | 3xl   | 1.05    | -0.01em   | 500    |                    |
| `h2`        | display | 2xl   | 1.10    | -0.005em  | 500    |                    |
| `h3`        | display | xl    | 1.15    | 0         | 500    |                    |
| `lead`      | body    | lg    | 1.45    | 0         | 400    | Intro paragraphs.  |
| `body`      | body    | md    | 1.55    | 0         | 400    |                    |
| `body-sm`   | body    | sm    | 1.55    | 0         | 400    |                    |
| `caption`   | body    | xs    | 1.40    | 0.01em    | 400    |                    |
| `meta`      | body    | xs    | 1.40    | 0         | 400    |                    |
| `tag`       | body    | 2xs   | 1.20    | 0.08em    | 500    | Uppercase.         |
| `quote`     | display | xl    | 1.30    | -0.005em  | 400    | Italic.            |
| `button`    | body    | sm    | 1.00    | 0.02em    | 500    |                    |

#### Semantic spacing roles

| Category   | Roles |
| ---------- | ----- |
| Section    | `section-y-sm` (48), `section-y-md` (96), `section-y-lg` (128), `section-y-xl` (192) |
| Stack      | `stack-tight` (8), `stack-snug` (12), `stack-default` (16), `stack-loose` (24), `stack-xl` (48) |
| Inline     | `inline-tight` (4), `inline-default` (8), `inline-loose` (16) |
| Grid       | `grid-gutter-sm` (16), `grid-gutter-md` (24), `grid-gutter-lg` (32) |
| Container  | `container-pad-sm` (16), `container-pad-md` (32), `container-pad-lg` (64) |
| Content    | `content-gap` (32) |

#### Semantic motion roles

| Role          | Duration | Easing   |
| ------------- | -------- | -------- |
| hover         | micro    | standard |
| press         | instant  | standard |
| state-change  | fast     | standard |
| entrance      | base     | enter    |
| reveal        | slow     | emphasis |
| scroll-fade   | slow     | enter    |
| surface-swap  | base     | standard |

### Layer 3 — CSS output (build artifact)

```css
:root,
[data-theme="bone"] {
  /* primitives */
  --bone-50: #FBF8F3;
  --navy-900: #0A1020;
  --sky-100: #E6EDF5;
  /* ... */

  --font-display: 'Cabinet Grotesk', 'Inter', system-ui, sans-serif;
  --font-body: 'Satoshi', 'Inter', system-ui, sans-serif;
  --fs-3xl: clamp(2.25rem, 1.5rem + 4vw, 4rem);
  /* ... */

  /* semantic — bone default */
  --color-surface-page: var(--bone-50);
  --color-text-default: var(--navy-800);
  --color-text-strong:  var(--navy-900);
  --space-section-y-lg: 128px;
  --grid-gutter-lg: 32px;
}

[data-theme="sky"]  { --color-surface-page: var(--sky-100);  --color-text-default: var(--navy-900); /* ... */ }
[data-theme="clay"] { --color-surface-page: var(--clay-100); --color-text-default: var(--navy-900); /* ... */ }
[data-theme="sage"] { --color-surface-page: var(--sage-100); --color-text-default: var(--navy-900); /* ... */ }
[data-theme="ink"]  { --color-surface-page: var(--navy-900); --color-text-default: var(--bone-50);  /* ... */ }
[data-theme="campaign"] {
  --color-surface-page: var(--campaign-surface, var(--bone-50));
  --color-text-default: var(--campaign-text,    var(--navy-800));
  --color-accent-line:  var(--campaign-accent,  var(--sky-400));
}
```

---

## 5. Color & Theming

The color foundation is built around the unified theming model: every color in the palette is a theme. There is no separate "light vs dark mode" axis. `bone` is light, `ink` is dark — they are peers.

### Available themes

| Theme       | Surface     | Text default  | Use case                                            |
| ----------- | ----------- | ------------- | --------------------------------------------------- |
| `bone`      | bone-50     | navy-800      | Default page theme.                                 |
| `bone-raised` | bone-100  | navy-800      | Slightly raised neutral (optional).                 |
| `sky`       | sky-100     | navy-900      | Archipelago / water moments.                        |
| `clay`      | clay-100    | navy-900      | Warm editorial, human stories.                      |
| `sage`      | sage-100    | navy-900      | Livability, regional, nature.                       |
| `ink`       | navy-900    | bone-50       | Quiet/serious moments, AI companion, hero contrast. |
| `campaign`  | runtime var | runtime var   | CMS-driven moments. Defaults fall back to `bone`.   |

### Contrast verification (build-time)

A test in `src/tokens/build.ts` runs every theme's surface × text combination through a WCAG contrast check. The build fails if any combination drops below AA (4.5:1). If a pastel fails, its lightness is tuned until it passes — hue and saturation are preserved so the triad relationship survives.

### Three places a theme is applied

**1. Section-level**

```tsx
<Section theme="clay" spacing="lg">…</Section>
```

Editorial composition. Set on the section root via `data-theme="clay"`.

**2. Subtree**

```tsx
<main data-theme="sage">
  <Section>…</Section>           {/* inherits sage */}
  <Section theme="bone">…</Section>  {/* overrides to bone */}
  <Section>…</Section>           {/* back to inherited sage */}
</main>
```

Themes nest because CSS vars cascade.

**3. Interactive (runtime, page-wide)**

A `useThemeOverride(themeOrNull)` hook sets `data-theme` on a configurable scope (default: `<body>`) while active, restores when cleared. Used to make page-wide reskinning tied to UI state, such as opening a themed accordion.

```tsx
function ThemedAccordion({ theme, summary, children }) {
  const [open, setOpen] = useState(false)
  useThemeOverride(open ? theme : null)
  return (
    <details onToggle={e => setOpen(e.currentTarget.open)}>
      <summary><Text role="h3">{summary}</Text></summary>
      <div>{children}</div>
    </details>
  )
}
```

When two themed accordions are open at once, the **most recently opened wins**. A `ThemeOverrideProvider` at the scope root maintains a stack; `useThemeOverride` pushes/pops. When the stack empties, the underlying theme reasserts.

### Theme transition motion

```css
[data-theme] {
  transition:
    background-color var(--motion-surface-swap-duration) var(--motion-surface-swap-easing),
    color            var(--motion-surface-swap-duration) var(--motion-surface-swap-easing),
    border-color     var(--motion-surface-swap-duration) var(--motion-surface-swap-easing);
}
```

Only color-related properties transition; layout is never animated. The global `prefers-reduced-motion` rule sets `transition-duration: 0ms` for users who opt out.

### Status colors

Utility only, never decorative. Paired with icon + text label, never relied on as the sole signal.

```
status-success: #3F6B4A
status-warning: #7A5A1F
status-danger:  #7A3A2A
status-info:    sky-400
```

### Tag / chip treatment

One neutral treatment, inverts via the theme mechanism. No rainbow palette. Category coding (if needed editorially) comes from placing the tag on a tinted theme section, not from per-category color tokens.

### Overlays

```
overlay-ink:   rgba(10, 16, 32, 0.6)    // image text overlay
overlay-scrim: rgba(10, 16, 32, 0.85)   // full-bleed dark scrim
overlay-bone:  rgba(251, 248, 243, 0.85) // light glass / sticky nav
```

### Discipline rules

1. No raw hex in components. ESLint blocks `#[0-9a-f]{3,8}` inside `src/system/`.
2. No new color tokens without a semantic role.
3. A component never queries the theme. Visuals come from CSS vars.
4. A theme only remaps semantic tokens.
5. One accent theme per section, max.
6. Tinted themes don't stack adjacent (rhythm is `default → tinted → default → ink → default`, not `sky → clay → sage` in a row).
7. Interactive overrides clear deterministically; every push pairs with a pop.

---

## 6. Typography

Two families, two weights each, twelve fluid sizes, thirteen semantic roles.

- **Cabinet Grotesk** for display, hero, h1–h3, quote (italic).
- **Satoshi** for lead, body, body-sm, caption, meta, tag, button.

Self-hosted under `public/fonts/`. WOFF2 with subset for latin + latin-ext (Swedish chars: åäöÅÄÖ). `font-display: swap`. Fallback chain: `'Inter', system-ui, sans-serif`.

### `<Text>` primitive

```tsx
<Text role="display" as="h1">Move to Gothenburg</Text>
<Text role="lead">A practical guide for international professionals…</Text>
<Text role="tag" as="span">Career</Text>
```

`role` is styling intent; `as` is the rendered HTML element. They're independent. Default `as` per role: display/hero/h1/h2/h3 → `<h1..h3>`; body → `<p>`; tag/caption/meta → `<span>`.

### Editorial details

- Tracking tightens at large sizes (`-0.02em` on display), opens up at small uppercase (`0.08em` on tag).
- `<Container size="prose">` caps reading widths at 65ch. Long-form copy sits inside it.
- Global `hanging-punctuation: first last;` in supporting browsers.
- `font-feature-settings: 'ss01', 'tnum';` on meta / tabular data roles.
- No bold body weight by default. Emphasis comes from role change, not weight.

### Discipline rule

**Maximum three distinct text roles inside a single viewport on lg.** Storybook calls this out; example pages enforce it.

---

## 7. Layout & 5-Column Grid

### Breakpoints

| Name | Min width | Grid columns |
| ---- | --------- | ------------ |
| `sm` | 0         | 1            |
| `md` | 768       | 2            |
| `lg` | 1200      | 5            |

### Primitives

- **`<Container>`** — sizes: `prose` (65ch), `default` (1440), `wide` (1680), `bleed` (edge-to-edge). Owns horizontal padding via `--container-pad-*`. Never owns vertical space.
- **`<Section>`** — owns vertical padding via `--space-section-y-*` and the `theme` prop (sets `data-theme`). Never owns horizontal padding.
- **`<Grid>`** — single CSS Grid primitive. 1 col on sm, 2 on md, 5 on lg. Gutters tokenized.
- **`<Col>`** — declares span and optional start per breakpoint: `<Col span={{ sm: 1, md: 2, lg: 3 }} start={{ lg: 2 }}>`.
- **`<Stack>`** — vertical flex wrapper with semantic gap.
- **`<Inline>`** — horizontal flex wrapper with semantic gap, optional wrap.

### Canonical lg compositions

| Composition     | lg spans          | When to use                                         |
| --------------- | ----------------- | --------------------------------------------------- |
| **Full**        | 5                 | Hero text, full-bleed media, editorial intros.      |
| **Asym left**   | 2 + 3             | Label/meta + content (editorial open).              |
| **Asym right**  | 3 + 2             | Content + supporting image or quote.                |
| **Lead column** | 1 + 3 (col 2)     | Single offset content column with leading air.      |
| **Wide single** | 3 (col 2 start)   | Centered editorial body, cols 1 & 5 left as air.    |
| **Sidekick**    | 1 + 4             | Small meta + dominant content/image.                |
| **Even pair**   | 2 + 2 + 1-air     | Side-by-side, with intentional col-5 negative space.|
| **Five-up**     | 1+1+1+1+1         | Used **rarely** — anti-app rule. Storybook flags.   |

### Mobile collapse rules

- Container padding stays generous on sm/md (16/32). Section vertical space scales modestly (sm: 48–64, md: 64–96, lg: 128–192).
- Asymmetric compositions stack in declared order. Use `order` to override only when content flow demands it.
- Type sizing already fluid via `clamp()` — no extra media queries.
- Air is preserved over density.

### Full-bleed

`<Section bleed>` extends to viewport edges (ignoring container padding). Inner content still sits inside a Container so text never touches edges.

### Discipline rules

1. Components never set padding or margin. Spacing comes from `<Stack>`, `<Inline>`, `<Section>`, `<Container>`.
2. `Five-up` composition is documented as a restraint pattern, not a default.
3. Grid never has visible overlay outside the dedicated Storybook overlay toggle.

---

## 8. Spacing, Sizing, Radius, Borders, Icons

### Spacing scale

Twelve steps from 0 to 256 (see Section 4). Consumed only via semantic spacing roles.

### Sizing tokens

For fixed-size things (icons, avatars, frames):

```
3xs 12 · 2xs 16 · xs 20 · sm 24 · md 32 · lg 48 · xl 64 · 2xl 96 · 3xl 128
```

### Icon sizes

Three semantic icon sizes only:

```
--icon-sm: 16  (inline body)
--icon-md: 20  (buttons, nav)
--icon-lg: 28  (feature, signpost)
```

`<Icon>` renders SVG with `currentColor`, inherits text color across themes.

### Radius

```
--radius-none:  0       (default)
--radius-xs:    2px     (form fields)
--radius-sm:    4px     (tags, buttons)
--radius-md:    8px     (image frames, optional cards)
--radius-lg:    16px    (hero media)
--radius-pill:  9999px  (optional chips)
--radius-full:  50%     (avatars only)
```

Default radius is none. Components opt in.

### Border widths

```
--border-hairline: 1px
--border-thin:     1px
--border-strong:   2px  (focus rings, emphasis)
```

Hairline borders only where structurally needed.

### Divider

```tsx
<Divider />            // full width
<Divider span={1} />   // 1-column wide, asymmetric editorial mark
<Divider weight="strong"> // 2px, column-anchor moments
```

### Focus state

Single global rule, sky-400 ring on every theme:

```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 3px;
  border-radius: var(--radius-xs);
}
```

### Discipline rules

1. No `box-shadow` tokens. No shadows anywhere. Depth comes from theme and spacing.
2. No new radius values. Five steps is enough.
3. Components never set spacing — `<Stack>` / `<Inline>` / `<Section>` / `<Container>` do.

---

## 9. Motion & Accessibility

### Motion tokens

```ts
duration: { instant 0, micro 120, fast 200, base 320, slow 500, ambient 900 }
easing:   { standard, enter, exit, emphasis, linear }
```

Emitted as `--motion-{role}-duration` and `--motion-{role}-easing` per semantic role.

### Three reusable behaviors (no more)

1. **`useReveal()`** — on intersection, fades + lifts 8px once. Hero text and section openers.
2. **`useHover()`** — image scale-up `1.0 → 1.02` on cursor devices only (`@media (hover: hover)`).
3. **`useScrollFade()`** — opacity tied to scroll progress on hero images. No parallax.

All three check `prefers-reduced-motion` internally and skip observer attachment when reduced.

### Global reduced-motion rule

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0ms !important;
    scroll-behavior: auto !important;
  }
}
```

### Accessibility foundations

- **Contrast** verified at build time for every theme's surface × text. Build fails on AA failures.
- **Focus** ring is sky-400 on every theme.
- **Reduced motion** respected globally and inside hooks.
- **Line lengths** capped at 65ch via `<Container size="prose">`.
- **Responsive text** via fluid `clamp()` — readable 320 → 2560.
- **Semantic HTML** — `<button>`, `<a>`, `<nav>`, `<section>`, `<article>` in example blocks. `<Text as>` makes heading hierarchy explicit.
- **Skip link** — every example page includes a visually-hidden "Skip to main content" first focusable.
- **Image alt** — required on `<Image>`, exposed as a Storybook control on every block.
- **Color is never the only signal** — status pairs color with icon + text.

### CI

`axe-core` runs against every Storybook story; build fails on violations.

### Discipline rules

1. No motion without a token.
2. No animation longer than `--motion-ambient` (900ms).
3. No motion that disorients — no spin, no large translate, no zoom past 1.04. Scroll-linked motion only on hero images, not text.

---

## 10. Storybook & Example Pages

### Setup

- Storybook 8.x with `@storybook/react-vite`.
- Addons: essentials (with the backgrounds addon disabled — themes replace it), a11y (axe), and a custom theme decorator wired to the `data-theme` mechanism. Viewport addon configured with named `sm` / `md` / `lg` presets matching token breakpoints.
- MDX docs for foundations, visual-first.
- Custom Storybook chrome theme (bone background, navy text, no decorative borders).
- Stories render full-viewport; no centered/padded decorator by default.

### Sidebar structure

```
Foundations
  Introduction
  Tokens & Architecture
  Color
  Typography
  Spacing & Sizing
  Layout & 5-Column Grid
  Theming
  Motion
  Accessibility
Examples  (not production components)
  Hero text
  Editorial text section
  Image + text composition
  Signpost
  Job teaser
  Checklist teaser
  AI companion teaser
  Story teaser
Pages  (assembled examples)
  Editorial homepage flow
  Moving journey flow
  Industry & careers flow
  Regional & livability flow
```

`Examples` and `Pages` carry a banner: "Demonstrates the foundations. Not production components. Replace before launch."

### Foundation stories (visual-first)

- **Color** — swatch stacks, theme switcher on real content, surface rhythm preview, contrast checker.
- **Typography** — every role at real size with realistic copy; type rhythm composition; "three roles per viewport" reminder.
- **Spacing** — scale rectangles, stack examples, section rhythm preview at sm/md/lg/xl.
- **Layout** — toggleable grid overlay, live span playgrounds for each canonical composition at sm/md/lg.
- **Theming** — every theme on every block; interactive override demo (button shifts page theme).
- **Motion** — duration bars, easing curve SVGs, reveal/hover/scroll-fade demos, reduced-motion toolbar toggle.
- **Accessibility** — skip-link demo, focus states on every primitive on every theme.

### Toolbar controls

- **Theme** — Bone / Sky / Clay / Sage / Ink / Campaign. Sets `data-theme` on the story root.
- **Interactive override demo** — toggles a fake theme override on body to demonstrate the accordion behavior.
- **Viewport** — sm / md / lg presets.
- **Reduced motion** — on/off toggle.

### Example blocks

Every block accepts a single typed content object. File header: `// EXAMPLE — demonstrates foundations only.`

| Block                  | Demonstrates                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `HeroText`             | Display + lead, asym 2+3, breathing room.                          |
| `EditorialText`        | Long-form prose in `Container size="prose"`, optional quote.       |
| `ImageText`            | 3+2 image-led composition, reversed and bleed variants.            |
| `Signpost`             | Lead column + 3 short links, lightweight navigation moment.        |
| `JobTeaser`            | Tag, role, location, summary, meta line.                           |
| `ChecklistTeaser`      | Numbered moving checklist, body type at scale.                     |
| `AICompanionTeaser`    | On `ink` theme — quiet AI moving guide moment.                     |
| `StoryTeaser`          | Personal story: image, tag, quote, byline, link.                   |
| `ThemedAccordion`      | Interactive theming demo (page-wide reskin on open).               |

### Content variant stories per block

`Default`, `Short`, `Long`, `NoImage`, `NoCTA`, `EmptyOptionals`, `ThemeVariants`.

### Four example pages (Storybook story per page)

**Editorial homepage flow** — `bone → ink → clay → bone → sage → bone → ink`
1. HeroText (bone) — "Move to Gothenburg. A different kind of move."
2. ImageText (ink) — water imagery + short lead.
3. Signpost (clay) — "Career / Family / Community / Housing."
4. EditorialText (bone) — short essay framing the city's character.
5. StoryTeaser (sage) — international researcher + family.
6. AICompanionTeaser (ink) — invitation to the AI guide.
7. ImageText (bone) — closing scene, full-bleed.

**Moving journey flow** — `bone → clay → sage → bone → ink → bone`
1. HeroText (bone) — "What to expect when you move."
2. ChecklistTeaser (clay) — pre-arrival.
3. ChecklistTeaser (sage) — first 30 days.
4. EditorialText (bone) — family & partner support context.
5. AICompanionTeaser (ink) — "Ask the guide anything."
6. Signpost (bone) — resources.

**Industry & careers flow** — `bone → ink → bone → sky → bone`
1. HeroText (bone) — "Purposeful work in a small, ambitious region."
2. ImageText (ink) — industry framing.
3. JobTeaser × 3 (bone, 1+3 layout) — sample roles.
4. StoryTeaser (sky) — working professional profile.
5. Signpost (bone) — industry hubs.

**Regional & livability flow** — `bone → sage → bone → clay → sage`
1. HeroText (bone) — "West Sweden, beyond the city."
2. ImageText (sage) — coast, archipelago, forest.
3. EditorialText (bone) — livability essay.
4. Signpost (clay) — sub-regions.
5. StoryTeaser (sage) — family who moved to a smaller town.

### What Storybook does NOT show

- No "Components" tree.
- No prop matrix tables as primary documentation.
- No default grid overlays.
- No backgrounds addon (themes replace it).
- No mock CMS UI in stories.

---

## 11. CMS Readiness

Foundations stage doesn't wire to a CMS. What matters is the integration shape being obvious.

### Three principles built into every example block

1. **Content-shape first** — each block accepts a typed content object, not scattered props.
2. **Optional everything is optional** — image, CTA, metadata, tags can all be absent. Blocks render gracefully.
3. **Variable-length tolerant** — short, medium, long, empty-optionals content variants verified in Storybook.

### Block content type pattern

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

### CMS adapter pattern (documented, not implemented)

Storybook MDX page "Wiring to a CMS" documents the pattern without committing to a CMS:

```
CMS response  →  adapter function  →  block content type  →  block renders
```

A future `src/cms/adapters/` folder holds one adapter per block. Today there is no `cms/` folder — that's deliberate.

### Future extension path (documented as MDX page)

1. Choose CMS → scaffold `src/cms/` with per-block adapters.
2. Promote one example block to production at a time: move to `src/blocks/`, add adapter, add real-data stories + a11y tests, drop `// EXAMPLE` header.
3. Page templates emerge as ordered block lists + default theme.
4. Component tokens (third layer) added only when truly needed.
5. AI companion graduates to a real interactive surface, using `ink` and `campaign` themes.
6. Personalization / recommendations supply different content; layout stays unchanged.

### What stays out of foundations stage

- No CMS SDK installs.
- No routing layer beyond Storybook stories.
- No analytics, consent banner, or auth.
- No final nav/header/footer (informed by future IA decisions).
- No animation libraries (Framer Motion, GSAP).
- No icon library — `<Icon>` primitive with ~3 placeholder SVGs for examples.

---

## 12. Deliverables (foundations stage)

1. **Token source** — TS primitives + semantic + themes under `src/tokens/`.
2. **Build pipeline** — `src/tokens/build.ts` emits `tokens.css` + `tokens.types.ts`. Hooked into predev/prebuild. Build fails on AA contrast violation.
3. **Layout primitives** — Container, Section, Grid, Col, Stack, Inline, Surface, Divider, Image, Icon, TextLink, Text.
4. **Theme system** — `data-theme` cascade + `useThemeOverride` hook + `ThemeOverrideProvider`.
5. **Example blocks** — nine listed in Section 10, all under `src/system/examples/` with content-type files.
6. **Storybook** — foundations stories, example block stories with content variants, four assembled page stories, MDX docs.
7. **A11y** — axe in CI, skip links in pages, focus states, reduced-motion respect.
8. **Fonts** — Cabinet Grotesk + Satoshi self-hosted with WOFF2 subset.
9. **Lint rules** — ESLint config banning hex + px inside `src/system/`.
10. **Future extension docs** — MDX page in Storybook covering CMS adapter pattern and the path from foundations to production.

---

## 13. Out of Scope (explicitly)

- Final production blocks (CMS-wired, tested for production).
- A component library beyond the listed primitives.
- Real CMS integration code or SDKs.
- Navigation, header, footer (production design work).
- Analytics, consent, auth, search.
- Animation library or complex motion choreography.
- Final icon system.
- Final image content / production photography.
- E2E tests (unit + a11y only at this stage).

---

## 14. Open Questions Resolved During Brainstorm

| Question                          | Decision                                                                |
| --------------------------------- | ----------------------------------------------------------------------- |
| Framework                         | React + Vite                                                            |
| Token tooling                     | TS/JSON source → CSS vars via small build script                        |
| Type pairing                      | Cabinet Grotesk (display) + Satoshi (body), Fontshare, self-hosted      |
| Palette anchor                    | Warm bone base + sky/clay/sage triad + deep navy                        |
| Pastel triad                      | Sky / Clay / Sage                                                       |
| Example page format               | Storybook full-page stories                                             |
| Theming model                     | Unified `data-theme` cascade — themes are peers, no light/dark axis      |
| Interactive theme override        | `useThemeOverride` hook with stack-based ordering, last-opened wins      |
| Dark mode                         | Not a separate mode — `ink` is one of the themes                        |
| Storybook structure               | Foundations + Examples + Pages — no Components tree                     |
