# Phase 2: Footer + CTA block (FooterCta, variant a) - Pattern Map

**Mapped:** 2026-06-03
**Files analyzed:** 6 new files (one example block)
**Analogs found:** 6 / 6 (the just-shipped Phase 1 `FeatureSpotlight/` is a near-exact, file-for-file analog)

> This is an ADAPTATION phase. The dominant instruction to the planner is: **mirror `src/system/examples/FeatureSpotlight/` file-for-file.** Phase 1 already solved every primitive mismatch this block hits (Text has no `style`/`id`, Image has no arbitrary aspect/radius, Section has no ref, filled-pill CTA, reduced-motion guard, IntersectionObserver test stub). The only net-new surface area is (a) **two stacked themed `Section`s** instead of one, and (b) **footer chrome** (wordmark + multi-column links + legal bar). Both are buildable from primitives + block-local CSS.
>
> **Verification outcome:** I re-checked the UI-SPEC "Primitive Capability Notes" against real primitive source. The Text/Image/Section/Container/Icon/TextLink/useReveal notes are all **accurate**. I found **one additional load-bearing correction the spec under-states**: the footer-column layout (`1.6fr 1fr 1fr 1fr`) is **NOT** expressible through the `Grid`/`Col` primitives — they are a fixed 1→2→5 equal-fraction track, not 12-col, not arbitrary fr. The footer grid MUST be authored as block-local CSS. See "Additional Corrections" below.

---

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `src/system/examples/FooterCta/FooterCta.tsx` | component (example block) | request-response (static render of `content` prop) | `src/system/examples/FeatureSpotlight/FeatureSpotlight.tsx` | exact |
| `src/system/examples/FooterCta/types.ts` | type (CMS content shape) | transform | `src/system/examples/FeatureSpotlight/types.ts` | exact (extend shape) |
| `src/system/examples/FooterCta/FooterCta.module.css` | config (CSS Module) | transform | `src/system/examples/FeatureSpotlight/FeatureSpotlight.module.css` | exact (extend) |
| `src/system/examples/FooterCta/FooterCta.stories.tsx` | test (story) | request-response | `src/system/examples/FeatureSpotlight/FeatureSpotlight.stories.tsx` | exact |
| `src/system/examples/FooterCta/FooterCta.test.tsx` | test | request-response | `src/system/examples/FeatureSpotlight/FeatureSpotlight.test.tsx` | exact |
| `src/system/examples/FooterCta/index.ts` | utility (barrel) | n/a | `src/system/examples/FeatureSpotlight/index.ts` | exact |

No new hook. `useReveal` is reused as-is. **Do NOT import `useParallax`** (FeatureSpotlight uses it; variant a has no parallax — drop the parallax ref/merge entirely).

---

## Pattern Assignments

### `src/system/examples/FooterCta/FooterCta.tsx` (component, request-response)

**Analog:** `src/system/examples/FeatureSpotlight/FeatureSpotlight.tsx`

**Banner comment + imports** (analog lines 1-10) — copy verbatim, adjust import set:
```tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { type CSSProperties } from 'react'
import { Section, Container, Stack, Text, TextLink, Image, Icon } from '@system/primitives'
import { useReveal } from '@system/hooks'
import type { FooterCtaContent } from './types'
import s from './FooterCta.module.css'

export type FooterCtaProps = { content: FooterCtaContent }
```
> Drop `useParallax`. Add `TextLink` (needed for footer link items). Source-of-import order matches CONVENTIONS.md (external → `@system` alias → relative).

**useReveal + stagger idiom** (analog lines 12-23) — keep `useReveal` and `riseStyle`, delete the parallax merge:
```tsx
export function FooterCta({ content }: FooterCtaProps) {
  const { ref: revealRef, revealed } = useReveal()

  // Per-child entrance stagger via the documented inline custom-property idiom.
  const riseStyle = (d: number): CSSProperties => ({ '--rise-d': `${d}ms` } as CSSProperties)
```
> `useReveal` returns `{ ref, revealed }` (verified `useReveal.ts:44`). `ref` is `RefObject<HTMLDivElement>` — attach it to a plain `<div>`, never to `Section` (Section has no ref forwarding — verified `Section.tsx:15-21`). Single hook instance; reduced-motion → `revealed: true` at mount (`useReveal.ts:22`).

**The `--rise-d` stagger MUST ride a plain wrapper `<div>`, not `Text`** (analog lines 34-47) — this is the load-bearing Phase 1 pattern, because `Text` accepts no `style`/`id`/`...rest` (verified `Text.tsx:19-31`):
```tsx
{/* Text does not accept `style`/`id` — carry the --rise-d stagger on a plain wrapper, the .rise class drives the transition. */}
<div className={s.rise} style={riseStyle(0)}>
  <Text role="tag">{content.eyebrow}</Text>
</div>
<div className={s.rise} style={riseStyle(90)}>
  <Text role="display" as="h2">{content.headline}</Text>
</div>
```
> Apply this exact wrapper pattern to the CTA pill's 3 text children. Stagger order per spec: eyebrow 0ms → title 90ms → lead 180ms → button 270ms. Footer chrome is NOT reveal-animated.

**Filled-pill CTA `<a>` (NOT a TextLink)** (analog lines 44-47) — the big CTA button carries the block-local filled treatment; author it as a raw `<a>`, exactly as Phase 1 did (D-2 precedent):
```tsx
<a href={content.cta.action.href} className={[s.ctaButton, s.rise].join(' ')} style={riseStyle(270)}>
  <Text role="button" as="span">{content.cta.action.label}</Text>
  <Icon name="arrow-right" size="md" />
</a>
```
> `Icon name="arrow-right"` is a real glyph (verified `primitives/icons/ArrowRight.tsx` exists; glyphs limited to arrow-right/check/map-pin). `Text role="button"` resolves to a `<span>` at fs-md weight 800 (verified `type.ts:34`) — pass `as="span"` to keep it inside the anchor. Label + icon = single accessible link name (the test asserts `getByRole('link', { name: /.../ })`).

**Aspect/radius frame: apply on the block-local `figure`, let `Image` fill** (analog `FeatureSpotlight.tsx:49-51` + `.module.css:16-37`):
```tsx
{content.runway.media && (
  <figure className={s.runwayMedia}>
    <Image src={content.runway.media.src} alt={content.runway.media.alt} focalPoint="center" loading="lazy" />
  </figure>
)}
```
> `Image` has NO arbitrary `aspect` (named union `square|portrait|landscape|wide|cinematic`) and NO `aspect-ratio: 16/7`; `radius` is only `none|sm|md|lg` (verified `Image.tsx:4-22`). So DO NOT pass `aspect`/`radius` props for the 16/7 + 32px frame — put `aspect-ratio: 16 / 7` and the radius on the `.runwayMedia` figure in CSS, and let `Image` fill via `object-fit: cover` (the Phase 1 frame did exactly this). Note: the runway figure is **not** reveal-staggered in this block (Phase 1's was layer 360; here the reveal lives only on the footer-zone CTA pill, per spec Motion).

**Two stacked themed Sections (net-new vs Phase 1's single Section)** — composition skeleton (follows the UI-SPEC composition block + the themed-`Section` idiom):
```tsx
return (
  <div className={s.root}>
    {/* RUNWAY — neutral lead-in */}
    <Section theme={content.runwayTheme ?? 'neutral'} spacing="lg">
      <Container size="default">
        <Stack gap="loose">
          <Text role="tag">{content.runway.eyebrow}</Text>
          <Text role="hero" as="h1">{content.runway.headline}</Text>
          <Text role="lead">{content.runway.lead}</Text>
        </Stack>
        {/* runway.media figure here */}
      </Container>
    </Section>

    {/* FOOTER ZONE — amber end-state */}
    <Section theme={content.footerTheme ?? 'amber'} spacing="xl" aria-label={content.cta.title}>
      <Container size="default">
        <div ref={revealRef} className={[s.ctaPill, revealed && s.revealed].filter(Boolean).join(' ')}>
          {/* staggered eyebrow / title / lead / button — see above */}
        </div>
        {/* footer chrome — see footer block below */}
      </Container>
    </Section>
  </div>
)
```
> `Section` props verified (`Section.tsx:5-21`): `theme`, `spacing` (`sm|md|lg|xl`), `bleed`, `className`, and it **spreads `...rest`** onto `<section>` — so `aria-label` DOES forward. Set `aria-label` on the footer-zone Section (NOT `aria-labelledby`, because `Text` exposes no `id` — verified). `revealed && s.revealed` class toggle and the `.filter(Boolean).join(' ')` class-build idiom both copied from analog lines 26-28 + CONVENTIONS.md line 40.
> `themes['amber']` and `themes['amber-deep']` both exist (verified `themes/index.ts:142-165`): amber → `surface-page: amber[700]`, `text-default: yellow[200]`, `text-muted: mutedOn(yellow[200])`, strong border via `STRONG_BORDER`, `focus-ring: yellow[100]`. This matches the spec Color table exactly; no new tokens.

**Footer chrome (net-new — wordmark + columns + bar)** — composed from primitives + block-local CSS. Link items use `TextLink`; non-link items use `Text`:
```tsx
<a className={s.footWordmark} href="#" aria-label="Move to Gothenburg — home">
  {/* decorative inline SVG, aria-hidden */}
</a>
<div className={s.footCols}>
  {content.footer.columns.map((col, i) => (
    <div key={i} className={s.footCol}>
      <Text role="meta" as="p">{col.tag}</Text>
      <ul>
        {col.items.map((it, j) => (
          <li key={j}>
            {it.href ? <TextLink href={it.href}>{it.text}</TextLink> : <Text role="body-sm" as="span">{it.text}</Text>}
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
<div className={s.footBar}>
  <Text role="meta" as="span">{content.footer.legal}</Text>
  {content.footer.coords && <Text role="meta" as="span" className={s.coords}>{content.footer.coords}</Text>}
</div>
```
> `TextLink` renders `<a>` with `...rest` spread (verified `TextLink.tsx:5-17`) — pass `href` directly. The decorative wordmark-inside-`<a>` + `aria-label` pattern is lifted from `MTGTopbar.tsx:15-18` (`<a aria-label="Move to Gothenburg — home">` with `aria-hidden` mark inside). `Text role="meta"` → span at fs-xs (verified). Guard optional content (`coords`, `media`) with conditional rendering per CONVENTIONS.md line 69 ("avoid throwing during render; guard optional content").

---

### `src/system/examples/FooterCta/types.ts` (type, CMS content shape)

**Analog:** `src/system/examples/FeatureSpotlight/types.ts` (lines 1-11)

Extend the analog's single-flat shape to the nested shape the UI-SPEC defines (lines 76-103). Keep the `import type { ThemeName } from '@tokens/themes'` pattern (analog line 1, verified `ThemeName` is exported `themes/index.ts:8`). Name the type `FooterCtaContent` (CONVENTIONS.md line 31: `{ComponentName}Content`). Use the exact shape from UI-SPEC lines 79-103 — `runway` (eyebrow/headline/lead/optional media), `cta` (eyebrow/title/lead/action), `footer` (columns[]/legal/optional coords), optional `runwayTheme`/`footerTheme: ThemeName`.

---

### `src/system/examples/FooterCta/FooterCta.module.css` (config, CSS Module)

**Analog:** `src/system/examples/FeatureSpotlight/FeatureSpotlight.module.css`

**Stagger + reveal pre-state** (analog lines 39-51) — copy verbatim, this is the canonical reveal idiom:
```css
/* Visible end-state is the base; the hidden pre-state only applies before reveal
   (so no-JS / no-IntersectionObserver baselines still show content). */
.rise {
  transition:
    opacity var(--motion-reveal-duration) var(--motion-reveal-easing) var(--rise-d, 0ms),
    transform var(--motion-reveal-duration) var(--motion-reveal-easing) var(--rise-d, 0ms);
}
.root:not(.revealed) .rise {
  opacity: 0;
  transform: translateY(var(--space-3));
}
```
> NOTE: in FeatureSpotlight `.revealed` is on `.root`. In this block the reveal class is on `.ctaPill` (the wrapper that carries `revealRef`). So the selector becomes `.ctaPill:not(.revealed) .rise { ... }`. Keep the "visible is base, hidden is the pre-state" inversion — this is what makes the no-IO test baseline pass.

**Filled-pill CTA button (accent by inversion)** (analog lines 53-73) — copy and re-token padding per spec:
```css
.ctaButton {
  display: inline-flex;
  align-items: center;
  gap: var(--space-inline-default);
  padding: var(--space-3) var(--space-5);   /* 12 / 24 — spec line 195 */
  border-radius: var(--radius-pill);
  background: var(--color-text-default);     /* amber: yellow[200] */
  color: var(--color-surface-page);          /* amber: amber[700] — AA-safe inversion (D-2) */
  text-decoration: none;
  transition:
    opacity var(--motion-hover-duration) var(--motion-hover-easing),
    transform var(--motion-hover-duration) var(--motion-hover-easing);
}
@media (hover: hover) {
  .ctaButton:hover { transform: translateY(-2px); }   /* spec: -2px (analog used -1px) */
}
```

**Reduced-motion guard** (analog lines 75-88) — copy, drop the parallax-only selectors (`.editorial`/`.frame`/`.frame img` transform resets are parallax-specific; keep only `.rise` + `.ctaButton`):
```css
@media (prefers-reduced-motion: reduce) {
  .rise { transition: none !important; opacity: 1 !important; transform: none !important; }
  .ctaButton { transition: none !important; }
}
```

**Runway media frame** (analog `.frame` lines 16-37) — adapt aspect to 16/7, radius to 32px:
```css
.runwayMedia {
  border-radius: calc(var(--radius-lg) * 2);   /* 32px — the analog's exact non-token radius trick */
  overflow: clip;
  background: var(--color-surface-raised);
  aspect-ratio: 16 / 7;                         /* spec line 277 (Image cannot express this) */
  margin: 0;
}
.runwayMedia img { width: 100%; height: 100%; object-fit: cover; display: block; }
@media (width < 768px) { .runwayMedia { aspect-ratio: 4 / 5; } }
```

**Net-new block-local CSS (no analog precedent — author from spec):**
- `.ctaPill`: centered flex column, `gap: var(--space-stack-loose)` (24px), `border: var(--border-strong) solid var(--color-border-strong)`, `border-radius: calc(var(--radius-lg) * 4)` (64px → `calc(... * 2)` = 32px under 560px), transparent background, `padding: var(--space-9) var(--space-7)` (96/48, step down under 768px). Per spec Interaction Notes line 276.
- `.footCols`: **block-local CSS Grid** — `grid-template-columns: 1.6fr 1fr 1fr 1fr` → `1fr 1fr` under 860px (first column spans full) → `1fr` under 560px. **This CANNOT use the `Grid`/`Col` primitives** (see Additional Corrections). `gap: var(--space-stack-xl) var(--space-content-gap)` (48/32 per spec lines 192-193).
- `.footBar`: flex row, wraps, `border-top: var(--border-subtle) solid var(--color-border-strong)`, `gap: var(--space-inline-default)`.
- `.coords`: `font-variant-numeric: tabular-nums`.
- `.footWordmark` / `.footCol ul`: list reset (`list-style: none; margin: 0; padding: 0`), `.footCol ul` gap `var(--space-stack-default)` (16px).

> Hard constraints (CONVENTIONS.md lines 50-51 + spec line 69): **no raw hex, no raw px** in `src/system/**`. All values flow through `--space-*`, `--radius-*`, `--color-*`, `--motion-*`, `--border-*` tokens. The `calc(var(--radius-lg) * N)` trick is the sanctioned way to hit non-token large radii (Phase 1 precedent, analog line 17).

---

### `src/system/examples/FooterCta/FooterCta.stories.tsx` (test, story)

**Analog:** `src/system/examples/FeatureSpotlight/FeatureSpotlight.stories.tsx` (lines 1-28)

Copy the structure exactly: `meta` with `title: 'Examples/FooterCta'`, `parameters: { layout: 'fullscreen' }` (analog line 17), `Default` story + a second themed story. Per spec: the second story is **`amber-deep`** (`args: { content: { ...content, footerTheme: 'amber-deep' } }` — mirrors analog's `BlueSoftTheme` pattern at lines 26-28). Import fixtures:
```tsx
import { IMAGES } from '../../../stories/_fixtures/images'
// runway.media: IMAGES.mtgHeroCouch  (verified key exists, images.ts:13 — sofa image matching source feature-sofa.png)
```
Seed all copy from the UI-SPEC Copywriting Contract (lines 290-302) verbatim. Headlines with `\n` line breaks per the content shape.

---

### `src/system/examples/FooterCta/FooterCta.test.tsx` (test)

**Analog:** `src/system/examples/FeatureSpotlight/FeatureSpotlight.test.tsx` (lines 1-57)

**Copy the IntersectionObserver mock verbatim** (analog lines 6-18) — this is mandatory; `useReveal` constructs an IO in an effect and jsdom has none:
```tsx
class MockObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
beforeEach(() => {
  ;(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    MockObserver as unknown as typeof IntersectionObserver
})
```
Assertions per spec line 71 (extend the analog's 5 tests): runway eyebrow/headline/lead present; CTA eyebrow/title/lead present; CTA button is a `link` with supplied `href` + accessible name (`getByRole('link', { name: /begin with one line/i })`, analog lines 46-50); CTA title is `<h2>` (`getByRole('heading', { level: 2 })`, analog lines 36-39); footer column tags + items render; footer legal copy renders; content visible without motion (no-IO baseline, analog lines 52-56). Runway headline is `<h1>` — can also assert `getByRole('heading', { level: 1 })`.

---

### `src/system/examples/FooterCta/index.ts` (utility, barrel)

**Analog:** `src/system/examples/FeatureSpotlight/index.ts` (lines 1-2) — copy verbatim, rename:
```ts
export { FooterCta, type FooterCtaProps } from './FooterCta'
export type { FooterCtaContent } from './types'
```

---

## Shared Patterns

### Class-name composition
**Source:** `FeatureSpotlight.tsx:28` + CONVENTIONS.md:40
**Apply to:** every conditional class in `FooterCta.tsx`
```tsx
className={[s.ctaPill, revealed && s.revealed].filter(Boolean).join(' ')}
```

### Inline CSS-custom-property for dynamic values
**Source:** `FeatureSpotlight.tsx:23` (`riseStyle`), `Col.tsx:14-18`, CONVENTIONS.md:41
**Apply to:** the per-child `--rise-d` stagger
```tsx
const riseStyle = (d: number): CSSProperties => ({ '--rise-d': `${d}ms` } as CSSProperties)
```

### Reveal idiom (visible-is-base, hidden-is-pre-state)
**Source:** `FeatureSpotlight.module.css:39-51` + `useReveal.ts`
**Apply to:** the CTA pill subtree only. The hidden pre-state is CSS-only and scoped under `:not(.revealed)`, which is why no-JS / no-IO baselines (and the test) still render content.

### Theme via `Section theme` (no scroll color engine)
**Source:** `FeatureSpotlight.tsx:31` + `themes/index.ts:142-165`
**Apply to:** both regions. Runway `theme="neutral"`, footer `theme="amber"` / story `amber-deep`. D-3: drop the source's page-wide `--amber` interpolation and any `document`/`html` mutation — render the warmed end-state statically.

### Example-block banner comment
**Source:** `FeatureSpotlight.tsx:1-2`, `MTGHero.tsx:1-2` + CONVENTIONS.md:88
**Apply to:** top of `FooterCta.tsx`
```tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.
```

### Guard optional content with conditional rendering
**Source:** CONVENTIONS.md:69 (HeroText/StoryTeaser/ImageText pattern)
**Apply to:** `runway.media` (D-4 optional) and `footer.coords`. Never throw; render-or-omit.

---

## Additional Corrections (verified against real primitive source — fold into the plan)

The UI-SPEC Primitive Capability Notes (lines 160-177) are accurate for Text / Image / Section / Container / Icon / TextLink / Surface / Stack / useReveal — I re-verified each against source and they hold. **One additional correction the spec under-states:**

1. **`Grid` / `Col` cannot express the footer column layout.** The spec's Interaction Notes (line 278) describe footer columns as `1.6fr 1fr 1fr 1fr → 1fr 1fr → 1fr`, and the Spacing table references them, but it does not explicitly state the primitives can't do this. Verified `Grid.tsx:9-11` renders a fixed div whose CSS template (`Grid.module.css:1-19`) is `1fr` → `repeat(2,1fr)` (>=768px) → `repeat(5,1fr)` (>=1200px) — an **equal-fraction, 5-column-max, fixed-breakpoint** track. `Col` only spans whole columns of that track (`Col.module.css`), with no `1.6fr`/asymmetric capability and breakpoints baked at 768/1200, not the source's 860/560. **Conclusion: author `.footCols` as block-local CSS Grid in `FooterCta.module.css`** (same posture FeatureSpotlight took for its bespoke frame). Do not import `Grid`/`Col` for the footer. This is consistent with the spec's own "build from primitives + block-local CSS" intent and is the faithful expression of the source breakpoints.

2. **Drop `useParallax`.** FeatureSpotlight imports and merges a parallax ref (`FeatureSpotlight.tsx:6,18-20,49`). Variant a has no parallax (spec Motion line 269). The plan should NOT copy the merged-ref callback — attach `revealRef` directly to the `.ctaPill` div. Also drop the parallax-only CSS (`.root` parallax vars, `.editorial` transform, the parallax `transform` resets in the reduced-motion block).

3. **Reveal class lives on `.ctaPill`, not `.root`.** Unlike FeatureSpotlight (reveal on root), this block's reveal scope is the footer CTA pill subtree only — so the CSS pre-state selector is `.ctaPill:not(.revealed) .rise`, and `revealRef`/`revealed` attach to the pill wrapper. The runway and footer chrome are static.

4. **`Section` second story theme.** `amber-deep` is a real `ThemeName` (verified `themes/index.ts:154-165`) — the second story is safe; no token work.

5. **Stack `gap="loose"` = 24px** is real (`Stack.tsx:4` union includes `loose`) for the runway text column, but the **CTA pill internal rhythm must be a styled flex column, not `Stack`** — the `.rise` wrappers need to be direct children for the stagger transition, and the pill needs the border/radius/padding treatment `Stack` can't carry. Author the pill as a styled `<div>` (spec line 174 confirms this reasoning).

---

## No Analog Found

None. Every file has a file-for-file analog in `src/system/examples/FeatureSpotlight/`. The only sub-patterns without a direct precedent (footer columns grid, footer bar, wordmark) are net-new block-local CSS, but their composition primitives (`TextLink` rows from `MTGTopbar.tsx`, themed `Section`, `Text role="meta"`) all exist and are referenced above.

---

## Metadata

**Analog search scope:** `src/system/examples/` (FeatureSpotlight, MTGHero, MTGTopbar, EditorialText), `src/system/primitives/` (Section, Container, Text, Image, TextLink, Grid, Col, Stack, Icon), `src/system/hooks/useReveal.ts`, `src/tokens/themes/index.ts`, `src/tokens/semantic/type.ts`, `src/stories/_fixtures/images.ts`
**Files scanned:** 18
**Pattern extraction date:** 2026-06-03
