---
phase: 02-footer-cta-block
plan: 02
subsystem: design-system-examples
tags: [footer, cta, css-module, storybook, vitest, reveal, token-only]
requires:
  - "src/system/examples/FooterCta/FooterCta.tsx (02-01)"
  - "src/system/examples/FooterCta/types.ts (02-01)"
  - "@tokens/generated/tokens.css (--space-*/--radius-*/--color-*/--motion-*/--border-*)"
  - "src/stories/_fixtures/images.ts (IMAGES.mtgHeroCouch)"
provides:
  - "FooterCta.module.css — token-only block-local styling"
  - "FooterCta.stories.tsx — Default (amber) + AmberDeep stories"
  - "FooterCta.test.tsx — Vitest suite with IntersectionObserver mock"
  - "FooterCta/index.ts — public barrel (FooterCta, FooterCtaProps, FooterCtaContent)"
affects:
  - "Completes the FooterCta block (Phase 2 done)"
tech-stack:
  added: []
  patterns:
    - "Reveal pre-state scoped to .ctaPill:not(.revealed) .rise (not .root)"
    - "Block-local CSS Grid 1.6fr 1fr 1fr 1fr for asymmetric footer columns"
    - "Large radii via calc(var(--radius-lg) * N) (no raw px)"
    - "Outlined transparent pill over amber Section; filled CTA via text/surface inversion"
    - "MockObserver IntersectionObserver stub verbatim from FeatureSpotlight"
key-files:
  created:
    - "src/system/examples/FooterCta/FooterCta.module.css"
    - "src/system/examples/FooterCta/FooterCta.stories.tsx"
    - "src/system/examples/FooterCta/FooterCta.test.tsx"
    - "src/system/examples/FooterCta/index.ts"
  modified: []
decisions:
  - "footBar top border uses --border-hairline + --color-border-strong (--border-subtle is not a token)"
  - "Hover lift via translateY(calc(var(--space-1) * -0.5)) to keep token-only (no raw -2px)"
  - "CTA lead measure (~46ch) constrained via .ctaPill > .rise:nth-of-type(3); title ~16ch via .ctaPill h2"
metrics:
  duration: ~12m
  completed: 2026-06-03
---

# Phase 2 Plan 02: FooterCta styling, story, test, barrel Summary

Token-only CSS Module, Storybook story (amber + amber-deep), Vitest suite, and the
public barrel — completing the FooterCta block whose component + types shipped in 02-01.

## What Was Built

- **`FooterCta.module.css`** — Block-local, entirely token-driven (no raw hex, no raw
  px in property values). Defines: `.root` (layout only, no parallax), `.runwayMedia`
  16/7 frame (4/5 under 768px) with `calc(var(--radius-lg) * 2)` radius, `.rise` reveal
  transition with the hidden pre-state scoped to `.ctaPill:not(.revealed) .rise`
  (CORRECTION 3), `.ctaPill` centered outlined transparent column
  (`var(--border-strong) solid var(--color-border-strong)`,
  `calc(var(--radius-lg) * 4)` = 64px, collapsing to `* 2` under 560px, padding
  `--space-9 --space-7` stepping down under 768px), `.ctaButton` filled inversion pill
  with `@media (hover: hover)` lift, `.footWordmark`/`.footCol ul` list resets,
  `.footCols` block-local CSS Grid `1.6fr 1fr 1fr 1fr` → `1fr 1fr` (<860px, first column
  spans full) → `1fr` (<560px) (CORRECTION 4), `.footBar` top-bordered flex row with
  `tabular-nums` `.coords`, and a reduced-motion guard limited to `.rise` + `.ctaButton`
  (CORRECTION 5 — no parallax resets).
- **`FooterCta.stories.tsx`** — `Examples/FooterCta`, `layout: 'fullscreen'`. `Default`
  (amber) and `AmberDeep` (`footerTheme: 'amber-deep'`) stories, copy seeded verbatim
  from the UI-SPEC Copywriting Contract, `IMAGES.mtgHeroCouch` runway media.
- **`FooterCta.test.tsx`** — `MockObserver` IO stub copied verbatim from the analog. 8
  assertions: runway eyebrow/headline/lead, cta eyebrow/title/lead, CTA link href
  (`/start`) + accessible name, CTA title is `<h2>`, runway headline is `<h1>`, footer
  tag + link item (`/privacy`) + non-link item, footer legal, no-IO motion baseline.
- **`index.ts`** — Barrel: `FooterCta`, `FooterCtaProps`, `FooterCtaContent`.

## Corrections Applied (from 02-PATTERNS.md)

3. Reveal pre-state scoped to `.ctaPill:not(.revealed) .rise`, not `.root`.
4. Footer columns are a block-local CSS Grid (`1.6fr 1fr 1fr 1fr`), no Grid/Col.
5. No parallax CSS / `.editorial` / `--parallax-*` vars; reduced-motion guard covers
   only `.rise` and `.ctaButton`.
7. `MockObserver` IntersectionObserver stub copied verbatim from FeatureSpotlight.test.

## Verification

- `npm run typecheck` — passes.
- `npm run lint` (eslint + stylelint) — 0 errors (5 pre-existing react-refresh warnings
  in unrelated files, out of scope).
- `npx vitest run src/system/examples/FooterCta/FooterCta.test.tsx` — 8/8 pass.
- Grep gates: no px in property values; no hex; `ctaPill:not(.revealed) .rise` present;
  `1.6fr 1fr 1fr 1fr` present; `calc(var(--radius-lg)` present; `prefers-reduced-motion`
  present; `parallax` count 0; story title/layout/media/amber-deep/CTA copy present;
  barrel exports all three; `class MockObserver`, `level: 1`/`level: 2`, `getByRole('link'`
  present in test.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Footer bar border token corrected**
- **Found during:** Task 1
- **Issue:** Plan text referenced `var(--border-subtle)` for the footBar top border, but
  no `--border-subtle` token exists (the subtle 1px width token is `--border-hairline`;
  `--color-border-subtle` is the color). Stylelint/build would not resolve it.
- **Fix:** Used `border-top: var(--border-hairline) solid var(--color-border-strong)`
  (matches the analog idiom; the spec intent is a 1px hairline in the strong border color).
- **Files modified:** src/system/examples/FooterCta/FooterCta.module.css
- **Commit:** 4f2d1d2

**2. [Rule 2 - Token purity] Hover lift expressed via token, not raw -2px**
- **Found during:** Task 1
- **Issue:** Spec specifies `translateY(-2px)` for the hover lift, but raw px would
  violate the token-only REQ-02 gate.
- **Fix:** `transform: translateY(calc(var(--space-1) * -0.5))` (= -2px) keeps it
  token-derived. `--space-1` = 4px → -0.5 × = -2px, faithful to the spec value.
- **Files modified:** src/system/examples/FooterCta/FooterCta.module.css
- **Commit:** 4f2d1d2

## Known Stubs

None. All `content` is rendered; the block is fully wired.

## Self-Check: PASSED

- FOUND: src/system/examples/FooterCta/FooterCta.module.css
- FOUND: src/system/examples/FooterCta/FooterCta.stories.tsx
- FOUND: src/system/examples/FooterCta/FooterCta.test.tsx
- FOUND: src/system/examples/FooterCta/index.ts
- FOUND commit: 4f2d1d2 (Task 1 — CSS module)
- FOUND commit: edbb84f (Task 2 — story + barrel)
- FOUND commit: 11787e7 (Task 3 — test suite)
