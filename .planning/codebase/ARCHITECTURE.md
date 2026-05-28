<!-- refreshed: 2026-05-28 -->
# Architecture

**Analysis Date:** 2026-05-28

## System Overview

```text
+--------------------------------------------------------------------------------+
|                       Storybook documentation surface                            |
| `.storybook/main.ts` `.storybook/preview.tsx` `src/stories/**`                  |
+---------------------+-------------------------+----------------------------------+
| Foundation docs     | Example block stories   | Example page assemblies          |
| `src/stories/       | `src/system/examples/`  | `src/stories/pages/`             |
| foundations/`       |                         |                                  |
+----------+----------+------------+------------+----------------+-----------------+
           |                       |                             |
           v                       v                             v
+--------------------------------------------------------------------------------+
|                         React design-system layer                                |
| `src/system/primitives/` `src/system/hooks/` `src/system/styles/`                |
+--------------------------------------+-----------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
|                            Token source of truth                                  |
| `src/tokens/primitives/` -> `src/tokens/semantic/` -> `src/tokens/themes/`       |
+--------------------------------------+-----------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
|                            Generated CSS variables                                |
| `src/tokens/build.ts` -> `src/tokens/generated/tokens.css`                       |
+--------------------------------------------------------------------------------+
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Vite app shell | Mount the minimal React app and import global design-system styles. | `src/main.tsx`, `src/App.tsx`, `index.html` |
| Storybook config | Define the documentation/runtime surface, story globs, addons, viewports, global toolbar controls, and decorators. | `.storybook/main.ts`, `.storybook/preview.tsx` |
| Storybook providers | Wrap every story with theme override context and apply global `data-theme` / reduced-motion state. | `.storybook/decorators/withProviders.tsx`, `.storybook/decorators/withTheme.tsx`, `.storybook/decorators/withReducedMotion.tsx` |
| Token primitives | Own raw color, type, spacing, sizing, breakpoint, radius, border, motion, opacity, and z-index values. | `src/tokens/primitives/color.ts`, `src/tokens/primitives/type.ts`, `src/tokens/primitives/space.ts`, `src/tokens/primitives/motion.ts` |
| Semantic tokens | Map primitive values to intent-based roles consumed by CSS and components. | `src/tokens/semantic/color.ts`, `src/tokens/semantic/type.ts`, `src/tokens/semantic/space.ts`, `src/tokens/semantic/motion.ts` |
| Themes | Provide complete semantic color remaps keyed by `ThemeName`. | `src/tokens/themes/index.ts` |
| Token build pipeline | Verify contrast, emit CSS custom properties, and emit token type helpers. | `src/tokens/build.ts`, `src/tokens/build/emit.ts`, `src/tokens/build/emit-types.ts`, `src/tokens/build/verify.ts` |
| Global styles | Import generated tokens, fonts, reset rules, focus states, theme transitions, and reduced-motion overrides. | `src/system/styles/global.css`, `src/system/styles/fonts.css`, `src/system/styles/reset.css` |
| Layout primitives | Provide the system-only layout, type, media, icon, link, and themed-surface building blocks. | `src/system/primitives/index.ts`, `src/system/primitives/Section.tsx`, `src/system/primitives/Grid.tsx`, `src/system/primitives/Text.tsx` |
| Hooks | Provide theme override state, scroll/reveal motion helpers, and hover state. | `src/system/hooks/ThemeOverride.tsx`, `src/system/hooks/useReveal.ts`, `src/system/hooks/useScrollFade.ts`, `src/system/hooks/useHover.ts` |
| Example blocks | Demonstrate how CMS-shaped block content composes primitives; these are explicitly foundation examples. | `src/system/examples/HeroText/HeroText.tsx`, `src/system/examples/ImageText/ImageText.tsx`, `src/system/examples/ThemedAccordion/ThemedAccordion.tsx` |
| Foundation stories | Document tokens, brand assets, image bank, typography, layout, motion, theming, and accessibility in Storybook. | `src/stories/foundations/Color.stories.tsx`, `src/stories/foundations/Theming.stories.tsx`, `src/stories/foundations/TokensArchitecture.mdx` |
| Page stories | Assemble example blocks into full-page editorial flows. | `src/stories/pages/EditorialHomepage.stories.tsx`, `src/stories/pages/IndustryCareers.stories.tsx`, `src/stories/pages/MovingJourney.stories.tsx`, `src/stories/pages/RegionalLivability.stories.tsx` |
| Test setup | Configure Vitest DOM matchers and jsdom tests. | `vite.config.ts`, `src/test/setup.ts`, `src/test/smoke.test.ts` |

## Pattern Overview

**Overall:** Token-first React design-system foundation with Storybook as the primary product surface.

**Key Characteristics:**
- Keep token data one-directional: `src/tokens/primitives/` feeds `src/tokens/semantic/`, `src/tokens/themes/`, and `src/tokens/build/emit.ts`.
- Keep React components thin: primitives in `src/system/primitives/` mostly translate typed props into CSS module classes and CSS custom properties.
- Use Storybook as the actual exploration surface: `.storybook/main.ts` registers foundation docs, example block stories, and full page stories.
- Apply theme through the `data-theme` cascade from `src/system/primitives/Section.tsx`, `src/system/primitives/Surface.tsx`, `.storybook/decorators/withTheme.tsx`, and `src/system/hooks/ThemeOverride.tsx`.
- Keep examples CMS-shaped: each block under `src/system/examples/*/` accepts a `content` object typed in a sibling `types.ts`.

## Layers

**Token primitives:**
- Purpose: Store raw design values before they become semantic roles.
- Location: `src/tokens/primitives/`
- Contains: Color palettes, font stacks, responsive type scales, spacing, sizes, breakpoints, radii, borders, motion timings, opacity, and z-index values.
- Depends on: No application code; primitive files such as `src/tokens/primitives/color.ts` are plain TypeScript constants.
- Used by: `src/tokens/semantic/color.ts`, `src/tokens/semantic/space.ts`, `src/tokens/semantic/motion.ts`, `src/tokens/themes/index.ts`, and `src/tokens/build/emit.ts`.

**Semantic tokens and themes:**
- Purpose: Convert raw values into intent-based roles and theme-specific color remaps.
- Location: `src/tokens/semantic/`, `src/tokens/themes/`
- Contains: `ColorRoleKey`, `TextRole`, `SpaceRoleKey`, `MotionRole`, `ThemeName`, and `themes`.
- Depends on: `src/tokens/primitives/*`.
- Used by: `src/tokens/build/emit.ts`, `src/tokens/build/verify.ts`, typed component props such as `src/system/primitives/Text.tsx` and `src/system/primitives/Section.tsx`, and foundation stories such as `src/stories/foundations/Color.stories.tsx`.

**Token build output:**
- Purpose: Generate CSS variables and token type helpers for runtime consumption.
- Location: `src/tokens/generated/`
- Contains: `src/tokens/generated/tokens.css`, `src/tokens/generated/tokens.types.ts`.
- Depends on: `src/tokens/build.ts`, `src/tokens/build/emit.ts`, `src/tokens/build/emit-types.ts`, `src/tokens/build/verify.ts`.
- Used by: `src/system/styles/global.css`, which imports `src/tokens/generated/tokens.css`.

**Global styling:**
- Purpose: Load tokens, self-hosted fonts, browser reset, focus styling, theme transitions, and reduced-motion behavior.
- Location: `src/system/styles/`
- Contains: `global.css`, `fonts.css`, `reset.css`.
- Depends on: `src/tokens/generated/tokens.css`, `public/fonts/pp-telegraf/PPTelegraf-Ultrabold.woff2`, `public/fonts/pp-object-sans/PPObjectSans-Regular.woff2`.
- Used by: `src/main.tsx` and `.storybook/preview.tsx`.

**Primitives:**
- Purpose: Provide reusable layout, text, media, surface, icon, and link elements.
- Location: `src/system/primitives/`
- Contains: Component `.tsx`, sibling `.module.css`, co-located tests, and `src/system/primitives/index.ts`.
- Depends on: React, CSS Modules, selected token types from `@tokens`, and generated CSS variables through global CSS.
- Used by: `src/system/examples/*`, `src/stories/foundations/*`, and `src/stories/pages/*`.

**Hooks:**
- Purpose: Provide reusable client-side behavior for theme overrides, motion reveal, scroll fade, and hover state.
- Location: `src/system/hooks/`
- Contains: `ThemeOverrideProvider`, `useThemeOverride`, `useReveal`, `useScrollFade`, `useHover`, and co-located tests.
- Depends on: React and typed theme names from `@tokens/themes`.
- Used by: `.storybook/decorators/withProviders.tsx`, `src/stories/foundations/Theming.stories.tsx`, `src/stories/foundations/Motion.stories.tsx`, and `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`.

**Example blocks:**
- Purpose: Demonstrate foundation composition with realistic block-shaped content.
- Location: `src/system/examples/`
- Contains: One folder per block with `Block.tsx`, `types.ts`, `index.ts`, `Block.stories.tsx`, optional `Block.module.css`, and `Block.test.tsx`.
- Depends on: `@system/primitives`, selected hooks from `@system/hooks`, and type-only imports from `@tokens/themes`.
- Used by: `src/stories/pages/*` and each block's own Storybook stories.

**Storybook docs and page assemblies:**
- Purpose: Document foundations and demonstrate page-level editorial rhythm.
- Location: `src/stories/foundations/`, `src/stories/pages/`
- Contains: MDX docs, foundation stories, internal doc helpers, fixture data, and page stories.
- Depends on: `@system/primitives`, `@system/examples/*`, `@tokens/*`, and local fixtures in `src/stories/_fixtures/`.
- Used by: `.storybook/main.ts` story globs and `npm run storybook`.

## Data Flow

### Token Build Path

1. Primitive token constants are defined in `src/tokens/primitives/color.ts:5`, `src/tokens/primitives/type.ts`, `src/tokens/primitives/space.ts`, and sibling primitive files.
2. Semantic roles map primitives to intent in `src/tokens/semantic/color.ts:7`, `src/tokens/semantic/type.ts:21`, `src/tokens/semantic/space.ts`, and `src/tokens/semantic/motion.ts`.
3. Theme remaps are declared as complete semantic color records in `src/tokens/themes/index.ts:45`.
4. `npm run tokens:build` runs `tsx src/tokens/build.ts` from `package.json`; `src/tokens/build.ts:12` checks theme contrast before writing files.
5. `src/tokens/build/emit.ts:80` emits `:root`, `[data-theme="neutral"]`, and each theme block into `src/tokens/generated/tokens.css`.
6. `src/system/styles/global.css:3` imports the generated CSS so Vite and Storybook receive the same variables.

### Component Composition Path

1. A page story such as `src/stories/pages/EditorialHomepage.stories.tsx:21` renders a fragment of example blocks.
2. Example blocks such as `src/system/examples/HeroText/HeroText.tsx:9` receive typed `content` from `src/system/examples/HeroText/types.ts:3`.
3. Blocks compose primitives such as `Section`, `Container`, `Grid`, `Col`, `Stack`, `Text`, `Image`, and `TextLink` from `src/system/primitives/index.ts`.
4. Primitives map props to CSS module classes and attributes; `src/system/primitives/Section.tsx:18` sets `data-theme`, `src/system/primitives/Text.tsx:28` selects semantic tags, and `src/system/primitives/Col.tsx:15` sets responsive column CSS variables.
5. CSS modules consume generated token variables, for example `src/system/primitives/Section.module.css:2`, `src/system/primitives/Grid.module.css:4`, and `src/system/primitives/Text.module.css:7`.

### Storybook Runtime Path

1. `npm run storybook` starts Storybook with `@storybook/react-vite` from `package.json`.
2. `.storybook/main.ts:4` registers foundation MDX, foundation stories, example stories, and page stories.
3. `.storybook/preview.tsx:2` imports global system CSS and `.storybook/preview.tsx:65` applies decorators.
4. `.storybook/decorators/withProviders.tsx:4` wraps stories in `ThemeOverrideProvider`.
5. `.storybook/decorators/withTheme.tsx:6` applies the toolbar-selected theme to `document.documentElement`.
6. `.storybook/decorators/withReducedMotion.tsx:6` toggles the `force-reduced-motion` class used by `src/system/styles/global.css:67`.

### Interactive Theme Override Flow

1. A component calls `useThemeOverride(theme)` from `src/system/hooks/ThemeOverride.tsx:59`.
2. `ThemeOverrideProvider` allocates stable ids and stores active overrides in a `Map` in `src/system/hooks/ThemeOverride.tsx:23`.
3. The highest id wins during the provider effect in `src/system/hooks/ThemeOverride.tsx:39`.
4. The selected theme is applied to `document.body` by default in `src/system/hooks/ThemeOverride.tsx:40`, which lets an interactive child such as `src/system/examples/ThemedAccordion/ThemedAccordion.tsx:17` reskin the page while open.

**State Management:**
- There is no app-wide data store in `src/`; state is local React state in stories and examples, plus the context-backed theme override registry in `src/system/hooks/ThemeOverride.tsx`.
- Storybook global state controls the selected theme and reduced-motion mode in `.storybook/preview.tsx`.
- Static story data lives in `src/stories/_fixtures/copy.ts` and `src/stories/_fixtures/images.ts`.

## Key Abstractions

**ThemeName and data-theme:**
- Purpose: Keep theme selection typed while runtime styling flows through CSS custom properties.
- Examples: `src/tokens/themes/index.ts`, `src/system/primitives/Section.tsx`, `src/system/primitives/Surface.tsx`, `.storybook/decorators/withTheme.tsx`.
- Pattern: Components accept `theme?: ThemeName`, set `data-theme`, and let descendant CSS inherit semantic variables.

**TextRole:**
- Purpose: Centralize typography intent and semantic HTML defaults.
- Examples: `src/tokens/semantic/type.ts`, `src/system/primitives/Text.tsx`, `src/system/primitives/Text.module.css`.
- Pattern: `Text` receives `role`, selects a default tag from `defaultTag`, and applies a role-specific CSS module class.

**Layout primitives:**
- Purpose: Keep spacing, columns, and layout scale inside system primitives.
- Examples: `src/system/primitives/Section.tsx`, `src/system/primitives/Container.tsx`, `src/system/primitives/Grid.tsx`, `src/system/primitives/Col.tsx`, `src/system/primitives/Stack.tsx`, `src/system/primitives/Inline.tsx`.
- Pattern: Components expose small string-union props and CSS modules consume token variables.

**Content object block API:**
- Purpose: Keep example blocks close to CMS wiring without adding a backend or route layer.
- Examples: `src/system/examples/HeroText/types.ts`, `src/system/examples/ImageText/types.ts`, `src/system/examples/StoryTeaser/types.ts`.
- Pattern: Each block accepts `{ content: BlockContent }`, with optional `theme?: ThemeName` and block-specific fields.

**Barrel exports:**
- Purpose: Provide stable import paths for primitives, hooks, and example blocks.
- Examples: `src/system/primitives/index.ts`, `src/system/hooks/index.ts`, `src/system/examples/HeroText/index.ts`.
- Pattern: Export component props and content types from the folder-level `index.ts`.

## Entry Points

**Vite app:**
- Location: `index.html`, `src/main.tsx`, `src/App.tsx`
- Triggers: `npm run dev`, `npm run build`, and `npm run preview` from `package.json`.
- Responsibilities: Load `src/system/styles/global.css`, mount React in `#root`, and show a minimal pointer to Storybook.

**Storybook:**
- Location: `.storybook/main.ts`, `.storybook/preview.tsx`, `.storybook/manager.ts`
- Triggers: `npm run storybook` and `npm run build-storybook` from `package.json`.
- Responsibilities: Register stories, apply global CSS, provide toolbar globals, install decorators, configure docs viewports, and theme the Storybook manager UI.

**Token generation:**
- Location: `src/tokens/build.ts`
- Triggers: `npm run tokens:build`, plus the leading command in `npm run dev` and `npm run build`.
- Responsibilities: Run contrast verification and emit `src/tokens/generated/tokens.css` plus `src/tokens/generated/tokens.types.ts`.

**Tests:**
- Location: `vite.config.ts`, `src/test/setup.ts`, co-located `*.test.ts` and `*.test.tsx`.
- Triggers: `npm test` and `npm run test:watch` from `package.json`.
- Responsibilities: Run jsdom Vitest tests with Testing Library and non-scoped CSS module class names.

## Architectural Constraints

- **Threading:** Browser UI code in `src/` runs on the single React/browser event loop. The token build script in `src/tokens/build.ts` runs as a Node process through `tsx`.
- **Global state:** Storybook theme state mutates `document.documentElement` in `.storybook/decorators/withTheme.tsx`; reduced motion mutates `document.documentElement.classList` in `.storybook/decorators/withReducedMotion.tsx`; theme override mutates `document.body` or `document.documentElement` in `src/system/hooks/ThemeOverride.tsx`.
- **Circular imports:** No circular dependency chain is evident from sampled imports; dependency direction is tokens -> generated CSS -> system styles/primitives -> examples -> stories. Keep new imports aligned with this direction.
- **Generated files:** `src/tokens/generated/`, `dist/`, and `storybook-static/` are ignored by `.gitignore`; regenerate them instead of editing them directly.
- **Path aliases:** Use aliases from `vite.config.ts` and `tsconfig.app.json`: `@/*`, `@tokens/*`, and `@system/*`.
- **CSS value discipline:** `eslint.config.js` and `.stylelintrc.json` enforce no raw hex colors and no raw px string literals in `src/system/`; use token CSS variables in system CSS and typed token imports only where documentation or props require them.
- **No backend boundary:** There are no server routes, API clients, database modules, or CMS adapters in the current codebase.

## Anti-Patterns

### Using The Vite App As The Design Surface

**What happens:** `src/App.tsx` only renders a short note pointing users to Storybook.
**Why it's wrong:** Design-system behavior, examples, foundation docs, viewports, a11y addon state, and theme controls are registered through `.storybook/main.ts` and `.storybook/preview.tsx`.
**Do this instead:** Add foundations to `src/stories/foundations/`, example blocks to `src/system/examples/`, and page flows to `src/stories/pages/`.

### Editing Generated Token CSS

**What happens:** `src/tokens/generated/tokens.css` contains emitted CSS variables and starts with an auto-generated file comment.
**Why it's wrong:** `src/tokens/build.ts` overwrites generated output after contrast verification, so direct edits do not preserve the token source of truth.
**Do this instead:** Edit primitives in `src/tokens/primitives/`, semantic roles in `src/tokens/semantic/`, themes in `src/tokens/themes/index.ts`, then run `npm run tokens:build`.

### Bypassing Layout Primitives

**What happens:** Page and block composition is built around `Section`, `Container`, `Grid`, `Col`, `Stack`, and `Inline` from `src/system/primitives/index.ts`.
**Why it's wrong:** Raw layout CSS in examples or page stories bypasses the spacing, grid, and theme contracts enforced by `src/system/primitives/*.module.css`.
**Do this instead:** Compose or extend primitives in `src/system/primitives/`; keep block-local CSS limited to component-specific behavior such as `src/system/examples/ThemedAccordion/ThemedAccordion.module.css`.

## Error Handling

**Strategy:** Build-time checks handle token validity; UI components are mostly typed, synchronous, and prop-driven.

**Patterns:**
- `src/tokens/build.ts:12` fails the token build when `verifyThemeContrast()` returns AA contrast errors.
- `src/tokens/build.ts:18` exits the Node process with a non-zero status when contrast verification fails.
- Browser hooks guard missing browser APIs and DOM refs, for example `src/system/hooks/useReveal.ts:3` and `src/system/hooks/useScrollFade.ts:14`.
- Components rely on TypeScript prop types such as `src/system/primitives/Image.tsx:8`, `src/system/primitives/Text.tsx:19`, and `src/system/examples/HeroText/types.ts:3` instead of runtime validation.

## Cross-Cutting Concerns

**Logging:** Build logging is limited to the token build script in `src/tokens/build.ts`; runtime UI code does not define a logging abstraction.

**Validation:** Token contrast validation lives in `src/tokens/build/verify.ts`; TypeScript strictness is configured in `tsconfig.app.json`; lint/style constraints live in `eslint.config.js` and `.stylelintrc.json`.

**Authentication:** Not applicable; no authentication code, routes, server middleware, or identity provider integration is present in `src/`.

**Accessibility:** Storybook includes `@storybook/addon-a11y` in `.storybook/main.ts`; global focus styling lives in `src/system/styles/global.css`; image primitives require `alt` in `src/system/primitives/Image.tsx`.

---

*Architecture analysis: 2026-05-28*
