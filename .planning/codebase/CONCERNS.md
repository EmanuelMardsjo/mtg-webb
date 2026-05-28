# Codebase Concerns

**Analysis Date:** 2026-05-28

## Tech Debt

**Foundation examples are not production blocks:**
- Issue: The nine block-like components are explicitly tagged as examples and route all content through local Storybook fixtures instead of production data boundaries.
- Files: `src/system/examples/AICompanionTeaser/AICompanionTeaser.tsx`, `src/system/examples/ChecklistTeaser/ChecklistTeaser.tsx`, `src/system/examples/EditorialText/EditorialText.tsx`, `src/system/examples/HeroText/HeroText.tsx`, `src/system/examples/ImageText/ImageText.tsx`, `src/system/examples/JobTeaser/JobTeaser.tsx`, `src/system/examples/Signpost/Signpost.tsx`, `src/system/examples/StoryTeaser/StoryTeaser.tsx`, `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`, `src/stories/_fixtures/copy.ts`, `src/stories/_fixtures/images.ts`
- Impact: Future production work can accidentally treat examples as CMS-ready components; content validation, real data mapping, analytics hooks, and production accessibility coverage are absent.
- Fix approach: Promote blocks one at a time into a production location such as `src/blocks/`, add per-block adapters under `src/cms/` after a CMS is chosen, and keep Storybook stories backed by realistic production-shaped fixtures.

**Storybook token generation is a manual prerequisite:**
- Issue: `src/system/styles/global.css` imports ignored generated files from `src/tokens/generated/`, while `npm run storybook` and `npm run build-storybook` do not run `npm run tokens:build`.
- Files: `src/system/styles/global.css`, `src/tokens/build.ts`, `.gitignore`, `package.json`, `README.md`
- Impact: A fresh checkout or cleaned workspace can fail to start or build Storybook until `npm run tokens:build` has been run manually. `npm run dev` and `npm run build` are self-contained, but the primary documentation surface is not.
- Fix approach: Prefix `storybook` and `build-storybook` scripts with `npm run tokens:build`, or move token emission behind a Vite/Storybook plugin that guarantees the generated CSS exists before module resolution.

**Lint and type compromises remain in configuration modules:**
- Issue: `vite.config.ts` casts the config to `any` and suppresses `@typescript-eslint/no-explicit-any`; lint also reports Fast Refresh warnings in decorator/hook modules.
- Files: `vite.config.ts`, `.storybook/decorators/withTheme.tsx`, `.storybook/decorators/withReducedMotion.tsx`, `src/system/hooks/ThemeOverride.tsx`, `eslint.config.js`
- Impact: Config typing gaps can hide incompatible Vite/Vitest option changes, and Fast Refresh warnings make Storybook development behavior less predictable.
- Fix approach: Use the Vitest-aware config typing supported by the installed toolchain, split decorator helper components from HOC exports, and split `ThemeOverrideProvider` from `useThemeOverride` if Fast Refresh purity is required.

**Asset provenance is tracked in code comments, not source-of-truth metadata:**
- Issue: Fonts and images are checked into `public/`, but no committed license or attribution manifest is present; fixture comments say Unsplash images must be replaced before production.
- Files: `public/fonts/pp-telegraf/PPTelegraf-Ultrabold.woff2`, `public/fonts/pp-object-sans/PPObjectSans-Regular.woff2`, `public/images/image-bank/`, `src/stories/_fixtures/images.ts`, `src/stories/foundations/ImageBank.stories.tsx`, `src/stories/foundations/Brand.stories.tsx`
- Impact: Production review has to rediscover which assets are licensed, provisional, Figma-derived, or replacement-only.
- Fix approach: Add `public/fonts/LICENSE.txt` and an image attribution/provenance manifest, then make stories consume that manifest instead of duplicating provenance in story data.

## Known Bugs

**Storybook scripts can fail after generated token files are absent:**
- Symptoms: Storybook imports `src/system/styles/global.css`, which imports `src/tokens/generated/tokens.css`; that directory is ignored and not built by Storybook scripts.
- Files: `src/system/styles/global.css`, `src/tokens/generated/tokens.css`, `.gitignore`, `package.json`
- Trigger: Run `npm run storybook` or `npm run build-storybook` in a clean checkout before `npm run tokens:build`.
- Workaround: Run `npm run tokens:build` first. Prefer making the Storybook scripts self-contained.

**No application runtime bug reproduced by scripted checks:**
- Symptoms: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run build-storybook` complete successfully in this workspace.
- Files: `package.json`, `vite.config.ts`, `src/test/setup.ts`
- Trigger: Not detected.
- Workaround: Not applicable.

## Security Considerations

**Moderate npm audit findings in dev tooling:**
- Risk: `npm audit --audit-level=moderate` reports vulnerable `esbuild` through `vite` and vulnerable `uuid` through Storybook addon dependencies.
- Files: `package.json`, `package-lock.json`, `vite.config.ts`, `.storybook/main.ts`
- Current mitigation: Affected packages are development/documentation tooling; production app code has no server-side secret or auth surface.
- Recommendations: Upgrade Vite and Storybook on a dedicated dependency phase, avoid exposing local Vite/Storybook dev servers to untrusted networks, and rerun `npm audit` after the upgrade.

**Remote fixture images create privacy, availability, and compliance risk if promoted:**
- Risk: Page stories load remote Unsplash URLs directly, which sends client requests to a third party and depends on external availability.
- Files: `src/stories/_fixtures/images.ts`, `src/stories/pages/EditorialHomepage.stories.tsx`, `src/stories/pages/IndustryCareers.stories.tsx`, `src/stories/pages/MovingJourney.stories.tsx`, `src/stories/pages/RegionalLivability.stories.tsx`, `src/stories/foundations/Motion.stories.tsx`
- Current mitigation: Fixture file comments mark these as replacement assets.
- Recommendations: Use local, licensed assets for production stories and blocks; keep external URLs out of production fixtures unless consent, attribution, and caching rules are defined.

**Secrets are not present in scanned project files:**
- Risk: Not detected.
- Files: `.gitignore`, `package.json`, `src/`
- Current mitigation: No `.env`, `.env.*`, credential, key, or secret files were found outside ignored dependency/build directories.
- Recommendations: Keep secrets out of Storybook stories and add documented env handling only when integrations are introduced.

## Performance Bottlenecks

**Static Storybook emits large documentation chunks:**
- Problem: `npm run build-storybook` reports chunks larger than 500 kB, including large Storybook, docs, and accessibility addon bundles.
- Files: `.storybook/main.ts`, `.storybook/preview.tsx`, `package.json`, `storybook-static/`
- Cause: Docs, a11y tooling, and story modules are bundled into large static assets.
- Improvement path: Lazy-load heavy stories/docs, review addon usage for production documentation builds, and add Rollup manual chunking only if static Storybook load time becomes a product requirement.

**Image assets are heavy and not responsive:**
- Problem: `public/images/` is about 5 MB; individual WebP assets reach roughly 1.2 MB, and the shared `Image` primitive does not support `srcSet`, `sizes`, intrinsic `width`/`height`, or `decoding`.
- Files: `public/images/image-bank/`, `src/system/primitives/Image.tsx`, `src/stories/foundations/ImageBank.stories.tsx`, `src/stories/_fixtures/images.ts`
- Cause: Images are stored as fixed assets or remote URLs and rendered through a minimal primitive.
- Improvement path: Add responsive image metadata to content types, extend `Image` with `width`, `height`, `decoding`, `srcSet`, and `sizes`, and generate multiple sizes for production assets.

**Scroll fade uses one global listener pair per hook instance:**
- Problem: Every `useScrollFade` consumer attaches its own `scroll` and `resize` listeners and performs layout reads in `requestAnimationFrame`.
- Files: `src/system/hooks/useScrollFade.ts`, `src/stories/foundations/Motion.stories.tsx`
- Cause: The hook is intentionally small and local to each animated block.
- Improvement path: Keep usage sparse; for production page templates with many animated blocks, replace per-instance listeners with a shared observer or IntersectionObserver-based progress model.

## Fragile Areas

**Global theme override stack depends on render-order IDs and DOM mutation:**
- Files: `src/system/hooks/ThemeOverride.tsx`, `.storybook/decorators/withProviders.tsx`, `.storybook/decorators/withTheme.tsx`, `src/system/examples/ThemedAccordion/ThemedAccordion.tsx`
- Why fragile: `ThemeOverrideProvider` mutates `document.body` or `document.documentElement`, ranks overrides by IDs allocated during render, and coexists with a Storybook decorator that also mutates `document.documentElement`.
- Safe modification: Keep one provider high in the render tree, add tests before supporting multiple providers or mixed `body`/`html` scopes, and preserve unregister-on-unmount behavior when refactoring.
- Test coverage: Unit tests cover basic override push/pop, but not multiple providers, `scope="html"`, Storybook decorator interactions, or Strict Mode render-order edge cases.

**Contrast verification covers only one theme pair and skips campaign values:**
- Files: `src/tokens/build/verify.ts`, `src/tokens/build/contrast.ts`, `src/tokens/themes/index.ts`, `src/tokens/build/verify.test.ts`, `src/stories/foundations/Color.stories.tsx`
- Why fragile: The AA gate checks `text-default` against `surface-page`, skips `campaign`, and does not verify `text-muted`, `surface-raised`, status colors, focus rings, or overlay combinations.
- Safe modification: Expand the token verifier into an explicit role matrix and include Storybook-visible failures for every text/surface/status pairing.
- Test coverage: Tests assert the current verifier returns no errors; they do not include failing fixture themes or runtime campaign contrast scenarios.

**Primitive contracts are thin for production content:**
- Files: `src/system/primitives/Text.tsx`, `src/system/primitives/TextLink.tsx`, `src/system/primitives/Image.tsx`, `src/system/examples/*/types.ts`
- Why fragile: Text roles can be rendered as arbitrary tags, links accept any anchor props without external-link policy helpers, and image content types only require `src` and `alt`.
- Safe modification: Add production content validators and higher-level CMS adapters rather than making primitives responsible for every editorial rule.
- Test coverage: Primitive tests cover basic rendering, classes, and attributes; they do not cover heading hierarchy, external-link `rel` policy, responsive image sizing, or page-level accessibility.

## Scaling Limits

**No production page renderer or CMS adapter layer:**
- Current capacity: Four page assemblies exist as Storybook stories, and all content is hard-coded in fixtures or story render functions.
- Files: `src/stories/pages/EditorialHomepage.stories.tsx`, `src/stories/pages/IndustryCareers.stories.tsx`, `src/stories/pages/MovingJourney.stories.tsx`, `src/stories/pages/RegionalLivability.stories.tsx`, `src/stories/_fixtures/copy.ts`, `src/stories/_fixtures/images.ts`
- Limit: The repo cannot render arbitrary CMS pages or validate editor-provided block content.
- Scaling path: Add `src/cms/` adapters, a block registry, and production page templates that convert CMS data into the existing block content types.

**Manual icon and asset registries do not scale with a larger design system:**
- Current capacity: `Icon` supports three local glyphs; the image bank is a hard-coded story data structure with 21 assets.
- Files: `src/system/primitives/Icon.tsx`, `src/system/primitives/icons/ArrowRight.tsx`, `src/system/primitives/icons/Check.tsx`, `src/system/primitives/icons/MapPin.tsx`, `src/stories/foundations/ImageBank.stories.tsx`, `public/images/image-bank/`
- Limit: Adding many icons or assets requires source edits, union updates, and repeated metadata entry.
- Scaling path: Generate icon and image manifests from source asset folders, then type-check component props against those generated manifests.

**Theme additions require synchronized edits across several files:**
- Current capacity: Thirteen theme names are hard-coded in `src/tokens/themes/index.ts` and duplicated in Storybook toolbar configuration.
- Files: `src/tokens/themes/index.ts`, `.storybook/preview.tsx`, `src/tokens/build/emit.ts`, `src/stories/foundations/Theming.stories.tsx`
- Limit: Adding, renaming, or removing a theme requires coordinated changes to theme records, emitted CSS, docs, and `.storybook/preview.tsx`.
- Scaling path: Export typed theme metadata from `src/tokens/themes/index.ts` and import it into Storybook config/docs instead of duplicating the list.

## Dependencies at Risk

**Vite 5 and Storybook 8 carry audit and upgrade pressure:**
- Risk: `npm audit` reports moderate vulnerabilities through `vite`/`esbuild` and Storybook's addon dependency chain; `npm outdated` shows Storybook 10 and Vite 8 as latest major lines.
- Impact: Security remediation requires breaking upgrades rather than a clean patch update.
- Migration plan: Create a dependency-upgrade phase that upgrades Vite, Storybook, and related addons together, runs `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run build-storybook`, then verifies Storybook visually.

**Node version is not enforced beyond `.nvmrc`:**
- Risk: `.nvmrc` specifies Node 20, while installed development types resolve to `@types/node@25.9.1`; `package.json` has no `engines` field.
- Impact: Contributors can build with different Node versions and miss version-specific incompatibilities in token build scripts or Vite config.
- Migration plan: Add `engines.node` to `package.json`, align `@types/node` with the supported runtime line, and run CI on the supported Node version.

## Missing Critical Features

**No CI pipeline is present:**
- Problem: No `.github/` workflows or other CI configuration were detected.
- Files: `.github/`, `package.json`
- Blocks: Automated enforcement of `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`, and `npm audit`.

**No automated visual or accessibility regression suite:**
- Problem: Storybook includes `@storybook/addon-a11y`, but there is no Playwright, Chromatic, Storybook test-runner, or axe CI task.
- Files: `.storybook/main.ts`, `.storybook/preview.tsx`, `package.json`, `src/stories/pages/`
- Blocks: Safe verification of responsive layout, theme coverage, keyboard focus, and WCAG regressions across the Storybook pages.

**No production integration layer:**
- Problem: CMS wiring is documented but not implemented.
- Files: `src/stories/foundations/WiringToACMS.mdx`, `src/stories/foundations/FoundationsToProduction.mdx`, `src/system/examples/`
- Blocks: Rendering real Move to Gothenburg content from Optimizely, Contentful, Sanity, Storyblok, or another CMS.

## Test Coverage Gaps

**Animation hooks need behavioral tests:**
- What's not tested: `useScrollFade` scroll/resize progress updates, reduced-motion behavior, RAF cleanup, and listener cleanup.
- Files: `src/system/hooks/useScrollFade.ts`, `src/system/hooks/useScrollFade.test.tsx`, `src/system/hooks/useReveal.ts`, `src/system/hooks/useReveal.test.tsx`
- Risk: Scroll-driven animation regressions can ship while unit tests pass.
- Priority: Medium

**Theme and token coverage is not exhaustive:**
- What's not tested: Campaign runtime variables, `scope="html"`, multiple providers, Storybook decorator interactions, and full contrast matrices.
- Files: `src/system/hooks/ThemeOverride.tsx`, `src/system/hooks/ThemeOverride.test.tsx`, `src/tokens/build/verify.ts`, `src/tokens/build/verify.test.ts`, `.storybook/decorators/withTheme.tsx`
- Risk: Theme regressions can appear only in Storybook or production page composition.
- Priority: High

**Production accessibility coverage is missing:**
- What's not tested: Full page keyboard order, heading hierarchy across composed blocks, link target policies, image sizing/alt quality, and axe checks for Storybook stories.
- Files: `src/stories/pages/EditorialHomepage.stories.tsx`, `src/stories/pages/IndustryCareers.stories.tsx`, `src/stories/pages/MovingJourney.stories.tsx`, `src/stories/pages/RegionalLivability.stories.tsx`, `src/system/primitives/TextLink.test.tsx`, `src/system/primitives/Image.test.tsx`
- Risk: Component-level tests pass while assembled page flows regress accessibility.
- Priority: High

---

*Concerns audit: 2026-05-28*
