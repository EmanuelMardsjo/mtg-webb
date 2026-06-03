---
phase: 02-footer-cta-block
verified: 2026-06-03T14:20:00Z
status: human_needed
score: 4/4 must-haves verified
overrides_applied: 0
human_verification:
  - test: "Open Storybook → Examples/FooterCta → Default (and AmberDeep) at desktop and mobile widths"
    expected: "Neutral cream runway lead-in (eyebrow + oversized h1 + lead + 16/7 media frame) flows into a warm amber footer zone holding ONE outlined transparent CTA pill (eyebrow → big title → lead → one filled dark pill button with arrow). Below: quiet wordmark, asymmetric footer columns (lead column wider), and a hairline legal bar with right-aligned coordinates. AmberDeep deepens the footer warmth. Overall reads premium-editorial and visually faithful to source variant a — not app-like."
    why_human: "Visual fidelity to the marked-final design variant (SC #3 / REQ-05) and editorial premium quality are perceptual judgments that grep/tests cannot make. Code structure matches the UI-SPEC composition exactly, but pixel/mood faithfulness requires a human comparing against design-import/.../footer-cta."
---

# Phase 2: Footer + CTA block Verification Report

**Phase Goal:** Adapt `footer-cta` (variant a) into a DS example — a "runway" editorial lead-in plus a footer zone with one dominant outlined CTA pill over the warmed `amber` end-state, with footer chrome (wordmark + columns + legal bar).
**Verified:** 2026-06-03T14:20:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth (Success Criterion) | Status | Evidence |
|---|---------------------------|--------|----------|
| 1 | A footer/CTA block exists under `src/system/examples/` with full folder anatomy | ✓ VERIFIED | `src/system/examples/FooterCta/` contains all 6 anatomy files: `FooterCta.tsx`, `types.ts`, `FooterCta.module.css`, `FooterCta.stories.tsx`, `FooterCta.test.tsx`, `index.ts`. All substantive (component 113 lines, CSS 178 lines, test 98 lines). |
| 2 | Exactly one dominant CTA per editorial guardrails; backdrop built from tokens | ✓ VERIFIED | `s.ctaButton` applied to exactly one `<a>` (FooterCta.tsx:59-66); the other `<a>` (line 70) is the `.footWordmark`, not a CTA button. Backdrop is the amber `Section` theme; pill is a transparent outlined `<div>`. Every CSS value is a token — all 20 referenced custom props (`--radius-lg`, `--border-strong`, `--color-text-default`, `--space-*`, `--motion-*`, etc.) are defined in `src/tokens/generated/tokens.css`. No raw hex, no raw px in property values. |
| 3 | Visually faithful to CTA pill variant a | ✓ VERIFIED (structure) / ? human (appearance) | Code mirrors UI-SPEC composition lines 105-156 exactly: neutral runway (eyebrow/hero-h1/lead + 16/7 figure) → amber footer zone → one outlined pill (eyebrow→display-h2→lead→filled button+arrow) → wordmark → asymmetric `1.6fr 1fr 1fr 1fr` columns → hairline legal bar with tabular-nums coords. Pixel/mood fidelity routed to human (see below). |
| 4 | Storybook story + passing tests | ✓ VERIFIED | `FooterCta.stories.tsx` exports `Default` (amber) + `AmberDeep` (`footerTheme: 'amber-deep'`), `layout: 'fullscreen'`. `npx vitest run src/system/examples/FooterCta` → 8/8 tests pass. |

**Score:** 4/4 truths verified (SC #3 structurally verified; visual appearance routed to human verification)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `FooterCta/types.ts` | `FooterCtaContent` CMS shape | ✓ VERIFIED | Exact UI-SPEC shape: runway{eyebrow,headline,lead,media?}, cta{eyebrow,title,lead,action{label,href}}, footer{columns[],legal,coords?}, optional runwayTheme/footerTheme. `ThemeName` imported from `@tokens/themes`. |
| `FooterCta/FooterCta.tsx` | Runway + amber footer + one CTA, useReveal-wired | ✓ VERIFIED | EXAMPLE banner present. Two static themed Sections (neutral default, amber default). `useReveal()` ref on `.ctaPill`; staggered rise 0/90/180/270ms on plain wrappers. No `useParallax`, no `aria-labelledby` (uses `aria-label`). |
| `FooterCta/FooterCta.module.css` | Token-only block-local styling | ✓ VERIFIED | No raw hex/px in property values. `1.6fr 1fr 1fr 1fr` grid present; reveal scoped to `.ctaPill:not(.revealed) .rise`; large radii via `calc(var(--radius-lg) * N)`; reduced-motion guard on `.rise`+`.ctaButton`. |
| `FooterCta/FooterCta.stories.tsx` | Default + AmberDeep stories | ✓ VERIFIED | Both stories present, fullscreen, `IMAGES.mtgHeroCouch` runway media. |
| `FooterCta/FooterCta.test.tsx` | Vitest suite w/ IO mock | ✓ VERIFIED | MockObserver IO stub; 8 assertions; 8/8 pass. |
| `FooterCta/index.ts` | Barrel: FooterCta + FooterCtaProps + FooterCtaContent | ✓ VERIFIED | `export { FooterCta, type FooterCtaProps }` + `export type { FooterCtaContent }`. All three exported. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| FooterCta.tsx | useReveal | `const { ref, revealed } = useReveal()`, ref on `.ctaPill` | WIRED | revealed toggles `s.revealed`, which drives `.ctaPill:not(.revealed) .rise` pre-state. |
| FooterCta.tsx | @system/primitives | Section/Container/Stack/Text/TextLink/Image/Icon imported + used | WIRED | All imports consumed in JSX. |
| FooterCta.tsx | content prop | runway/cta/footer all rendered | WIRED | Data-flow: all `content.*` fields flow to rendered output (eyebrow, headline, lead, cta title/lead/action, columns map, legal, coords). No hardcoded/empty data. |
| FooterCta.module.css | @tokens/generated/tokens.css | `var(--*)` references | WIRED | All 20 referenced tokens defined in generated tokens.css; color tokens defined per-theme (13×) covering neutral/amber/amber-deep. |
| index.ts | @system/examples/FooterCta alias | folder barrel | WIRED | Alias `@system` → `src/system` (vite + tsconfig); `@system/examples/FooterCta` resolves to `index.ts`. Consumable. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| FooterCta.tsx | `content` (prop) | Caller / story fixture | Yes — story passes full content; tests assert rendered text | ✓ FLOWING |
| FooterCta.module.css | CSS custom properties | tokens.css (generated, theme-scoped) | Yes — all tokens defined per theme | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript compiles | `npm run typecheck` | exit 0, no errors | ✓ PASS |
| Lint clean (REQ-02 hex/px gate) | `npm run lint` | 0 errors (5 pre-existing react-refresh warnings in unrelated files) | ✓ PASS |
| Tests pass | `npx vitest run src/system/examples/FooterCta` | 8 passed (8) | ✓ PASS |
| One filled CTA button | grep `s.ctaButton` usage | 1 application (line 61) | ✓ PASS |
| Footer grid present | grep `1.6fr 1fr 1fr 1fr` | found (line 120) | ✓ PASS |
| Reveal scoped to pill | grep `.ctaPill:not(.revealed)` | found (line 42) | ✓ PASS |
| Barrel exports all three | cat index.ts | FooterCta + FooterCtaProps + FooterCtaContent | ✓ PASS |
| No useParallax / no aria-labelledby | grep | 0 / 0 | ✓ PASS |
| No raw hex / px in property values | grep | hex 0; px only in `@media (width < Npx)` feature queries, not property values | ✓ PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| REQ-01 | 02-01, 02-02 | Example under `src/system/examples/` with full folder anatomy | ✓ SATISFIED | All 6 anatomy files present and substantive. |
| REQ-02 | 02-02 | Tokens + primitives only, no raw hex/px (lint-enforced) | ✓ SATISFIED | Lint passes; grep finds no hex/px in property values; every token resolves in tokens.css. |
| REQ-03 | 02-01 | `{Component}Content` prop type matching CMS pattern | ✓ SATISFIED | `FooterCtaContent` exported, exact UI-SPEC shape, consumed via `{ content }` prop. |
| REQ-05 | 02-01, 02-02 | Visually faithful to marked-final variant a | ✓ STRUCTURE / ? appearance | Structure matches UI-SPEC variant-a composition exactly; perceptual fidelity routed to human. |
| REQ-06 | 02-02 | Storybook story + passing Vitest tests | ✓ SATISFIED | 2 stories + 8/8 passing tests. |

REQ-04 is NOT in Phase 2's requirement set per ROADMAP (it belongs to Phases 1/3/4). Note: this block still respects `prefers-reduced-motion` via `useReveal` (revealed-at-mount under reduce) + a CSS reduced-motion guard — exceeds the phase's stated requirements.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | None | — | No TBD/FIXME/XXX/TODO/HACK/PLACEHOLDER; no stub returns; no empty handlers. EXAMPLE banner is the intended foundations-demo marker (CONVENTIONS.md), not debt. |

### Human Verification Required

#### 1. Visual fidelity to variant a (SC #3 / REQ-05)

**Test:** Open Storybook → `Examples/FooterCta` → `Default` and `AmberDeep`, at desktop and mobile widths.
**Expected:** Neutral cream runway lead-in (eyebrow + oversized h1 + lead + 16/7 media frame) flowing into a warm amber footer zone with ONE outlined transparent CTA pill (eyebrow → big title → lead → one filled dark pill button with arrow). Below: quiet wordmark, asymmetric footer columns (lead column wider, collapsing responsively), hairline legal bar with right-aligned tabular coordinates. `AmberDeep` deepens footer warmth. Reads premium-editorial and faithful to source variant a — not app-like.
**Why human:** Pixel and mood fidelity to the marked-final design exploration is a perceptual judgment. Code structure provably matches the UI-SPEC composition; visual faithfulness cannot be confirmed by grep/tests.

### Gaps Summary

No gaps. All four ROADMAP success criteria and all five mapped requirements (REQ-01/02/03/05/06) are satisfied in the codebase. The block exists with full folder anatomy, is genuinely token-driven (every referenced token resolves per-theme), exposes exactly one dominant CTA, ships two Storybook stories, and passes 8/8 tests with clean typecheck and lint. Data flows end-to-end with no stubs or hollow references.

The only item not closable by automation is the perceptual visual-fidelity check for variant a (SC #3 / REQ-05). Code structure matches the UI-SPEC exactly, so this is a confirmation-grade human check, not a suspected gap — hence `human_needed` rather than `passed`.

---

_Verified: 2026-06-03T14:20:00Z_
_Verifier: Claude (gsd-verifier)_
