---
phase: 01-live-the-life-feature-block
plan: 01
subsystem: ui
tags: [react, hooks, scroll, parallax, css-custom-properties, reduced-motion, vitest]

# Dependency graph
requires:
  - phase: 00-scaffold
    provides: "@system/hooks barrel + analog hooks (useScrollFade, useMagneticLean, useReveal)"
provides:
  - "useParallax hook in @system/hooks — rAF-throttled scroll parallax writing --parallax-text/-frame/-img CSS vars on its ref node"
  - "Tested reduced-motion contract (no listener, no vars) for the FeatureSpotlight block"
affects: [01-02-feature-spotlight-block]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "rAF-throttled scroll listener writing CSS custom properties on the DOM node (no per-frame setState)"
    - "isReduced() guard honoring both prefers-reduced-motion and the .force-reduced-motion Storybook class"

key-files:
  created:
    - src/system/hooks/useParallax.ts
    - src/system/hooks/useParallax.test.tsx
  modified:
    - src/system/hooks/index.ts

key-decisions:
  - "Used useMagneticLean's isReduced() form (class + media query) over useScrollFade's prefersReducedMotion() so the Storybook reduced-motion toolbar disables parallax"
  - "Output via style.setProperty only — no React state — so scroll produces no re-renders"
  - "Restrained translateY-only drift constants (-18/-28/-40px); no scale/rotate per brand motion guardrail"

patterns-established:
  - "Scroll-driven CSS-var hooks combine the useScrollFade rAF lifecycle with the useMagneticLean setProperty write model"

requirements-completed: [REQ-04, REQ-02]

# Metrics
duration: 8min
completed: 2026-06-03
---

# Phase 1 Plan 01: useParallax hook Summary

**rAF-throttled scroll-parallax hook that writes restrained translateY drift to --parallax-text/-frame/-img CSS custom properties on its ref node, with zero re-renders and a full reduced-motion no-op.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-06-03T13:30:00Z
- **Completed:** 2026-06-03T13:35:00Z
- **Tasks:** 2
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments
- `useParallax()` returns `{ ref }` and drives 3-layer parallax via a single rAF-throttled scroll+resize listener writing `--parallax-text/-frame/-img` on the node.
- No React state is used, so scrolling never triggers a re-render (writes go straight to the DOM node like `useMagneticLean`).
- Fully disabled under `prefers-reduced-motion` and the Storybook `force-reduced-motion` class: the effect early-returns before attaching any listener and leaves the vars unset (CSS `0px` fallback applies) — REQ-04.
- Co-located Vitest test (2 passing) covers ref-attach in jsdom and the reduced-motion guard (asserts no `--parallax-text` written; class removed in teardown so it does not leak).
- Exported from the `@system/hooks` barrel for plan 02 to consume.

## Task Commits

Each task was committed atomically:

1. **Task 1: Implement useParallax hook** - `d96495f` (feat)
2. **Task 2: Test useParallax and export from barrel** - `a127c25` (test)

_Note: This plan's TDD tasks each produced a single commit (the hook's behavior is DOM-side and asserted via the guard/ref test in Task 2; jsdom cannot simulate real scroll drift, matching the useScrollFade precedent)._

## Files Created/Modified
- `src/system/hooks/useParallax.ts` - The hook: isReduced() guard, uppercase drift constants, rAF scroll lifecycle writing the three `--parallax-*` vars, TSDoc.
- `src/system/hooks/useParallax.test.tsx` - 2 tests: ref-attach + reduced-motion guard (no vars written).
- `src/system/hooks/index.ts` - Added `export { useParallax } from './useParallax'` after `useMagneticLean`.

## Decisions Made
- Adopted `useMagneticLean`'s richer `isReduced()` (checks `force-reduced-motion` class then `matchMedia`) instead of `useScrollFade`'s simpler `prefersReducedMotion()`, so the Storybook reduced-motion toolbar actually disables parallax in stories (per PATTERNS correction 5).
- Built all px strings with template literals over numeric vars (no bare `'18px'` literals) to satisfy the `no-restricted-syntax` rule in `src/system/**`.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `useParallax` is a tested, exported contract; plan 01-02 (FeatureSpotlight block) can consume `{ ref }` and merge it with `useReveal`'s ref on a plain root element.
- The CSS module in plan 02 must declare `--parallax-*: 0px` fallbacks and consume them in `translate3d`, plus a `prefers-reduced-motion` guard, as specified in 01-PATTERNS.md.

## Self-Check: PASSED
- FOUND: src/system/hooks/useParallax.ts
- FOUND: src/system/hooks/useParallax.test.tsx
- FOUND: src/system/hooks/index.ts (barrel export present)
- FOUND commit: d96495f (feat — hook)
- FOUND commit: a127c25 (test — test + barrel)

---
*Phase: 01-live-the-life-feature-block*
*Completed: 2026-06-03*
