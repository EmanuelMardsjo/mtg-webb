# Coding Conventions

**Analysis Date:** 2026-05-28

## Naming Patterns

**Files:**
- Use PascalCase for React component implementation files and matching tests/stories: `src/system/primitives/Text.tsx`, `src/system/primitives/Text.test.tsx`, `src/system/examples/ImageText/ImageText.stories.tsx`.
- Use one component directory per example block with `Component.tsx`, `Component.test.tsx`, `Component.stories.tsx`, `types.ts`, and `index.ts`: `src/system/examples/ImageText/ImageText.tsx`, `src/system/examples/ImageText/types.ts`, `src/system/examples/ImageText/index.ts`.
- Use `.module.css` next to the component it styles: `src/system/primitives/Text.module.css`, `src/system/examples/ThemedAccordion/ThemedAccordion.module.css`.
- Use lowercase functional module names for hooks and token build modules: `src/system/hooks/useReveal.ts`, `src/tokens/build/emit.ts`, `src/tokens/build/contrast.ts`.
- Use lowercase token category files under token layers: `src/tokens/primitives/color.ts`, `src/tokens/semantic/type.ts`, `src/tokens/themes/index.ts`.
- Use Storybook page/foundation files with descriptive PascalCase names and `.stories.tsx` or `.mdx`: `src/stories/foundations/Color.stories.tsx`, `src/stories/foundations/TokensArchitecture.mdx`, `src/stories/pages/EditorialHomepage.stories.tsx`.

**Functions:**
- Use PascalCase for exported React components: `Text` in `src/system/primitives/Text.tsx`, `ImageText` in `src/system/examples/ImageText/ImageText.tsx`, `ThemeOverrideProvider` in `src/system/hooks/ThemeOverride.tsx`.
- Use `use` prefix for React hooks: `useThemeOverride` in `src/system/hooks/ThemeOverride.tsx`, `useReveal` in `src/system/hooks/useReveal.ts`, `useScrollFade` in `src/system/hooks/useScrollFade.ts`.
- Use camelCase for pure helpers and token build functions: `emitTokensCss` in `src/tokens/build/emit.ts`, `verifyThemeContrast` in `src/tokens/build/verify.ts`, `contrastRatio` in `src/tokens/build/contrast.ts`.
- Use local test helper functions for repeated render setup, named `setup` or a small component name: `setup` in `src/system/examples/ThemedAccordion/ThemedAccordion.test.tsx`, `Comp` in `src/system/hooks/useReveal.test.tsx`.

**Variables:**
- Use camelCase for runtime variables and helper maps: `defaultTag` and `roleClass` in `src/system/primitives/Text.tsx`, `baseContent` in `src/system/examples/ImageText/ImageText.test.tsx`.
- Use `content` as the standard prop for example blocks that model CMS/editor-authored content: `src/system/examples/HeroText/HeroText.tsx`, `src/system/examples/StoryTeaser/StoryTeaser.tsx`, `src/system/examples/ChecklistTeaser/ChecklistTeaser.tsx`.
- Use `s` as the CSS Module import alias: `src/system/primitives/Grid.tsx`, `src/system/primitives/Text.tsx`, `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`.
- Use uppercase only for true module constants: `DEFAULT_ROOT_MARGIN` in `src/system/hooks/useReveal.ts`, `AA_NORMAL` in `src/tokens/build/verify.ts`.
- Use kebab-case for CSS classes and CSS custom properties: `.role-display` in `src/system/primitives/Text.module.css`, `--col-span-lg` in `src/system/primitives/Col.tsx`, `--space-grid-gutter-lg` in `src/system/primitives/Grid.module.css`.

**Types:**
- Use PascalCase for exported type aliases: `TextProps` in `src/system/primitives/Text.tsx`, `ImageTextContent` in `src/system/examples/ImageText/types.ts`, `ThemeName` in `src/tokens/themes/index.ts`.
- Name component prop types as `{ComponentName}Props`: `ContainerProps` in `src/system/primitives/Container.tsx`, `ThemedAccordionProps` in `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`.
- Name CMS-style content types as `{ComponentName}Content`: `SignpostContent` in `src/system/examples/Signpost/types.ts`, `AICompanionTeaserContent` in `src/system/examples/AICompanionTeaser/types.ts`.
- Prefer literal unions and `keyof typeof` token types over broad strings: `TextRole` in `src/tokens/semantic/type.ts`, `SpaceKey` in `src/tokens/primitives/space.ts`, `ThemeName` in `src/tokens/themes/index.ts`.

## Code Style

**Formatting:**
- No Prettier or Biome config is present. Match the existing handwritten style in `src/system/primitives/Text.tsx`, `src/system/examples/ImageText/ImageText.tsx`, and `src/tokens/build/emit.ts`.
- Use 2-space indentation, single quotes, no trailing semicolons, and compact object/union formatting where it stays readable: `src/system/primitives/Text.tsx`, `src/system/examples/Signpost/Signpost.stories.tsx`.
- Keep JSX readable by placing nested primitives on separate lines when composition grows: `src/system/examples/ImageText/ImageText.tsx`, `src/system/examples/StoryTeaser/StoryTeaser.tsx`.
- Build class names with arrays and `.filter(Boolean).join(' ')`: `src/system/primitives/Text.tsx`, `src/system/primitives/Grid.tsx`, `src/system/primitives/Section.tsx`.
- For dynamic layout values, set CSS custom properties through typed inline style objects instead of generating CSS classes: `src/system/primitives/Col.tsx`, `src/system/primitives/Image.tsx`.

**Linting:**
- ESLint uses flat config with `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`: `eslint.config.js`.
- TypeScript linting applies to `**/*.{ts,tsx}` and extends recommended JS and TypeScript rules: `eslint.config.js`.
- React Hooks rules are enabled through `react-hooks.configs.recommended.rules`: `eslint.config.js`.
- `react-refresh/only-export-components` is a warning with `{ allowConstantExport: true }`: `eslint.config.js`.
- Unused vars are warnings in ESLint, with `_` allowed for intentionally unused args/vars: `eslint.config.js`.
- TypeScript strictness is enforced through `strict`, `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch`: `tsconfig.app.json`, `tsconfig.node.json`.
- Raw hex colors and raw `px` string literals are banned in `src/system/**/*.{ts,tsx}` by `no-restricted-syntax`: `eslint.config.js`.
- Stylelint extends `stylelint-config-standard`, bans raw hex colors in CSS by default, and relaxes token-generated CSS rules for `src/tokens/**/*.css`: `.stylelintrc.json`.

## Import Organization

**Order:**
1. External package imports, with type-only imports using `import type`: `src/system/primitives/Text.tsx`, `.storybook/preview.tsx`.
2. Alias imports from `@tokens` and `@system`: `src/system/examples/ImageText/ImageText.tsx`, `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`.
3. Relative local imports for component types, CSS modules, and same-folder modules: `src/system/examples/ImageText/ImageText.tsx`, `src/system/primitives/Grid.tsx`.

**Path Aliases:**
- `@/*` maps to `src/*`: `vite.config.ts`, `tsconfig.app.json`.
- `@tokens/*` maps to `src/tokens/*`: `vite.config.ts`, `tsconfig.app.json`.
- `@system/*` maps to `src/system/*`: `vite.config.ts`, `tsconfig.app.json`.
- Use aliases for cross-layer imports and relative paths for same-folder files: `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`, `src/stories/pages/EditorialHomepage.stories.tsx`.

## Error Handling

**Patterns:**
- UI components avoid throwing during render and guard optional content with conditional rendering: `src/system/examples/HeroText/HeroText.tsx`, `src/system/examples/StoryTeaser/StoryTeaser.tsx`, `src/system/examples/ImageText/ImageText.tsx`.
- Hooks guard DOM/browser APIs before use: `prefersReducedMotion` checks `window` and `matchMedia` in `src/system/hooks/useReveal.ts`.
- Effects return early when required state or refs are missing: `src/system/hooks/useReveal.ts`, `src/system/hooks/ThemeOverride.tsx`.
- Token verification returns structured error arrays for the build entry point to decide process behavior: `src/tokens/build/verify.ts`, `src/tokens/build.ts`.
- The token build entry point logs AA contrast failures and exits with status 1: `src/tokens/build.ts`.
- Low-level invalid token input may throw explicit errors, as in `hexToRgb` for invalid hex strings: `src/tokens/build/contrast.ts`.

## Logging

**Framework:** console

**Patterns:**
- Use `console.error` and `process.exit(1)` only in Node build scripts that run from npm scripts: `src/tokens/build.ts`.
- Use `console.log` only for successful token build CLI output: `src/tokens/build.ts`.
- Do not log from React components, hooks, stories, or tests: `src/system/primitives/Text.tsx`, `src/system/hooks/useReveal.ts`, `src/system/examples/ImageText/ImageText.tsx`.

## Comments

**When to Comment:**
- Use a short banner comment for example-only blocks that must be replaced before production: `src/system/examples/ImageText/ImageText.tsx`, `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`.
- Comment non-obvious browser/test limitations where the code needs manual simulation: `src/system/examples/ThemedAccordion/ThemedAccordion.test.tsx`.
- Comment complex ordering or stack behavior in stateful hooks/providers: `src/system/hooks/ThemeOverride.tsx`.
- Keep routine JSX and token maps uncommented when names are clear: `src/system/primitives/Text.tsx`, `src/tokens/semantic/space.ts`.

**JSDoc/TSDoc:**
- TSDoc is sparse and reserved for public hook options that need parameter clarification: `RevealOptions` in `src/system/hooks/useReveal.ts`.
- Generated output comments should make generated files self-identifying: `emitTokensCss` in `src/tokens/build/emit.ts`.

## Function Design

**Size:** Keep components and hooks small enough to fit their module responsibility. Most primitives are under 35 lines, such as `src/system/primitives/Grid.tsx`, `src/system/primitives/Stack.tsx`, and `src/system/primitives/Text.tsx`. Larger functions are acceptable for token emission or stateful provider behavior: `src/tokens/build/emit.ts`, `src/system/hooks/ThemeOverride.tsx`.

**Parameters:** Prefer a single props object for React components and typed option objects for hooks. Use default values in destructuring for component variants and hook options: `src/system/primitives/Container.tsx`, `src/system/primitives/Image.tsx`, `src/system/hooks/useReveal.ts`.

**Return Values:** React components return JSX directly. Hooks return small objects or void depending on usage: `useReveal` returns `{ ref, revealed }` in `src/system/hooks/useReveal.ts`; `useThemeOverride` returns `void` in `src/system/hooks/ThemeOverride.tsx`. Token build helpers return strings or arrays rather than performing I/O, with I/O centralized in `src/tokens/build.ts`.

## Module Design

**Exports:** Use named exports for source modules and barrel files. Storybook files are the main exception and use default `meta` plus named stories: `src/system/primitives/index.ts`, `src/system/examples/ImageText/index.ts`, `src/system/examples/ImageText/ImageText.stories.tsx`.

**Barrel Files:** Use `index.ts` to expose public primitives, hooks, examples, and tokens. Keep implementation details in sibling files: `src/system/primitives/index.ts`, `src/system/hooks/index.ts`, `src/tokens/index.ts`, `src/system/examples/StoryTeaser/index.ts`.

**Layer Rules:**
- Put token source of truth under `src/tokens/`; generated token files are ignored and emitted by `src/tokens/build.ts`.
- Put reusable layout and UI primitives under `src/system/primitives/`; these own spacing, columns, typography roles, image treatment, themes, and shared UI behavior.
- Put reusable behavior hooks under `src/system/hooks/`.
- Put foundation/example blocks under `src/system/examples/`; keep their content prop shape in `types.ts` and expose through `index.ts`.
- Put documentation and page assemblies in Storybook under `src/stories/` and `.storybook/`.

---

*Convention analysis: 2026-05-28*
