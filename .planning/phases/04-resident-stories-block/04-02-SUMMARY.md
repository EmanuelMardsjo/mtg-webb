---
phase: 04-resident-stories-block
plan: 02
subsystem: ui
tags: [react, typescript, css-modules, sticky-stage, scroll-sections, cross-fade, accessibility, design-system, storybook, vitest]

# Dependency graph
requires:
  - phase: 04-resident-stories-block
    provides: "04-01 ResidentStoriesContent type + ResidentStories component (post-mount data-live gate, .story/.storyActive classes, inline --progress var, useScrollSections track)"
  - phase: 03-crash-course-rail
    provides: "MockObserver test stub + href↔article assertions, .rise + --rise-d idiom, figure-fill .media img override, named-export barrel"
provides:
  - "ResidentStories.module.css: token-only verbatim-MTGNeighborhoods sticky stage + track/anchor, [data-live]-gated absolute cross-faded story panels, dark-ink scaleY(var(--progress)) fill, gated .rise stagger, decorative quote-mark clamp, <768px + prefers-reduced-motion static-stack fallbacks (both gate-independent)"
  - "SC#2 graceful-degradation contract realized in CSS: base story state is in-flow opacity:1; ALL absolute/opacity:0/cross-fade hidden states scoped behind [data-live]; small-screen + reduced-motion overrides win regardless of the gate"
  - "ResidentStories.stories.tsx: Default (3 residents, fullscreen) + FourStories (different count) + WithLinkedStory (href variant)"
  - "ResidentStories.test.tsx: accessibility contract + binding SC#2 data-live gate regression guard"
  - "index.ts barrel: named ResidentStories + ResidentStoriesProps + ResidentStoriesContent + ResidentStory"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SC#2 single-mechanism degradation: every absolute/opacity:0/cross-fade hidden rule scoped behind [data-live]; base (no data-live) is an in-flow opacity:1 stack — no-JS/pre-mount is readable"
    - "Gate-INDEPENDENT static-stack overrides: dual `[data-live] .stage .story, .story` selectors inside <768px and prefers-reduced-motion blocks beat the live gate so the readable stack always wins (scoped stylelint-disable for the intentional descending specificity)"
    - "Dark-ink decorative progress: scaleY(var(--progress)) fill = --color-text-default over a color-mix 16% track (NOT --color-accent-line); inline-var driven, no per-frame JS height writes"
    - "Binding structural-gate test: assert data-live present after mount + exactly one .storyActive + no hard-coded hidden class on non-active panels — removing the gate fails the test (proven)"

key-files:
  created:
    - src/system/examples/ResidentStories/ResidentStories.module.css
    - src/system/examples/ResidentStories/ResidentStories.stories.tsx
    - src/system/examples/ResidentStories/ResidentStories.test.tsx
    - src/system/examples/ResidentStories/index.ts
  modified: []

key-decisions:
  - "D-10: mirror MTGNeighborhoods sticky stage/track/anchor verbatim; stage radius nudged to calc(var(--radius-lg) * 1.5) for the softer source card-radius (token-pure)"
  - "SC#2 single strategy: ONE mechanism — gate every hidden state behind [data-live]; no duplicated hidden state, no 'rely on the test'"
  - "Gate-independence via scoped stylelint-disable no-descending-specificity: the dual `[data-live] .stage .story, .story` override is the mechanism that lets the bare .story beat the earlier live rule on small screens / reduced motion"
  - "D-4 progress fill is dark editorial ink (--color-text-default), explicitly NOT --color-accent-line (pink)"
  - "Stories: Default 3 residents + FourStories (progress scale changes) + WithLinkedStory (href variant) — all fullscreen"

patterns-established:
  - "Cross-fade panels whose readable base is the no-JS fallback: gate the hidden state, never the visible state"
  - "Static-stack media queries must include the gated selector in their override (dual selector) to be gate-independent"

requirements-completed: [REQ-01, REQ-02, REQ-04, REQ-06]

# Metrics
duration: ~5min
completed: 2026-06-03
---

# Phase 4 Plan 02: ResidentStories CSS, Story, Test + Barrel Summary

**Completed the ResidentStories block: a token-only CSS module that mirrors the proven MTGNeighborhoods sticky stage/track verbatim (D-10), stacks the story panels with an absolute [data-live]-gated cross-fade, fills a dark-ink `scaleY(var(--progress))` progress bar driven by the active index, and staggers `.rise` pieces — with the entire hidden cross-fade state scoped behind the post-mount `[data-live]` gate so the no-JS / pre-mount baseline is a readable in-flow stack (SC#2), plus `<768px` and `prefers-reduced-motion` static-stack fallbacks that override the gate. Shipped the Storybook story (3 residents + a different count + a linked variant), the named-export barrel, and a binding accessibility-contract test whose SC#2 structural-gate assertion fails if the `data-live` gate is removed (proven).**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-06-03T13:41Z
- **Completed:** 2026-06-03T13:46Z
- **Tasks:** 3 completed
- **Files modified:** 4 created

## Accomplishments

- **Task 1 — CSS module** (`ResidentStories.module.css`, commit `ee75d62`): header comment documenting token-only intent + the sanctioned clamp/calc/min/vh px exception. `.block` (relative, `padding-inline: var(--space-5)`). Sticky stage gated under `[data-live]` (`position: sticky; top: var(--space-5); height: calc(100vh - 2 * var(--space-5))`, overflow hidden, `calc(var(--radius-lg) * 1.5)` radius, hairline border, surface-page bg, token-timed swap transition) with a relative base. Story panels: BASE `.story { position: relative; opacity: 1 }` (the SC#2 readable baseline) + gated `[data-live] .stage .story { position: absolute; inset: 0 }`, `[data-live] .story:not(.storyActive) { opacity: 0; pointer-events: none; translateY }`, `[data-live] .storyActive { opacity: 1; z-index: var(--z-raised) }`. `.inner` two-column `width: min(1180px, 90vw)` with `data-side='left'` row-reverse. `.rise` stagger (motion-reveal tokens + `var(--rise-d, 0ms)`), hidden pre-state gated on the non-active panel. Decorative `.mark` quote glyph via `clamp(64px, 9vw, 132px)`. `.media` figure (4/5, `max-width: 460px`, `calc(var(--radius-lg) * 1.5)`, overflow clip, surface-raised) + the required `.media img { object-fit: cover }` fill override. `.progress` (faint `color-mix 16%` track) + `.progressFill { transform: scaleY(var(--progress, 0)); transform-origin: top; background: var(--color-text-default) }` — dark ink, NOT the pink accent line. `.track`/`.anchor` verbatim. `<768px` + `prefers-reduced-motion` static-stack guards, both gate-independent.
- **Task 2 — story + barrel** (`ResidentStories.stories.tsx` + `index.ts`, commit `a829838`): `Default` (3 source residents — Aditi/Tomás/Maya — via `IMAGES.portrait/mtgFeatureSofa/mtgHeroCoat`, `layout: 'fullscreen'`, no intro heading so the Section aria-label carries the title D-8), `FourStories` (adds a 4th resident so the progress scale changes), `WithLinkedStory` (one `href` to demonstrate the linked-`<a>` variant D-7). Barrel exports `ResidentStories` + `ResidentStoriesProps` + `ResidentStoriesContent` + `ResidentStory` (named only, no default).
- **Task 3 — accessibility-contract test** (`ResidentStories.test.tsx`, commit `411857f`): verbatim never-firing `MockObserver` + jsdom-limitation comment. Asserts all stories' eyebrow/headline/attribution present (SC#2 baseline), `getAllByRole('heading', { level: 3 }).length === stories.length` (D-9), href→link with that href / no-href→not-a-link (D-7), per-story image alt + `getAllByRole('img')` count, the binding SC#2 structural gate (`data-live` present after mount; exactly one `.storyActive`; non-active panels carry only `.story`), decorative `[aria-hidden].progress` with no `progressbar` role (D-4), and the Section's `region` accessible name (D-8).

## Verification

- **`npm run typecheck` (`tsc -b --noEmit`):** PASSES (whole repo).
- **`npm run lint` (eslint + stylelint):** 0 errors (5 pre-existing warnings in unrelated files: `.storybook/decorators/*`, `MTGNeighborhoods/map-asset.tsx`, `hooks/ThemeOverride.tsx`). Stylelint clean on the new CSS module.
- **`npx vitest run src/system/examples/ResidentStories/ResidentStories.test.tsx`:** 8/8 pass.
- **Full suite (`npx vitest run`):** 34 files / 132 tests pass — block addition is non-regressive.
- **CSS grep gates (all pass):** `position: sticky` =1; `calc(100vh - 2 * var(--space-5))` present; `height: 100vh` present; `[data-live]` =15 (≥3); `[data-live] .stage .story` present; `[data-live] .story:not(.storyActive)` present; `scaleY(var(--progress` present; `transform-origin: top` present; `--color-accent-line` =0; `prefers-reduced-motion: reduce` present (restores `opacity: 1` and overrides `[data-live]`); `width < 768px` present (restores `opacity: 1`); `var(--motion-reveal-duration)` + `var(--rise-d, 0ms)` present; `object-fit: cover` present; raw hex =0; every `px` inside `clamp()`/`min()`/`max-width` cap / `<768px` query (no bare `: NNpx;` property values); `position: absolute` only on gated `.story` + `.progress`; `opacity: 0` only under `[data-live]`.
- **Story/barrel grep gates (all pass):** `layout: 'fullscreen'`; Aditi/Tomás/Maya; `IMAGES.(portrait|mtgFeatureSofa|mtgHeroCoat)`; a `Four` second story; barrel named exports for component + props + content types; no `export default` in `index.ts`.
- **Test grep gates (all pass):** `class MockObserver` =1; `getAllByRole('heading', { level: 3 })`; `getByRole('link'` + `queryByRole('link'`; `querySelector('[data-live]')` + `.storyActive`; `data-live` ≥1; baseline keyword ≥1; `queryByRole('progressbar')`; `getByRole('region'`; `getByAltText`/`getAllByRole('img'`.
- **SC#2 regression guard proven binding:** temporarily forcing the `data-live` gate off (`live` → always false) was confirmed to FAIL exactly the structural-gate test (1 failed | 7 passed); restoring the gate returns 8/8. The guard catches gate removal as required.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking lint gate] Scoped `stylelint-disable no-descending-specificity` around the two gate-independent static-stack overrides**
- **Found during:** Task 1 (`npm run lint` / stylelint).
- **Issue:** The plan mandates dual selectors `[data-live] .stage .story, .story` (and the matching `.rise` pair) inside the `<768px` and `prefers-reduced-motion` blocks so the static stack wins regardless of the gate. Because the bare `.story` / `.rise` rules (lower specificity) appear earlier in the file, these later lower-specificity selectors trip `stylelint-config-standard`'s `no-descending-specificity` (4 errors). The descending specificity is the load-bearing mechanism (the static-stack override must be reachable with or without `data-live`), so it cannot be reordered away.
- **Fix:** Wrapped each of the four override rules in a `/* stylelint-disable no-descending-specificity */ … /* stylelint-enable … */` block (a `disable-next-line` mis-targets because stylelint reports the violation on the second selector line, not the rule opener), with a load-bearing comment explaining the intentional descending specificity. Scoped narrowly to the two media-query override clusters only.
- **Files modified:** `src/system/examples/ResidentStories/ResidentStories.module.css`
- **Commit:** `ee75d62`

## Known Stubs

None. The CSS realizes the full sticky cross-fade + degradation contract against the real 04-01 component classes; the story renders real fixture imagery; the test asserts the live wiring (the never-firing-observer baseline + the data-live gate) rather than painted geometry (a documented jsdom limitation, not a stub). The progress indicator's optional `role="progressbar"` enhancement (D-4) is intentionally NOT shipped (the block stays `aria-hidden` decorative per the SPEC recommendation) and is flagged in 04-UI-SPEC, not deferred work.

## Threat Flags

None. The block is a static, author-content editorial sequence — no network endpoints, no auth paths, no file access, no schema changes. Linked stories are plain `<a href>` from author-provided content (no injection surface beyond the existing Image/Text primitives).

## Scope Boundary

Strictly limited to this plan's four files under `src/system/examples/ResidentStories/`. Parallel uncommitted USER changes (notably `src/system/examples/FooterCta/` and `src/stories/*`) were left untouched; every commit used explicit `git add <path>` (never `git add -A`/`.`); FooterCta was not touched.

## Self-Check: PASSED

- `src/system/examples/ResidentStories/ResidentStories.module.css` — FOUND
- `src/system/examples/ResidentStories/ResidentStories.stories.tsx` — FOUND
- `src/system/examples/ResidentStories/ResidentStories.test.tsx` — FOUND
- `src/system/examples/ResidentStories/index.ts` — FOUND
- Commit `ee75d62` (CSS module) — FOUND
- Commit `a829838` (story + barrel) — FOUND
- Commit `411857f` (test) — FOUND
