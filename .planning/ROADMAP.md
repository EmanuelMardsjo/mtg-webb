# Roadmap: Move to Gothenburg — Design System

## Milestones

- 🚧 **v1.1 MTG Block Import** — Phases 1-4 (in progress)

## Overview

Import and adapt the four MTG-blocks design explorations into the repo design system as token-driven, accessible React example blocks. Sequenced simplest-interaction → most-complex so each phase establishes patterns the next reuses: themed reveal → editorial CTA → scroll-snap rail → sticky scroll sequence.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Live-the-life Feature block** - Themed media-frame feature with scroll reveal
- [ ] **Phase 2: Footer + CTA block** - Runway lead-in + footer zone with one dominant CTA (variant a)
- [ ] **Phase 3: Crash Course block** - Horizontal scroll-snap card rail with dots/keyboard nav (variant C)
- [ ] **Phase 4: Resident Stories block** - Sticky scroll-driven story sequence with progress fill

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
- [ ] 01-02-PLAN.md — FeatureSpotlight example block (type, component, CSS module, story, test, barrel)

### Phase 2: Footer + CTA block
**Goal**: Adapt `footer-cta` (variant a) into a DS example — a "runway" editorial lead-in plus a footer zone with one dominant CTA pill over a glow/watermark backdrop.
**Depends on**: Phase 1 (reuses established import pattern)
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-05, REQ-06
**Success Criteria** (what must be TRUE):
  1. A footer/CTA block exists under `src/system/examples/` with full folder anatomy
  2. Exactly one dominant CTA per the editorial guardrails; backdrop built from tokens
  3. Visually faithful to CTA pill variant a
  4. Storybook story + passing tests
**Plans**: TBD

Plans:
- [ ] 02-01: TBD (set during plan-phase)

### Phase 3: Crash Course block
**Goal**: Adapt `crash-c` (variant C) into a DS example — a horizontal scroll-snap card rail with dot indicators and keyboard navigation.
**Depends on**: Phase 2
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-05, REQ-06
**Success Criteria** (what must be TRUE):
  1. A scroll-rail block exists under `src/system/examples/` with full folder anatomy
  2. Rail supports pointer scroll-snap, dot navigation, and keyboard control; accessible focus order
  3. Visually faithful to variant C; uses only tokens/primitives
  4. Storybook story + passing tests
**Plans**: TBD

Plans:
- [ ] 03-01: TBD (set during plan-phase)

### Phase 4: Resident Stories block
**Goal**: Adapt `mtg-story` into a DS example — a sticky scroll-driven story sequence with a progress fill indicator.
**Depends on**: Phase 3
**Requirements**: REQ-01, REQ-02, REQ-03, REQ-04, REQ-06
**Success Criteria** (what must be TRUE):
  1. A sticky-stories block exists under `src/system/examples/` with full folder anatomy
  2. Scroll-driven progression works and degrades gracefully under `prefers-reduced-motion`
  3. Uses only tokens/primitives; reuses scroll hooks where possible
  4. Storybook story + passing tests
**Plans**: TBD

Plans:
- [ ] 04-01: TBD (set during plan-phase)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Live-the-life Feature | v1.1 | 1/2 | In Progress|  |
| 2. Footer + CTA | v1.1 | 0/TBD | Not started | - |
| 3. Crash Course | v1.1 | 0/TBD | Not started | - |
| 4. Resident Stories | v1.1 | 0/TBD | Not started | - |
