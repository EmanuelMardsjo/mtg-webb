---
phase: 01-live-the-life-feature-block
plan: 02
subsystem: ui
tags: [react, example-block, css-modules, reveal, parallax, reduced-motion, storybook, vitest, theming]

# Dependency graph
requires:
  - phase: 01-live-the-life-feature-block
    provides: "useParallax hook ({ ref }) writing --parallax-text/-frame/-img on its node"
  - phase: 00-scaffold
    provides: "@system primitives (Section/Container/Stack/Text/Image/Icon), @system/hooks (useReveal), @tokens themes + tokens.css"
provides:
  - "FeatureSpotlight example block under src/system/examples/ (full 6-file anatomy)"
  - "FeatureSpotlightContent CMS content shape with optional local theme"
  - "The MTG block-import adaptation pattern (adapt-not-copy) for phases 2-4"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Merged-ref callback attaching useReveal + useParallax to one plain <div> root (no shared merge-ref utility)"
    - "Local theme via Section theme prop (no document.body mutation)"
    - "Per-child --rise-d stagger carried on plain wrappers because Text accepts no style prop"
    - "Media aspect-ratio set in CSS on .frame (Image.aspect is a named-token union only)"

key-files:
  created:
    - src/system/examples/FeatureSpotlight/types.ts
    - src/system/examples/FeatureSpotlight/FeatureSpotlight.tsx
    - src/system/examples/FeatureSpotlight/FeatureSpotlight.module.css
    - src/system/examples/FeatureSpotlight/FeatureSpotlight.stories.tsx
    - src/system/examples/FeatureSpotlight/FeatureSpotlight.test.tsx
    - src/system/examples/FeatureSpotlight/index.ts
  modified: []

key-decisions:
  - "Text rejects inline style; carried --rise-d on plain <div> wrappers around the eyebrow/headline/lead Texts so the .rise transition still applies"
  - "Used aria-label={content.headline} on the root instead of aria-labelledby (Text exposes no id) — equivalent accessible name"
  - "Stubbed IntersectionObserver in the test (jsdom lacks it; useReveal constructs one) mirroring the in-repo useReveal.test precedent — the plan's no-mock premise only held for MTGHero, which does not use useReveal"
  - "Dropped 0px fallbacks in var(--parallax-*) consumption (declared defaults on .root instead) to satisfy stylelint length-zero-no-unit, matching MTGHero's bare var() usage"
  - "Alternate-theme story uses blue-soft (a soft peer theme) alongside the pink-soft default"

requirements-completed: [REQ-01, REQ-02, REQ-03, REQ-04, REQ-06]

# Metrics
duration: ~12min
completed: 2026-06-03
---

# Phase 1 Plan 02: FeatureSpotlight example block Summary

**A themeable, image-led editorial feature block (Section -> Container -> centered Stack + media figure) that reveals on scroll via useReveal and drifts with restrained useParallax, built from @system primitives + @tokens only, fully static under prefers-reduced-motion.**

## Performance

- **Duration:** ~12 min
- **Tasks:** 3
- **Files modified:** 6 (all created)

## Accomplishments
- Full 6-file `src/system/examples/FeatureSpotlight/` anatomy (REQ-01): `types.ts`, `FeatureSpotlight.tsx`, `.module.css`, `.stories.tsx`, `.test.tsx`, `index.ts`.
- `FeatureSpotlightContent` CMS shape with `eyebrow / headline / lead / cta{label,href} / image{src,alt} / theme?` (REQ-03).
- Composes only `@system` primitives + `@tokens`; lint passes with no raw hex/px in the block (REQ-02).
- Motion: `useReveal` + `useParallax` merged onto one plain `<div>` root via an inline merged-ref callback; under `prefers-reduced-motion` the CSS guard neutralizes `.rise` transitions and all parallax transforms, so content is fully visible and static (REQ-04).
- Storybook story (Default pink-soft + BlueSoftTheme alternate) using seeded UI-SPEC copy and the portrait fixture; 5 passing Vitest tests (REQ-06).

## Task Commits

Each task was committed atomically (explicit paths only — pre-existing unrelated working-tree changes were left untouched):

1. **Task 1: type + component** - `70ebb7f` (feat)
2. **Task 2: CSS module** - `a831f11` (feat)
3. **Task 3: story, test, barrel** - `957d2b0` (test)

## Files Created/Modified
- `types.ts` — `FeatureSpotlightContent` (mirrors EditorialText/types, image mirrors HeroImage `{src,alt}`).
- `FeatureSpotlight.tsx` — banner comment, both hooks, inline merged-ref on a plain root `<div>` with `aria-label={content.headline}`, `theme={content.theme ?? 'pink-soft'}`, headline `Text role="display" as="h2"`, single filled-pill CTA `<a>` with `Icon arrow-right`, `riseStyle(ms)` stagger.
- `FeatureSpotlight.module.css` — `.root` parallax-var defaults; `calc(var(--radius-lg)*2)` frame radius; `aspect-ratio: 1312/611` (4/5 under 768px) set in CSS; `.rise` stagger gated by `.root:not(.revealed)`; inverted filled pill; `prefers-reduced-motion` guard.
- `FeatureSpotlight.stories.tsx` — `title: 'Examples/FeatureSpotlight'`, `Default` + `BlueSoftTheme`, `layout: 'fullscreen'`.
- `FeatureSpotlight.test.tsx` — eyebrow/headline/lead, h2 headline, image alt, CTA href, no-motion baseline; local IntersectionObserver stub.
- `index.ts` — barrels component, props, content type.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Text primitive rejects the inline `style` prop**
- **Found during:** Task 1 (typecheck error TS2322 — `style` not on `TextProps`).
- **Issue:** The plan's `<Text ... style={riseStyle(n)}>` for eyebrow/headline/lead does not compile; `Text` only accepts `role/as/tone/className/children`.
- **Fix:** Carried `.rise` + the `--rise-d` style on plain `<div>` wrappers around those three `Text` elements (the CTA `<a>` and media `<figure>` accept `style` directly, so they keep `.rise` inline). The `.rise` transition still applies. This is exactly the fallback the plan authorized ("move the `--rise-d` style to the nearest accepting wrapper").
- **Files modified:** `FeatureSpotlight.tsx`
- **Commit:** `70ebb7f`

**2. [Rule 1 - Bug] Rendering the block crashed the test (no IntersectionObserver in jsdom)**
- **Found during:** Task 3 (all 5 tests failed — `useReveal` calls `new IntersectionObserver(...)` in an effect; jsdom does not provide it).
- **Issue:** The plan asserted "Do NOT mock IntersectionObserver (MTGHero does not)" — but MTGHero never calls `useReveal`, so it never hits the missing global. `FeatureSpotlight` does call `useReveal`, so the constructor throws on render.
- **Fix:** Added a minimal `IntersectionObserver` stub (observe/unobserve/disconnect no-ops, never firing intersection) in the test file via `beforeEach`, mirroring the established `src/system/hooks/useReveal.test.tsx` precedent. The no-motion baseline assertion remains valid: the observer never fires, and the hidden pre-state is CSS-only (not applied in jsdom), so content is present.
- **Files modified:** `FeatureSpotlight.test.tsx`
- **Commit:** `957d2b0`

**3. [Rule 3 - Blocking] Stylelint `length-zero-no-unit` + duplicate-selector on the CSS**
- **Found during:** Task 2 (stylelint).
- **Issue:** `var(--parallax-*, 0px)` fallbacks tripped `length-zero-no-unit`; the parallax `.frame`/`.frame img` blocks duplicated the media-frame `.frame`/`.frame img` blocks.
- **Fix:** Dropped the `0px` fallbacks (defaults are declared on `.root`, matching MTGHero's bare `var(--mx)` usage) and merged the parallax transforms into the single `.frame` / `.frame img` rules.
- **Files modified:** `FeatureSpotlight.module.css`
- **Commit:** `a831f11`

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None — no external service or package installs (phase uses only existing deps).

## Known Stubs
None. The block renders real content from its `content` prop; fixtures supply the story copy/image. The `IntersectionObserver` stub is test-only (jsdom shim), not a product stub.

## Next Phase Readiness
- FeatureSpotlight establishes the adapt-not-copy MTG block-import pattern (merged reveal+parallax root, local Section theme, CSS-set media ratio, Text-style workaround) that phases 2-4 (Crash Course, Footer+CTA, Resident Stories) reuse.
- Phase 1 is complete: plan 01 (useParallax hook) + plan 02 (FeatureSpotlight block) both shipped.

## Self-Check: PASSED
- FOUND: src/system/examples/FeatureSpotlight/types.ts
- FOUND: src/system/examples/FeatureSpotlight/FeatureSpotlight.tsx
- FOUND: src/system/examples/FeatureSpotlight/FeatureSpotlight.module.css
- FOUND: src/system/examples/FeatureSpotlight/FeatureSpotlight.stories.tsx
- FOUND: src/system/examples/FeatureSpotlight/FeatureSpotlight.test.tsx
- FOUND: src/system/examples/FeatureSpotlight/index.ts
- FOUND commit: 70ebb7f (feat — type + component)
- FOUND commit: a831f11 (feat — CSS module)
- FOUND commit: 957d2b0 (test — story + test + barrel)

---
*Phase: 01-live-the-life-feature-block*
*Completed: 2026-06-03*
