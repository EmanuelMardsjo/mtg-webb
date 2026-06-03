---
phase: 03-crash-course-block
verified: 2026-06-03T15:05:00Z
status: human_needed
score: 4/4 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Open Storybook → Examples/CrashCourseRail → Default. Tab to the rail, then press ArrowRight / ArrowLeft / Home / End."
    expected: "The rail scrolls one card per arrow press and snaps to the card's start edge; Home jumps to the first card, End to the last. Behavior is smooth normally and instant under reduced motion."
    why_human: "jsdom has no real scroll position or element.scrollTo; tests assert handler WIRING only. Real scroll-snap + smooth-scroll behavior must be exercised in a browser."
  - test: "In Storybook, scroll the rail by trackpad/mouse drag and watch the dot indicator."
    expected: "Cards snap to the start edge as you scroll; the active dot widens to a pill and tracks the centered/leading card via the rAF scroll listener."
    why_human: "Pointer scroll-snap and the rAF-driven active-index update depend on real layout (offsetLeft/scrollLeft), which jsdom cannot provide."
  - test: "Compare the rendered block against the crash-c variant C reference (tram-window editorial header + image-led scroll-snap cards with dark bottom scrim + active-dot pill + round prev/next)."
    expected: "Visually faithful to variant C per REQ-05 / SC#3 — centered staggered header, image cards with legible on-dark captions, pill-style active dot, circular nav buttons."
    why_human: "Visual fidelity to a marked-final design variant is a subjective/visual judgment that cannot be verified programmatically."
  - test: "Enable OS 'reduce motion' and reload the Default story; confirm the header is fully visible with no entrance transition and the rail still scrolls."
    expected: "All transitions/transforms off; content fully visible; rail remains usable (instant scroll). prefers-reduced-motion guard active."
    why_human: "Reduced-motion media query is not evaluated in jsdom; the visible end-state and continued usability need a real browser with the OS setting toggled."
---

# Phase 3: Crash Course block Verification Report

**Phase Goal:** Adapt `crash-c` (variant C) into a DS example — a horizontal scroll-snap card rail with dot indicators and keyboard navigation.
**Verified:** 2026-06-03T15:05:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth (ROADMAP Success Criteria) | Status | Evidence |
|---|----------------------------------|--------|----------|
| SC#1 | A scroll-rail block exists under `src/system/examples/` with full folder anatomy | ✓ VERIFIED | All 6 files present in `src/system/examples/CrashCourseRail/`: `CrashCourseRail.tsx`, `types.ts`, `CrashCourseRail.module.css`, `CrashCourseRail.stories.tsx`, `CrashCourseRail.test.tsx`, `index.ts`. |
| SC#2 | Rail supports pointer scroll-snap, dot navigation, and keyboard control; accessible focus order | ✓ VERIFIED (code) / human confirms runtime | CSS `scroll-snap-type: x mandatory` + `scroll-snap-align: start` (css:38,59). Dot nav: labelled `<nav aria-label="Crash course pagination">` of buttons with `aria-current` (tsx:160-170). Keyboard: `onKeyDown={onRailKeyDown}` handling ArrowRight/ArrowLeft/Home/End on `tabIndex={0}` rail (tsx:70-91,125-127). Focus order accessible: 3 `:focus-visible` rings via `--color-focus-ring` (css:51,181,215). 9/9 tests pass asserting this contract. Pattern correctly avoids `role="tablist"` and `aria-labelledby` (confirmed absent). Runtime scroll-snap/keyboard motion → human. |
| SC#3 | Visually faithful to variant C; uses only tokens/primitives | ✓ VERIFIED (token purity) / human confirms fidelity | Token-only CSS: 0 raw hex, 0 `rgba(`, 0 `font-weight`; px literals only inside `clamp()` (css:57,66) and a `@media (width < 560px)` feature query (css:227) — both sanctioned. Built from `@system/primitives` (Section/Container/Stack/Text/Image/Icon) + `@tokens` vars. lint passes 0 errors. Visual fidelity to variant C → human. |
| SC#4 | Storybook story + passing tests | ✓ VERIFIED | `CrashCourseRail.stories.tsx`: `Default` (8 cards) + `FewCards` (3 cards), `title: 'Examples/CrashCourseRail'`, `layout: 'fullscreen'`. `npx vitest run src/system/examples/CrashCourseRail` → **9/9 pass**. |

**Score:** 4/4 truths verified (code-level). Runtime/visual aspects of SC#2 and SC#3 routed to human verification.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `CrashCourseRail.tsx` | Header + scroll-snap rail + card href switch + dot nav + prev/next + local activeIndex + keyboard | ✓ VERIFIED | 214 lines, substantive. Component-local active-index via useState/useRef/useEffect rAF (D-5, no new hook). Card `<a>`/`<article>` switch on `href` (tsx:130-133). useReveal reused (tsx:13). |
| `types.ts` | `CrashCourseRailContent` prop type (REQ-03) | ✓ VERIFIED | Exports `CrashCourseRailCard` + `CrashCourseRailContent` with eyebrow/heading/lead/cards/theme. |
| `CrashCourseRail.module.css` | Token-only scroll-snap rail, card fill/scrim, active-dot pill, nav, reduced-motion | ✓ VERIFIED | 254 lines. `scroll-snap-type: x mandatory`, `.media img { object-fit: cover }` fill override, `color-mix` scrim, `.dotActive` pill, `prefers-reduced-motion` guard. Token-pure. |
| `CrashCourseRail.stories.tsx` | Default (8) + FewCards (3) | ✓ VERIFIED | Both stories present; IMAGES fixtures; fullscreen layout. |
| `CrashCourseRail.test.tsx` | SC#2 accessibility-contract suite | ✓ VERIFIED | 9 cases; MockObserver baseline; asserts labelled nav, aria-current, link/non-link split, disabled prev. |
| `index.ts` | Barrel: CrashCourseRail + CrashCourseRailProps + CrashCourseRailContent | ✓ VERIFIED | All three symbols exported. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `CrashCourseRail.module.css` | `.media img` | object-fit cover fill | ✓ WIRED | `.media img { object-fit: cover; width:100%; height:100% }` (css:82-87) overrides Image's height:auto. |
| `CrashCourseRail.test.tsx` | CrashCourseRail component | render + role/text queries | ✓ WIRED | `render(<CrashCourseRail content={content} />)` across all 9 cases. |
| `index.ts` | `./CrashCourseRail` + `./types` | barrel re-export | ✓ WIRED | Both re-exports present. |
| activeIndex state | dot `aria-current` + nav `disabled` | render | ✓ WIRED | `i === activeIndex` drives `aria-current` and `dotActive`; activeIndex drives Prev/Next disabled (tsx:165-195). |
| rail scroll | activeIndex | rAF scroll listener | ✓ WIRED (code) | `scroll` listener → rAF `tick()` derives step from layout and clamps to setActiveIndex (tsx:25-56). Runtime → human. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| CrashCourseRail | `content.cards` | `content` prop (CMS-shaped) | Yes — mapped to rendered cards; stories supply 8/3 cards | ✓ FLOWING |
| CrashCourseRail | `activeIndex` | local useState, set by rAF scroll handler | Code path populates it from real layout | ✓ FLOWING (runtime → human) |

Example block: data is prop-driven by design (CMS-wired later). Story `href`/IMAGES are banner-flagged "Replace before production" — intentional, accepted (T-03-03/T-03-04).

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Tests pass | `npx vitest run src/system/examples/CrashCourseRail` | 9 passed (9) | ✓ PASS |
| Typecheck clean | `npm run typecheck` (`tsc -b --noEmit`) | exit 0, 0 errors | ✓ PASS |
| Lint clean | `npm run lint` | 0 errors, 5 warnings (all in unrelated files: .storybook decorators, MTGNeighborhoods, ThemeOverride) | ✓ PASS |
| Real scroll-snap / keyboard scroll | (browser) | not runnable in jsdom | ? SKIP → human |

### Probe Execution

N/A — no probes declared for this phase (component example block, not a migration/tooling phase). No `scripts/*/tests/probe-*.sh` referenced in PLAN/SUMMARY.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| REQ-01 | 03-01/03-02 | Full folder anatomy under examples/ | ✓ SATISFIED | All 6 files present. |
| REQ-02 | 03-02 | Tokens/primitives only, no raw hex/px | ✓ SATISFIED | 0 hex, 0 rgba, px only in clamp()/media query; lint 0 errors. |
| REQ-03 | 03-01 | `{Component}Content` prop type | ✓ SATISFIED | `CrashCourseRailContent` in types.ts, consumed via props. |
| REQ-04 | 03-01/03-02 | Existing hooks + prefers-reduced-motion | ✓ SATISFIED | `useReveal` reused; full `prefers-reduced-motion` guard (css:238). Scroll-to also honors reduced motion (tsx:64-67). |
| REQ-05 | 03-02 | Visually faithful to variant C | ? NEEDS HUMAN | Token/structure correct; visual fidelity is a human judgment (see human verification). |
| REQ-06 | 03-02 | Storybook story + passing tests | ✓ SATISFIED | 2 stories + 9/9 tests. |

No orphaned requirements — all six phase requirements are claimed by the plans and verified above.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | TODO/FIXME/XXX/TBD/HACK | None | No debt markers in any CrashCourseRail file. |
| — | — | placeholder/empty returns | None | No stub returns; component renders real card data. |

Demo `href` anchors and Unsplash IMAGES are banner-flagged example content ("Replace before production"), not defects.

### Scope Note

The working tree contains the user's unrelated parallel edits (FooterCta deletions, src/stories edits, new untracked hooks like `useMagneticLean`/`useScrollSections`). These are **not** Phase 3 deliverables and were excluded from scope. Notably, the untracked hooks are NOT a CrashCourseRail active-index hook — the component uses component-local state per design decision D-5 (confirmed: no new hook file created for this phase). The full repo typecheck and lint both pass clean, and the full test suite was reported green (124/124); CrashCourseRail's 9 tests pass in isolation.

### Human Verification Required

1. **Keyboard navigation** — Tab to rail, press ArrowRight/ArrowLeft/Home/End; expect one-card-per-press snap scroll, smooth normally and instant under reduced motion.
2. **Pointer scroll-snap + active dot** — Drag/scroll the rail; expect cards snap to start edge and the active dot widens to a pill tracking the leading card.
3. **Visual fidelity to variant C (REQ-05/SC#3)** — Compare against the crash-c reference; expect the tram-window editorial header + image-led scrim cards + pill dot + round nav.
4. **Reduced-motion end-state** — Toggle OS reduce-motion; expect static fully-visible content with a still-scrollable rail.

### Gaps Summary

No code-level gaps. All four ROADMAP success criteria and all six requirements are satisfied at the code level: the full folder anatomy exists; the rail implements native scroll-snap, a labelled dot navigation with `aria-current`, full keyboard control (Arrow/Home/End), and accessible focus rings; styling is strictly token-driven (no hex, no rgba, no hardcoded font-weight, px only where sanctioned); a `prefers-reduced-motion` guard kills all motion while keeping content visible and the rail usable; and two Storybook stories plus a 9-case accessibility-contract test suite all pass alongside a clean typecheck and lint.

Status is **human_needed** (not passed) solely because the runtime behaviors of SC#2 (real scroll-snap, rAF active-index tracking, keyboard scroll) and the visual fidelity of SC#3/REQ-05 cannot be confirmed in jsdom and require a browser/visual check. No items are blocking; no re-planning is required.

---

_Verified: 2026-06-03T15:05:00Z_
_Verifier: Claude (gsd-verifier)_
