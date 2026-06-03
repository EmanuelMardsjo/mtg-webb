---
phase: 03-crash-course-block
plan: 02
subsystem: design-system-examples
tags: [crash-course, scroll-snap-rail, css-modules, storybook, vitest, accessibility]
requires:
  - "src/system/examples/CrashCourseRail/CrashCourseRail.tsx + types.ts (plan 03-01 — the class-name + DOM contract)"
  - "@system/primitives, @system/hooks (consumed by the component under test)"
  - "src/stories/_fixtures/images.ts (story imagery)"
  - "src/tokens/generated/tokens.css (all CSS vars referenced)"
provides:
  - "CrashCourseRail.module.css — scroll-snap rail, card fill + token scrim, active-dot pill, round nav, header rise, full reduced-motion guard (token-only)"
  - "CrashCourseRail.stories.tsx — Default (8 cards) + FewCards (3 cards), layout fullscreen"
  - "CrashCourseRail.test.tsx — SC#2 accessibility-contract suite (9 cases)"
  - "index.ts barrel — CrashCourseRail + CrashCourseRailProps + CrashCourseRailContent"
affects:
  - "Completes the CrashCourseRail block folder anatomy (REQ-01); block is now importable + Storybook-renderable"
  - "Phase 3 is complete with this plan"
tech-stack:
  added: []
  patterns:
    - "Native CSS scroll-snap rail: overflow-x auto + scroll-snap-type x mandatory + scroll-snap-align start + hidden scrollbar (NET-NEW, no analog)"
    - "Figure-fill via .media img { object-fit: cover } overriding Image's height:auto (FeatureSpotlight precedent)"
    - "Token scrim via color-mix(in oklch, var(--color-text-default) N%, transparent) (NeighborhoodCard.coordChip precedent)"
    - "Active-dot pill: inactive square dot widens to var(--space-7) when active"
    - "Token-only nav lift translateY(calc(var(--space-1) * -0.5)) instead of raw scale (Phase 2 precedent)"
    - "Reveal pre-state scoped to .head:not(.revealed) .rise (FooterCta idiom)"
    - "MockObserver IntersectionObserver stub for the no-motion baseline (FooterCta test precedent)"
key-files:
  created:
    - src/system/examples/CrashCourseRail/CrashCourseRail.module.css
    - src/system/examples/CrashCourseRail/CrashCourseRail.stories.tsx
    - src/system/examples/CrashCourseRail/CrashCourseRail.test.tsx
    - src/system/examples/CrashCourseRail/index.ts
  modified: []
decisions:
  - "Card scrim authored with color-mix(in oklch, var(--color-text-default) 78%, transparent) gradient (token-pure) rather than --color-overlay-scrim, matching the coordChip precedent and giving precise bottom-up falloff"
  - "Card title role h3 / desc body-sm carry only color: --color-text-on-dark in CSS — sizes come from the Text role (no font-size, no font-weight; 2-weight rule D-6 held)"
  - "Test fixture uses 3 cards (one without href) — sufficient to assert the full SC#2 contract incl. the D-4 link/non-link split; literal 'Go to Fika' asserted to prove dot aria-labels"
metrics:
  duration: "~9m"
  completed: 2026-06-03
---

# Phase 3 Plan 02: CrashCourseRail CSS + stories + test + barrel Summary

Completed the CrashCourseRail block — authored the block-local token-only CSS module (native scroll-snap rail, image-fill cards with a `color-mix` bottom scrim and on-dark caption, active-dot pill, round prev/next nav with token lift, focus rings, and a full `prefers-reduced-motion` guard), two Storybook stories (Default 8 cards + FewCards 3 cards), a 9-case Vitest suite asserting the SC#2 accessibility contract, and the public `index.ts` barrel.

## What Was Built

**Task 1 — `CrashCourseRail.module.css`** (commit 4a9bc18)
- Banner comment marking it block-local token-only styling.
- Header rise: `.rise` transitions opacity+transform with `--rise-d` stagger; hidden pre-state scoped to `.head:not(.revealed) .rise`; centered measure via `ch` units (`60ch` heading `text-wrap: balance`, `54ch` lead `text-wrap: pretty`).
- Scroll-snap rail (NET-NEW): `display:flex`, `overflow-x:auto`, `scroll-snap-type: x mandatory`, `scrollbar-width:none` + `::-webkit-scrollbar { display:none }`, `scroll-padding-inline`; `:focus-visible` ring. `.cell { flex: 0 0 clamp(258px, 23vw, 310px); scroll-snap-align: start }`.
- Card: `border-radius: calc(var(--radius-lg) * 1.5)`, `overflow: clip`, `height: clamp(366px, 31vw, 420px)`; `.media img { object-fit: cover }` fill override; `.card::after` bottom-up `linear-gradient` scrim via `color-mix(in oklch, var(--color-text-default) 78%, transparent)`; `.cap` absolutely positioned at the card bottom, `--color-text-on-dark`.
- Card hover (`@media (hover: hover)` only): shadow deepen + image `scale(1.03)` + `.more` reveal.
- Active-dot pill: `.dot` square outlined → `.dotActive { width: var(--space-7); background: var(--color-text-default) }`.
- Round nav buttons: `--space-7` circles, paper glyph on dark ground, `:disabled` dim, token lift `translateY(calc(var(--space-1) * -0.5))`.
- Responsive `@media (width < 560px)` cell/card resize; full reduced-motion guard killing all transitions/transforms while keeping content visible + rail usable.

**Task 2 — stories + test + barrel** (commits 8644a36 test, 87b758e stories+barrel)
- `CrashCourseRail.test.tsx`: MockObserver stub copied verbatim; 9 cases — h2 heading, eyebrow+lead, all card titles, link-card href, non-link card (D-4 `queryByRole` null), labelled pagination nav of `Go to {title}` buttons (count === cards), first dot `aria-current="true"` only, Previous disabled / Next enabled at start, content-without-motion baseline; jsdom-limitation comment present.
- `CrashCourseRail.stories.tsx`: `title: 'Examples/CrashCourseRail'`, `layout: 'fullscreen'`, 8-card `Default` (all with demo `href`) using the SPEC copywriting contract mapped to IMAGES fixtures, `FewCards` slicing to 3.
- `index.ts`: exports `CrashCourseRail`, `CrashCourseRailProps`, `CrashCourseRailContent`.

## Deviations from Plan

**1. [Rule 1 — Test gate] Added literal `'Go to Fika'` assertion**
- **Found during:** Task 2 grep-gate verification.
- **Issue:** The acceptance criterion `grep -q "Go to" ...test.tsx` failed because the test only used the case-insensitive regex `/go to/i`, never the literal string.
- **Fix:** Added `expect(screen.getByRole('button', { name: 'Go to Fika' })).toBeInTheDocument()` to the nav test — strengthens the assertion and satisfies the gate.
- **Files modified:** src/system/examples/CrashCourseRail/CrashCourseRail.test.tsx
- **Commit:** 87b758e

## Verification

- `npx vitest run src/system/examples/CrashCourseRail/CrashCourseRail.test.tsx` — 9/9 pass.
- `npm run lint` — 0 errors (5 pre-existing react-refresh warnings in unrelated files, out of scope).
- `npm run typecheck` — 0 errors attributable to CrashCourseRail (grep confirms `NO CrashCourseRail typecheck errors`).
- All Task 1 grep gates pass: `scroll-snap-type: x mandatory`, `scroll-snap-align: start`, `scrollbar-width: none`, `::-webkit-scrollbar`, `object-fit: cover`, `color-mix(in oklch` scrim, `rgba(` count 0, hex count 0, `.dotActive` + `var(--space-7)`, token nav lift, `--color-focus-ring` x3, `prefers-reduced-motion: reduce` with `transition/transform: none !important`, `font-weight` count 0, `calc(var(--radius-lg)`. Only px literals are inside `clamp()` / a media feature query (both sanctioned).
- All Task 2 grep gates pass: `navigation`, `aria-current`, `Go to`, `getByRole('link'`, `queryByRole('link'`, `toBeDisabled`, `previous`, `MockObserver`, `jsdom`, `level: 2`; story title + fullscreen + Default + FewCards + `_fixtures/images`; barrel exports all three symbols.

## Deferred Issues

- `src/system/examples/FooterCta/FooterCta.test.tsx` has 3 failing tests in the full `npx vitest run`. These are caused by **pre-existing uncommitted working-tree changes** outside this plan (`git status`: `FooterCta.tsx` deleted, `FooterCta/types.ts` modified) and the matching typecheck errors in `FooterCta.*`. Per the scope boundary, these were left untouched. The CrashCourseRail folder is fully green and type-clean. Logged to deferred-items.

## Known Stubs

Story `href` values are demo anchors (`#fika`, etc.) and IMAGES are public Unsplash placeholders — both banner-flagged "Replace before production" (threat register T-03-03/T-03-04, accepted). Intentional example-block content, not defects.

## Self-Check: PASSED

- FOUND: src/system/examples/CrashCourseRail/CrashCourseRail.module.css
- FOUND: src/system/examples/CrashCourseRail/CrashCourseRail.stories.tsx
- FOUND: src/system/examples/CrashCourseRail/CrashCourseRail.test.tsx
- FOUND: src/system/examples/CrashCourseRail/index.ts
- FOUND commit: 4a9bc18 (feat(03-02): author CrashCourseRail.module.css scroll-snap rail)
- FOUND commit: 8644a36 (test(03-02): assert CrashCourseRail SC#2 accessibility contract)
- FOUND commit: 87b758e (feat(03-02): add CrashCourseRail stories + barrel)
