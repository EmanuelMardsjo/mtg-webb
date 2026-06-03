# Move to Gothenburg — Design System

## What This Is

A token-driven React + TypeScript design system and Storybook for the "Move to Gothenburg" editorial web experience. It owns the design tokens (`src/tokens/`), layout/UI primitives (`src/system/primitives/`), behavior hooks (`src/system/hooks/`), and a library of CMS-style example blocks (`src/system/examples/`) that compose into premium editorial pages.

## Core Value

Every page section is built from token-driven, accessible, premium-editorial blocks — never ad-hoc styling. If everything else fails, the example blocks must remain faithful to the brand art direction and free of raw hex/px.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Token pipeline (primitives → semantic → themes) with AA contrast verification — `src/tokens/`
- ✓ Layout/UI primitives (Section, Grid, Col, Text, Image, Stack, Inline, Surface, TextLink, Icon) — `src/system/primitives/`
- ✓ Behavior hooks (`useReveal`, `useScrollFade`, `ThemeOverride`) — `src/system/hooks/`
- ✓ Codebase mapped — `.planning/codebase/`

### Active

<!-- Current scope. Building toward these — Milestone: MTG Block Import. -->

- [ ] REQ-01: Each MTG-blocks block becomes a React example under `src/system/examples/` following the established folder anatomy (`Component.tsx`, `types.ts`, `Component.module.css`, `Component.stories.tsx`, `Component.test.tsx`, `index.ts`)
- [ ] REQ-02: Blocks use `@tokens` + `@system` primitives only — no raw hex colors or `px` literals (enforced by ESLint/Stylelint)
- [ ] REQ-03: Block content is exposed via a `{Component}Content` prop type, matching the CMS-authored content pattern
- [ ] REQ-04: Motion uses existing hooks (`useReveal`/`useScrollFade`) and respects `prefers-reduced-motion`
- [ ] REQ-05: Each adapted block is visually faithful to its marked-final design variant (Crash Course = C, Footer+CTA = a)
- [ ] REQ-06: Each block ships a Storybook story and passing Vitest tests

### Out of Scope

<!-- Explicit boundaries. -->

- Verbatim copy of the vanilla HTML/CSS/JS from `design-import/` — the source is reference only; output must be DS-native
- New design tokens or a new palette — reuse existing semantic tokens (per brand art-direction guardrails)
- The `design-canvas.jsx` scaffolding and `Move to Gothenburg.html` full-page assembly — these are exploration harnesses, not blocks
- Non-selected proposal variants (Crash Course A/B/D, CTA pills b/c) — only marked-final variants are imported

## Context

- Source blocks live in `design-import/claude-design/MTG-blocks/` as standalone HTML/CSS/JS authored in a Claude "design canvas" exploration.
- Four importable blocks identified: **Crash Course** (variant C), **Footer + CTA** (variant a), **Resident Stories**, **"Live the life" Feature**.
- The DS already contains MTG-specific examples (MTGHero, MTGNeighborhoods, MTGCompanion, ChatPanel, EditorialText, JourneyPanel, MTGTopbar, ThemedAccordion) — adapt in their idiom and reuse primitives/hooks before adding new ones.
- Brand art direction (global CLAUDE.md): premium editorial, image-led, whitespace-heavy, low-chrome, one dominant CTA per section, restrained purposeful motion.

## Constraints

- **Tech stack**: React 18.3.1 + TypeScript 5.9 + Vite 5.4 + Storybook 8.6 + Vitest 4 — match existing setup
- **Styling**: CSS Modules with `s` import alias; kebab-case classes; CSS custom properties for dynamic layout values
- **Lint**: no raw hex / `px` in `src/system/**`; ESLint flat config + Stylelint standard
- **Imports**: `@tokens`, `@system`, `@/*` aliases; external → alias → relative order

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Adapt, not copy, MTG-blocks into DS examples | Source is vanilla HTML/JS; DS requires token-driven React | — Pending |
| Use marked-final variants only (Crash C, CTA a) | Avoid re-litigating design exploration | — Pending |
| One phase per block | Each block is an independent, coherent deliverable | — Pending |

---
*Last updated: 2026-06-03 after scaffolding the MTG Block Import milestone*
