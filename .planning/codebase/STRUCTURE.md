# Codebase Structure

**Analysis Date:** 2026-05-28

## Directory Layout

```text
mtg-webb/
+-- .planning/                 # GSD planning and codebase map documents
+-- .storybook/                # Storybook config, decorators, and manager theme
+-- dist/                      # Ignored Vite production build output
+-- docs/                      # Superpowers specs and implementation plans
+-- public/                    # Static assets served by Vite and Storybook
+-- src/
|   +-- stories/               # Storybook foundation docs, fixtures, and page assemblies
|   +-- system/                # Design-system styles, primitives, hooks, and example blocks
|   +-- test/                  # Global Vitest setup and smoke test
|   +-- tokens/                # Token source, build pipeline, tests, and generated output
|   +-- App.tsx                # Minimal Vite app content
|   +-- main.tsx               # React root mount
|   +-- vite-env.d.ts          # Vite environment types
+-- storybook-static/          # Ignored static Storybook build output
+-- index.html                 # Vite HTML entry
+-- package.json               # npm scripts and dependencies
+-- vite.config.ts             # Vite, aliases, and Vitest config
+-- tsconfig*.json             # TypeScript project references and compiler settings
+-- eslint.config.js           # ESLint rules, including system no-hex/no-px restrictions
+-- .stylelintrc.json          # Stylelint rules and token CSS overrides
```

## Directory Purposes

**`.planning/`:**
- Purpose: Stores GSD planning artifacts and generated codebase analysis.
- Contains: `.planning/codebase/STACK.md`, `.planning/codebase/INTEGRATIONS.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`.
- Key files: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`.

**`.storybook/`:**
- Purpose: Configures Storybook as the primary design-system documentation surface.
- Contains: Story globs, addons, global toolbar controls, decorators, and manager theming.
- Key files: `.storybook/main.ts`, `.storybook/preview.tsx`, `.storybook/decorators/withProviders.tsx`, `.storybook/decorators/withTheme.tsx`, `.storybook/decorators/withReducedMotion.tsx`, `.storybook/manager.ts`, `.storybook/sbTheme.ts`.

**`docs/`:**
- Purpose: Stores project spec and implementation planning context.
- Contains: Superpowers specs and plans for the design-system foundations.
- Key files: `docs/superpowers/specs/2026-05-22-mtg-design-system-foundations-design.md`, `docs/superpowers/plans/2026-05-22-mtg-design-system-foundations.md`.

**`public/`:**
- Purpose: Stores static assets referenced by Vite, Storybook, and CSS.
- Contains: Brand SVG, self-hosted font files, and image-bank WebP assets.
- Key files: `public/brand/mtg-logo.svg`, `public/fonts/pp-telegraf/PPTelegraf-Ultrabold.woff2`, `public/fonts/pp-object-sans/PPObjectSans-Regular.woff2`, `public/images/image-bank/`.

**`src/`:**
- Purpose: Contains all source code for the Vite app, design-system foundations, stories, tests, and tokens.
- Contains: `src/main.tsx`, `src/App.tsx`, `src/system/`, `src/tokens/`, `src/stories/`, `src/test/`.
- Key files: `src/main.tsx`, `src/App.tsx`, `src/system/styles/global.css`, `src/tokens/build.ts`.

**`src/tokens/`:**
- Purpose: Owns the design token graph and token build pipeline.
- Contains: Primitive tokens, semantic tokens, theme remaps, build helpers, tests, generated CSS/types, and a typed re-export.
- Key files: `src/tokens/index.ts`, `src/tokens/build.ts`, `src/tokens/primitives/color.ts`, `src/tokens/semantic/color.ts`, `src/tokens/themes/index.ts`, `src/tokens/generated/tokens.css`.

**`src/tokens/primitives/`:**
- Purpose: Store raw design values.
- Contains: `border.ts`, `breakpoint.ts`, `color.ts`, `motion.ts`, `opacity.ts`, `radius.ts`, `size.ts`, `space.ts`, `type.ts`, `z.ts`.
- Key files: `src/tokens/primitives/color.ts`, `src/tokens/primitives/type.ts`, `src/tokens/primitives/space.ts`.

**`src/tokens/semantic/`:**
- Purpose: Store role-based token mappings used by generated CSS and typed component props.
- Contains: `color.ts`, `motion.ts`, `space.ts`, `type.ts`, and semantic token tests.
- Key files: `src/tokens/semantic/color.ts`, `src/tokens/semantic/type.ts`, `src/tokens/semantic/type.test.ts`.

**`src/tokens/themes/`:**
- Purpose: Store complete `ThemeName` color remaps.
- Contains: `index.ts`.
- Key files: `src/tokens/themes/index.ts`.

**`src/tokens/build/`:**
- Purpose: Convert the token graph into generated artifacts and verify contrast.
- Contains: CSS emitter, type emitter, contrast utilities, verifier, and tests.
- Key files: `src/tokens/build/emit.ts`, `src/tokens/build/emit-types.ts`, `src/tokens/build/verify.ts`, `src/tokens/build/contrast.ts`.

**`src/tokens/generated/`:**
- Purpose: Store generated token output consumed by CSS and tooling.
- Contains: `tokens.css`, `tokens.types.ts`.
- Key files: `src/tokens/generated/tokens.css`, `src/tokens/generated/tokens.types.ts`.

**`src/system/`:**
- Purpose: Stores the reusable React design-system layer.
- Contains: `src/system/primitives/`, `src/system/hooks/`, `src/system/examples/`, `src/system/styles/`.
- Key files: `src/system/primitives/index.ts`, `src/system/hooks/index.ts`, `src/system/styles/global.css`.

**`src/system/styles/`:**
- Purpose: Load generated tokens, fonts, reset rules, global accessibility styles, theme transitions, and reduced-motion overrides.
- Contains: `global.css`, `fonts.css`, `reset.css`.
- Key files: `src/system/styles/global.css`, `src/system/styles/fonts.css`, `src/system/styles/reset.css`.

**`src/system/primitives/`:**
- Purpose: Store foundational React primitives and their CSS modules/tests.
- Contains: `Container`, `Section`, `Grid`, `Col`, `Stack`, `Inline`, `Text`, `Image`, `Divider`, `Surface`, `Icon`, `TextLink`, and primitive icons.
- Key files: `src/system/primitives/index.ts`, `src/system/primitives/Section.tsx`, `src/system/primitives/Grid.tsx`, `src/system/primitives/Text.tsx`, `src/system/primitives/Icon.tsx`.

**`src/system/primitives/icons/`:**
- Purpose: Store inline SVG glyph components used by `Icon`.
- Contains: `ArrowRight.tsx`, `Check.tsx`, `MapPin.tsx`.
- Key files: `src/system/primitives/icons/ArrowRight.tsx`, `src/system/primitives/icons/Check.tsx`, `src/system/primitives/icons/MapPin.tsx`.

**`src/system/hooks/`:**
- Purpose: Store reusable browser/React behavior for the design system.
- Contains: Theme override provider/hook, reveal hook, scroll fade hook, hover hook, tests, and barrel export.
- Key files: `src/system/hooks/ThemeOverride.tsx`, `src/system/hooks/useReveal.ts`, `src/system/hooks/useScrollFade.ts`, `src/system/hooks/useHover.ts`, `src/system/hooks/index.ts`.

**`src/system/examples/`:**
- Purpose: Store example blocks that demonstrate foundations and CMS-like content contracts.
- Contains: One folder per example block with implementation, types, Storybook story, index export, and tests.
- Key files: `src/system/examples/HeroText/HeroText.tsx`, `src/system/examples/ImageText/ImageText.tsx`, `src/system/examples/ChecklistTeaser/ChecklistTeaser.tsx`, `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`.

**`src/stories/`:**
- Purpose: Stores Storybook-only documentation, fixtures, and page assemblies.
- Contains: `src/stories/foundations/`, `src/stories/pages/`, `src/stories/_fixtures/`.
- Key files: `src/stories/foundations/Introduction.mdx`, `src/stories/foundations/Color.stories.tsx`, `src/stories/pages/EditorialHomepage.stories.tsx`, `src/stories/_fixtures/copy.ts`.

**`src/stories/foundations/`:**
- Purpose: Document design foundations for designers, developers, and stakeholders.
- Contains: MDX docs, foundation stories, and internal documentation helpers.
- Key files: `src/stories/foundations/TokensArchitecture.mdx`, `src/stories/foundations/Typography.stories.tsx`, `src/stories/foundations/Layout.stories.tsx`, `src/stories/foundations/Theming.stories.tsx`.

**`src/stories/foundations/_internal/`:**
- Purpose: Store helper components and CSS modules used only by foundation stories.
- Contains: Grid overlay, swatches, brand asset styling, image bank styling, semantic color matrix styling.
- Key files: `src/stories/foundations/_internal/Swatch.tsx`, `src/stories/foundations/_internal/GridOverlay.tsx`, `src/stories/foundations/_internal/SemanticColorMatrix.module.css`.

**`src/stories/pages/`:**
- Purpose: Store full-page example assemblies rendered in Storybook.
- Contains: Four `*.stories.tsx` page flows.
- Key files: `src/stories/pages/EditorialHomepage.stories.tsx`, `src/stories/pages/IndustryCareers.stories.tsx`, `src/stories/pages/MovingJourney.stories.tsx`, `src/stories/pages/RegionalLivability.stories.tsx`.

**`src/stories/_fixtures/`:**
- Purpose: Store reusable story copy and image fixture objects.
- Contains: Realistic placeholder copy and public image URLs.
- Key files: `src/stories/_fixtures/copy.ts`, `src/stories/_fixtures/images.ts`.

**`src/test/`:**
- Purpose: Store global test setup and smoke tests.
- Contains: Vitest jest-dom setup and toolchain smoke test.
- Key files: `src/test/setup.ts`, `src/test/smoke.test.ts`.

**`dist/`:**
- Purpose: Store Vite production output.
- Contains: Built HTML, assets, copied public files.
- Key files: `dist/index.html`, `dist/assets/`.

**`storybook-static/`:**
- Purpose: Store static Storybook output.
- Contains: Built Storybook HTML, story index, manager assets, preview assets, public files.
- Key files: `storybook-static/index.html`, `storybook-static/iframe.html`, `storybook-static/index.json`, `storybook-static/assets/`.

## Key File Locations

**Entry Points:**
- `index.html`: Vite HTML entry that loads `src/main.tsx`.
- `src/main.tsx`: React root mount and global CSS import.
- `src/App.tsx`: Minimal Vite app content pointing users to Storybook.
- `.storybook/main.ts`: Storybook story discovery and addon setup.
- `.storybook/preview.tsx`: Storybook global CSS, toolbar globals, viewports, and decorators.
- `src/tokens/build.ts`: Token generation CLI entry.

**Configuration:**
- `package.json`: npm scripts, runtime dependencies, and development dependencies.
- `vite.config.ts`: Vite React plugin, path aliases, and Vitest config.
- `tsconfig.json`: TypeScript project references.
- `tsconfig.app.json`: Browser/source compiler options and path aliases.
- `tsconfig.node.json`: Node-side compiler options for Vite and token build files.
- `eslint.config.js`: TypeScript/React lint rules and `src/system/` raw-value restrictions.
- `.stylelintrc.json`: CSS linting, color restrictions, and generated token CSS overrides.
- `.gitignore`: Ignored generated directories including `dist/`, `storybook-static/`, and `src/tokens/generated/`.

**Core Logic:**
- `src/tokens/primitives/color.ts`: Raw palette values and status/overlay primitives.
- `src/tokens/semantic/color.ts`: Semantic color role contract.
- `src/tokens/semantic/type.ts`: Text role contract.
- `src/tokens/themes/index.ts`: Theme names and semantic color remaps.
- `src/tokens/build/emit.ts`: Generated CSS assembly.
- `src/tokens/build/verify.ts`: Theme contrast verification.
- `src/system/primitives/index.ts`: Public primitive exports.
- `src/system/hooks/ThemeOverride.tsx`: Context-backed theme override behavior.
- `src/system/styles/global.css`: Shared global CSS import chain.

**Components and Examples:**
- `src/system/primitives/Section.tsx`: Section spacing and theme boundary primitive.
- `src/system/primitives/Container.tsx`: Container sizing primitive.
- `src/system/primitives/Grid.tsx`: Responsive grid primitive.
- `src/system/primitives/Col.tsx`: Responsive column span/start primitive.
- `src/system/primitives/Text.tsx`: Semantic text primitive.
- `src/system/primitives/Image.tsx`: Token-friendly image primitive.
- `src/system/primitives/TextLink.tsx`: Link primitive with optional icon.
- `src/system/examples/HeroText/HeroText.tsx`: Example hero text block.
- `src/system/examples/ImageText/ImageText.tsx`: Example image/text block.
- `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`: Example block using theme override state.

**Storybook Documentation:**
- `src/stories/foundations/Introduction.mdx`: Foundation introduction.
- `src/stories/foundations/TokensArchitecture.mdx`: Token architecture documentation.
- `src/stories/foundations/Color.stories.tsx`: Primitive and semantic color documentation.
- `src/stories/foundations/Theming.stories.tsx`: Theme documentation and interactive override demo.
- `src/stories/foundations/Motion.stories.tsx`: Motion hook documentation.
- `src/stories/pages/EditorialHomepage.stories.tsx`: Homepage editorial flow.

**Testing:**
- `vite.config.ts`: Vitest environment, setup file, CSS module behavior, and include glob.
- `src/test/setup.ts`: Testing Library jest-dom import.
- `src/system/primitives/*.test.tsx`: Primitive component tests.
- `src/system/examples/*/*.test.tsx`: Example block tests.
- `src/system/hooks/*.test.tsx`: Hook tests.
- `src/tokens/build/*.test.ts`: Token build tests.
- `src/tokens/semantic/type.test.ts`: Semantic typography token tests.

## Naming Conventions

**Files:**
- React primitive components use PascalCase filenames with matching CSS module and test files: `src/system/primitives/Text.tsx`, `src/system/primitives/Text.module.css`, `src/system/primitives/Text.test.tsx`.
- Example blocks use folder-per-block PascalCase naming: `src/system/examples/HeroText/HeroText.tsx`, `src/system/examples/HeroText/types.ts`, `src/system/examples/HeroText/index.ts`.
- Storybook stories use `*.stories.tsx`: `src/system/examples/ImageText/ImageText.stories.tsx`, `src/stories/pages/MovingJourney.stories.tsx`.
- Storybook docs use `.mdx`: `src/stories/foundations/FoundationsToProduction.mdx`, `src/stories/foundations/WiringToACMS.mdx`.
- CSS modules use `*.module.css`: `src/system/primitives/Grid.module.css`, `src/stories/foundations/_internal/Swatch.module.css`.
- Token source files use lowercase domain names: `src/tokens/primitives/breakpoint.ts`, `src/tokens/semantic/motion.ts`, `src/tokens/themes/index.ts`.
- Tests are co-located and named `*.test.ts` or `*.test.tsx`: `src/tokens/build/emit.test.ts`, `src/system/hooks/useReveal.test.tsx`.

**Directories:**
- System primitives live flat under `src/system/primitives/`, with nested `src/system/primitives/icons/` only for SVG glyphs.
- Example blocks live in PascalCase folders under `src/system/examples/`.
- Story-only implementation helpers live under `src/stories/foundations/_internal/`.
- Token layers live in lowercase folders under `src/tokens/`: `primitives`, `semantic`, `themes`, `build`, `generated`.
- Page assemblies live directly under `src/stories/pages/`.

## Where to Add New Code

**New Token Primitive:**
- Primary code: `src/tokens/primitives/`
- Semantic mapping: `src/tokens/semantic/`
- Theme mapping: `src/tokens/themes/index.ts`
- Build output wiring: `src/tokens/build/emit.ts`, `src/tokens/build/emit-types.ts`
- Tests: `src/tokens/build/*.test.ts` or a focused test next to the token domain.

**New Theme:**
- Primary code: `src/tokens/themes/index.ts`
- Generated CSS behavior: `src/tokens/build/emit.ts`
- Documentation: `src/stories/foundations/Color.stories.tsx`, `src/stories/foundations/Theming.stories.tsx`, `.storybook/preview.tsx`
- Tests: `src/tokens/build/verify.test.ts`, `src/tokens/build/emit.test.ts`

**New Primitive:**
- Implementation: `src/system/primitives/NewPrimitive.tsx`
- Styles: `src/system/primitives/NewPrimitive.module.css`
- Tests: `src/system/primitives/NewPrimitive.test.tsx`
- Public export: `src/system/primitives/index.ts`
- Documentation story: `src/stories/foundations/` when it is foundational, or a focused story near examples when it is block-specific.

**New Hook:**
- Implementation: `src/system/hooks/useNewHook.ts`
- Tests: `src/system/hooks/useNewHook.test.tsx`
- Public export: `src/system/hooks/index.ts`
- Storybook demonstration: `src/stories/foundations/` if the hook affects visible foundation behavior.

**New Example Block:**
- Implementation: `src/system/examples/NewBlock/NewBlock.tsx`
- Types: `src/system/examples/NewBlock/types.ts`
- Public export: `src/system/examples/NewBlock/index.ts`
- Story: `src/system/examples/NewBlock/NewBlock.stories.tsx`
- Tests: `src/system/examples/NewBlock/NewBlock.test.tsx`
- Page usage: `src/stories/pages/*.stories.tsx`

**New Foundation Documentation:**
- Primary code: `src/stories/foundations/NewTopic.stories.tsx` or `src/stories/foundations/NewTopic.mdx`
- Story-only helpers: `src/stories/foundations/_internal/`
- Storybook ordering: `.storybook/preview.tsx`

**New Page Assembly:**
- Primary code: `src/stories/pages/NewFlow.stories.tsx`
- Reusable copy/images: `src/stories/_fixtures/copy.ts`, `src/stories/_fixtures/images.ts`
- Blocks: Compose existing blocks from `src/system/examples/*` and primitives from `src/system/primitives/`.

**Utilities:**
- Token build utilities: `src/tokens/build/`
- Storybook-only utilities: `src/stories/foundations/_internal/` or `.storybook/decorators/`
- Runtime design-system behavior: `src/system/hooks/`
- Avoid general-purpose utility folders until repeated shared behavior appears in at least two concrete places.

## Special Directories

**`src/tokens/generated/`:**
- Purpose: Generated token artifacts consumed by `src/system/styles/global.css`.
- Generated: Yes, by `src/tokens/build.ts`.
- Committed: No; ignored by `.gitignore`.

**`dist/`:**
- Purpose: Vite production build output.
- Generated: Yes, by `npm run build`.
- Committed: No; ignored by `.gitignore`.

**`storybook-static/`:**
- Purpose: Static Storybook build output.
- Generated: Yes, by `npm run build-storybook`.
- Committed: No; ignored by `.gitignore`.

**`node_modules/`:**
- Purpose: Installed npm dependencies.
- Generated: Yes, by `npm install`.
- Committed: No; ignored by `.gitignore`.

**`public/`:**
- Purpose: Source static assets copied into Vite and Storybook builds.
- Generated: No.
- Committed: Partially tracked in git; current repo state includes additional untracked assets under `public/brand/`, `public/fonts/pp-object-sans/`, `public/fonts/pp-telegraf/`, and `public/images/`.

**`docs/superpowers/`:**
- Purpose: Project planning/specification source material.
- Generated: No.
- Committed: Yes.

---

*Structure analysis: 2026-05-28*
