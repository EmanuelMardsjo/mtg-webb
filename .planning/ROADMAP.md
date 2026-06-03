# Roadmap: Move to Gothenburg — Design System

## Milestones

- ✅ **v1.1 MTG Block Import** — Phases 1-4 (shipped 2026-06-03)

## Overview

Import and adapt the four MTG-blocks design explorations into the repo design system as token-driven, accessible React example blocks. Sequenced simplest-interaction → most-complex so each phase establishes patterns the next reuses: themed reveal → editorial CTA → scroll-snap rail → sticky scroll sequence.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Live-the-life Feature block** - Themed media-frame feature with scroll reveal (completed 2026-06-03)
- [x] **Phase 2: Footer + CTA block** - Runway lead-in + footer zone with one dominant CTA (variant a) (completed 2026-06-03)
- [x] **Phase 3: Crash Course block** - Horizontal scroll-snap card rail with dots/keyboard nav (variant C) (completed 2026-06-03)
- [x] **Phase 4: Resident Stories block** - Sticky scroll-driven story sequence with progress fill (completed 2026-06-03)

## Phase Details

### Phase 1: Live-the-life Feature block
**Goal**: Adapt `mtg-feature` into a DS example block — a themeable feature section with a media frame that reveals on scroll.
**Depends on**: Nothing (first phase; establishes the import pattern using existing `useReveal`)
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-06
**Success Criteria** (what must be TRUE):
  1. A `Feature`-style block exists under `src/system/examples/` with the full folder anatomy
  2. The block reveals its media on scroll via `useReveal` and is static under `prefers-reduced-motion`
  3. The block uses only `@tokens` + `@system` primitives (no raw hex/px); lint passes
  4. A Storybook story renders the block and its tests pass
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — useParallax hook (rAF scroll parallax, reduced-motion guard, barrel export) + test
- [x] 01-02-PLAN.md — FeatureSpotlight example block (type, component, CSS module, story, test, barrel)

### Phase 2: Footer + CTA block
**Goal**: Adapt `footer-cta` (variant a) into a DS example — a "runway" editorial lead-in plus a footer zone with one dominant outlined CTA pill over the warmed `amber` end-state, with footer chrome (wordmark + columns + legal bar).
**Depends on**: Phase 1 (reuses established import pattern)
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-05, REQ-06
**Success Criteria** (what must be TRUE):
  1. A footer/CTA block exists under `src/system/examples/` with full folder anatomy
  2. Exactly one dominant CTA per the editorial guardrails; backdrop built from tokens
  3. Visually faithful to CTA pill variant a
  4. Storybook story + passing tests
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — FooterCtaContent type + FooterCta component (runway + amber footer zone + CTA pill + footer chrome, wired to useReveal)
- [x] 02-02-PLAN.md — CSS module (token-only pill/button/frame/footer grid/reveal) + story (amber + amber-deep) + test + barrel

### Phase 3: Crash Course block
**Goal**: Adapt `crash-c` (variant C) into a DS example — a horizontal scroll-snap card rail with dot indicators and keyboard navigation.
**Depends on**: Phase 2
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, REQ-06
**Success Criteria** (what must be TRUE):
  1. A scroll-rail block exists under `src/system/examples/` with full folder anatomy
  2. Rail supports pointer scroll-snap, dot navigation, and keyboard control; accessible focus order
  3. Visually faithful to variant C; uses only tokens/primitives
  4. Storybook story + passing tests
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md — CrashCourseRailContent type + CrashCourseRail component (header/useReveal + scroll-snap rail + card href switch + dot nav + prev/next + component-local activeIndex + keyboard)
- [x] 03-02-PLAN.md — CSS module (token-only scroll-snap rail + card fill/scrim + active-dot pill + nav + reduced-motion) + stories (8 + 3 cards) + accessibility-contract test + barrel

### Phase 4: Resident Stories block
**Goal**: Adapt `mtg-story` into a DS example — a sticky scroll-driven story sequence with a progress fill indicator.
**Depends on**: Phase 3
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-06
**Success Criteria** (what must be TRUE):
  1. A sticky-stories block exists under `src/system/examples/` with full folder anatomy
  2. Scroll-driven progression works and degrades gracefully under `prefers-reduced-motion`
  3. Uses only tokens/primitives; reuses scroll hooks where possible
  4. Storybook story + passing tests
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md — ResidentStoriesContent/ResidentStory types + ResidentStories component (Section pink-soft → sticky stage + cross-faded story panels + decorative progress var + aria-hidden track of useScrollSections-registered anchors, no snap, no manual scroll math)
- [x] 04-02-PLAN.md — CSS module (mirror MTGNeighborhoods sticky stage + track + absolute cross-fade + scaleY progress fill + .rise stagger + <768px static stack + prefers-reduced-motion graceful degradation) + story (3 residents + different count) + accessibility-contract test + barrel

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Live-the-life Feature | v1.1 | 2/2 | Complete   | 2026-06-03 |
| 2. Footer + CTA | v1.1 | 2/2 | Complete   | 2026-06-03 |
| 3. Crash Course | v1.1 | 2/2 | Complete   | 2026-06-03 |
| 4. Resident Stories | v1.1 | 2/2 | Complete   | 2026-06-03 |
