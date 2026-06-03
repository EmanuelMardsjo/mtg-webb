---
phase: 03-crash-course-block
plan: 01
subsystem: design-system-examples
tags: [crash-course, scroll-snap-rail, accessibility, react, css-modules-pending]
requires:
  - "@system/primitives (Section, Container, Stack, Text, Image, Icon)"
  - "@system/hooks (useReveal)"
  - "@tokens/themes (ThemeName)"
provides:
  - "CrashCourseRailContent + CrashCourseRailCard content types (CMS-shaped)"
  - "CrashCourseRail component: header + scroll-snap rail + dot nav + prev/next + component-local activeIndex + keyboard nav"
  - "CrashCourseRailProps export"
affects:
  - "Plan 03-02 (CSS module, stories, test, barrel) consumes the class-name contract referenced here"
tech-stack:
  added: []
  patterns:
    - "revealRef on a native wrapper div (Stack has no ref, Section does not forward refs) — FeatureSpotlight idiom"
    - "passive rAF-throttled scroll listener reading scrollLeft → component-local activeIndex (NeighborhoodPaginator shape, D-5: no new hook)"
    - "card element switch a/article on optional href (D-4)"
    - "labelled <nav> + aria-current dot buttons, NOT role=tablist (D-2)"
    - "prefers-reduced-motion guard inline (useReveal shape) for scrollTo behavior"
key-files:
  created:
    - src/system/examples/CrashCourseRail/types.ts
    - src/system/examples/CrashCourseRail/CrashCourseRail.tsx
  modified: []
decisions:
  - "D-2: dot nav is a labelled <nav> with aria-current buttons, not role=tablist (honest scroll-region semantics)"
  - "D-4: card.href optional — href → <a>, absent → non-interactive <article> (no dead click); drawer out of scope"
  - "D-5: active-index tracking is component-local (railRef + passive rAF-throttled scroll listener), no useScrollSnapRail hook"
  - "D-6: card title role=h3 as=span; exactly 2 weights (400/800), source font-weight:600 dropped"
  - "Reduced motion: scrollToIndex uses behavior 'auto' under prefers-reduced-motion (REQ-04/SC#2)"
metrics:
  duration: "~7m"
  completed: 2026-06-03
---

# Phase 3 Plan 01: CrashCourseRail type + component Summary

CrashCourseRail (variant C, "tram window") delivered as a CMS-shaped content type plus a fully interactive React component — editorial header (useReveal), horizontal scroll-snap rail with a/article-per-href cards, labelled aria-current dot nav, disable-at-ends prev/next, component-local scrollLeft-driven activeIndex, and Arrow/Home/End keyboard nav — all referencing the plan-03-02 CSS module by class-name string.

## What Was Built

**Task 1 — `types.ts`** (commit a2a4c43)
Two exported types matching the FooterCta file style (single quotes, no trailing semicolons, 2-space indent):
- `CrashCourseRailCard = { title; description; image: { src; alt }; href? }` — `href` optional per D-4; `{ src; alt }` media shape verbatim so `Image` alt stays required.
- `CrashCourseRailContent = { eyebrow?; heading; lead?; cards; theme? }` — `ThemeName` via type-only import from `@tokens/themes`.

**Task 2 — `CrashCourseRail.tsx`** (commit dbc1506, 214 lines)
- Banner comment verbatim; imports in external→alias→relative order; exports `CrashCourseRail` + `CrashCourseRailProps`.
- Header: `useReveal()` once; `revealRef` + `.revealed` gate on a NATIVE wrapper `<div>` (Stack has no ref, Section forwards none — FeatureSpotlight idiom). `--rise-d` stagger on plain `<div className={s.rise}>` wrappers (eyebrow 0ms / heading 90ms / lead 180ms), never on `Text`. Heading is the document `<h2>` via `role="display" as="h2"`.
- Active-index (D-5, no hook): `railRef` (HTMLUListElement) + `rafRef`; `useEffect([cardCount])` attaches a `{ passive: true }` scroll listener; `tick()` derives the per-cell `step` from `firstChild`/`secondChild` `offsetLeft` (no hardcoded px) and sets a clamped `activeIndex` from `scrollLeft / step`; cleanup removes the listener and cancels the rAF.
- `scrollToIndex` (`useCallback`, deps `[content.cards.length]`): clamps `i`, reads `rail.children[clamped]`, calls `scrollTo({ left: cell.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })` where `reduce` checks `prefers-reduced-motion: reduce` inline.
- Keyboard: `onRailKeyDown` handles ArrowRight/ArrowLeft (±1) and Home/End, `preventDefault` only on handled keys.
- Rail markup: `<ul ref tabIndex={0} aria-label>` of `<li>` cells; `const Tag = card.href ? 'a' : 'article'`; figure+Image (radius="none", lazy, focalPoint center); caption with `role="h3" as="span"` title, `role="body-sm"` desc, and a "Read more" + `Icon arrow-right` only when href.
- Controls: dot `<nav aria-label="Crash course pagination">` with `aria-current`/`aria-label="Go to {title}"` buttons; round prev/next buttons with `aria-label`, `disabled` at ends, and bespoke inline chevron SVGs (`aria-hidden focusable="false"`).
- Composition: `Section theme={content.theme ?? 'yellow'} spacing="lg" aria-label={content.heading}` → `Container size="default"`; header always renders, rail + controls only when `cards.length > 0` (empty-state = header alone).
- No raw hex/px in the .tsx; no `font-weight` inline.

## Deviations from Plan

None — plan executed exactly as written. No bugs, missing functionality, or blocking issues encountered; no architectural decisions required.

## Verification

- `npm run typecheck` — passes (vite/client ambient `*.module.css` declaration covers the yet-to-be-written CSS module import).
- `npm run lint` — 0 errors (5 pre-existing react-refresh warnings in unrelated files, out of scope).
- Grep gates all pass: banner present; `role="tablist"` count 0; `aria-current=` present; `scrollLeft` + `addEventListener('scroll'` + `{ passive: true }` present; no new file under `src/system/hooks/`; `scrollToIndex` + `prefers-reduced-motion: reduce` + `behavior:` present; `onKeyDown` + `ArrowRight` + `case 'Home':` present; `card.href ? 'a' : 'article'` present; `aria-label="Previous"`/`"Next"` + `disabled={activeIndex === 0}` + `disabled={activeIndex === content.cards.length - 1}` present; `role="display" as="h2"` + `role="h3" as="span"` present; `font-weight` count 0; `useReveal()` present; `aria-labelledby` count 0.

## Known Stubs

The component imports `./CrashCourseRail.module.css` (class names referenced by string) which is authored in **plan 03-02**, along with the stories, test, and `index.ts` barrel. This is the intended plan split (PLAN line 45) — the markup is complete and type-checks now; styling and the importable barrel land next. Not a defect.

## Self-Check: PASSED

- FOUND: src/system/examples/CrashCourseRail/types.ts
- FOUND: src/system/examples/CrashCourseRail/CrashCourseRail.tsx
- FOUND commit: a2a4c43 (feat(03-01): define CrashCourseRailContent type)
- FOUND commit: dbc1506 (feat(03-01): author CrashCourseRail component)
