---
phase: 02-footer-cta-block
plan: 01
subsystem: design-system-examples
tags: [footer, cta, example-block, reveal, themed-section]
requires:
  - "@system/primitives (Section, Container, Stack, Text, TextLink, Image, Icon)"
  - "@system/hooks (useReveal)"
  - "@tokens/themes (ThemeName)"
provides:
  - "FooterCtaContent CMS content type"
  - "FooterCta example block component (runway + amber footer zone)"
affects:
  - "Plan 02-02 (styles, story, test for FooterCta)"
tech-stack:
  added: []
  patterns:
    - "Two stacked static themed Sections (neutral runway, amber footer zone)"
    - "useReveal ref attached directly to the .ctaPill wrapper (no parallax merge)"
    - "Per-child --rise-d stagger on plain wrapper divs (Text accepts no style)"
    - "Block-local CSS Grid for asymmetric footer columns (not Grid/Col primitives)"
key-files:
  created:
    - "src/system/examples/FooterCta/types.ts"
    - "src/system/examples/FooterCta/FooterCta.tsx"
  modified: []
decisions:
  - "Mirror FeatureSpotlight file-for-file, applying the 9 PATTERNS corrections"
  - "aria-label on footer-zone Section (Text exposes no id, so no aria-labelledby)"
  - "One dominant filled CTA authored as raw <a> (D-2), not TextLink"
  - "runway.media and footer.coords optional, guarded with conditional rendering (D-4)"
metrics:
  duration: ~10m
  completed: 2026-06-03
---

# Phase 2 Plan 01: FooterCta type + component Summary

FooterCtaContent CMS type plus a FooterCta example block that composes a neutral
runway lead-in Section above an amber footer-zone Section, with exactly one dominant
filled CTA pill (useReveal-wired, staggered) and quiet footer chrome.

## What Was Built

- **`types.ts`** — `FooterCtaContent` with nested `runway` (eyebrow/headline/lead +
  optional `media`), `cta` (eyebrow/title/lead/action), `footer` (columns/legal +
  optional `coords`), plus optional `runwayTheme`/`footerTheme: ThemeName`. `ThemeName`
  imported from `@tokens/themes` (no inline string union).
- **`FooterCta.tsx`** — Example block mirroring `FeatureSpotlight.tsx`. Two static
  themed `Section`s (runway `neutral`, footer-zone `amber`). The CTA-pill subtree is
  reveal-staggered (eyebrow 0ms → title 90ms → lead 180ms → button 270ms) with
  `useReveal()`; `revealRef` attaches directly to the `.ctaPill` div. Footer chrome:
  decorative `aria-hidden` wordmark inside an `aria-label`-ed `<a>`, a block-local
  column grid mapping `footer.columns` (links via `TextLink`, plain items via `Text`),
  and a legal bar with optional coordinates.

All `s.*` class names reference the CSS module that Plan 02 will author; the `.tsx`
compiles and lints today because the CSS Modules import is typed loosely.

## Corrections Applied (from 02-PATTERNS.md / 02-UI-SPEC.md)

1. `aria-label` on the footer-zone Section (not `aria-labelledby`) — `Text` has no `id`.
2. No `aspect=`/arbitrary `radius` on `Image`; the 16/7 frame lives on `.runwayMedia` (Plan 02 CSS).
3. (n/a in this file — reveal scope) reveal class on `.ctaPill`, not `.root`.
4. Footer columns are a block-local div grid; `Grid`/`Col` are NOT imported (they cannot express `1.6fr 1fr 1fr 1fr`).
5. No `useParallax` import; `revealRef` attaches directly to `.ctaPill` (no merged-ref callback).
6. Two static themed Sections — no scroll color engine, no `document`/`html` mutation.
7. `--rise-d` stagger rides plain wrapper `<div>`s, not `Text`.
8. Exactly one dominant filled CTA; no C-only glow/watermark element.
9. `runway.media` and `footer.coords` optional and guarded with conditional rendering.

## Verification

- `npm run typecheck` — passes.
- `npx eslint src/system/examples/FooterCta/FooterCta.tsx` — passes (exit 0).
- Grep gates: `useReveal` present (2); `useParallax` 0; `aria-labelledby` 0; `aria-label=` present (2); no `Grid`/`Col` import; `aspect=` (non-comment) 0; `s.ctaButton` exactly 1; banner `EXAMPLE` present.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None. The component renders all supplied content; `s.*` class names resolving against
the not-yet-authored CSS module is the intended cross-plan seam (Plan 02 ships the CSS,
story, and test), not a content stub.

## Self-Check: PASSED

- FOUND: src/system/examples/FooterCta/types.ts
- FOUND: src/system/examples/FooterCta/FooterCta.tsx
- FOUND commit: 6557be6 (Task 1 — type)
- FOUND commit: 51265af (Task 2 — component)
