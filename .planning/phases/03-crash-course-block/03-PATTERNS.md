# Phase 3: Crash Course block (CrashCourseRail, variant C) - Pattern Map

**Mapped:** 2026-06-03
**Files analyzed:** 6 new (one new example block folder)
**Analogs found:** 6 / 6 (all role-matched against shipped blocks; the horizontal-scroll interaction has NO precedent — see "No Analog Found")

> This is an ADAPTATION phase. The block mirrors the two shipped blocks `FeatureSpotlight` and `FooterCta` for file anatomy, banner comment, plain-wrapper `--rise-d` stagger, `useReveal` ref placement, token-only CSS, `MockObserver` test stub, story shape, and barrel. The aria-current pagination semantics mirror `NeighborhoodPaginator`. The card image-scrim mirrors `NeighborhoodCard.coordChip`. **The horizontal scroll-snap rail + component-local `scrollLeft` active-index tracking is genuinely new to this codebase** and must be authored from scratch (no copy source) — details below.

---

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `src/system/examples/CrashCourseRail/CrashCourseRail.tsx` | component (example block) | event-driven (scroll listener → local state) | `FooterCta.tsx` (anatomy/idiom) + `NeighborhoodPaginator.tsx` (aria-current + rAF scroll) | role-match; interaction NEW |
| `src/system/examples/CrashCourseRail/types.ts` | types (CMS content shape) | n/a | `FooterCta/types.ts` | exact |
| `src/system/examples/CrashCourseRail/CrashCourseRail.module.css` | styles | n/a | `FooterCta.module.css` + `FeatureSpotlight.module.css` (figure-fill, rise) + `NeighborhoodPaginator.module.css` (dot/active) | role-match; scroll-snap CSS NEW |
| `src/system/examples/CrashCourseRail/CrashCourseRail.stories.tsx` | story | n/a | `FooterCta.stories.tsx` | exact |
| `src/system/examples/CrashCourseRail/CrashCourseRail.test.tsx` | test | n/a | `FooterCta.test.tsx` (MockObserver, role queries) | exact |
| `src/system/examples/CrashCourseRail/index.ts` | barrel | n/a | `FooterCta/index.ts` | exact |

---

## UI-SPEC Primitive Capability Notes — Re-Verification (load-bearing corrections)

Each row was re-checked against real source. **Verdict column flags corrections.**

| Claim in UI-SPEC | Real source | Verdict |
|---|---|---|
| `Text` has no `style`/`id`/`...rest`; accepts `role`, `as`, `tone`, `className`, `children` | `Text.tsx:19-31` — props are exactly `role`, `as?`, `tone?`, `className?`, `children`. No spread, no `style`, no `id`. | **CONFIRMED.** The `--rise-d` stagger MUST ride a plain `<div className={s.rise} style={...}>` wrapper, never `Text`. |
| `Text` defaultTag map (`display`→`h1`, `h2`→`h2`, `h3`→`h3`, `body-sm`→`p`, `tag`/`button`→`span`) | `Text.tsx:5-9` — `display:'h1'`, `h2:'h2'`, `h3:'h3'`, `'body-sm':'p'`, `tag:'span'`, `button:'span'`. | **CONFIRMED.** Block `<h2>` needs `role="display" as="h2"`. Card title needs `role="h3" as="span"`; card desc needs `role="body-sm" as="span"`. |
| `Section` spreads `...rest` so `aria-label` forwards; has `theme`, `spacing` (`sm\|md\|lg\|xl`), `bleed`, `className`; no ref | `Section.tsx:7-22` — `Omit<HTMLAttributes,'children'>` spread onto `<section {...rest}>`; `spacing` default `'md'`; `data-theme={theme}`. No `ref`. | **CONFIRMED.** `aria-label={heading}` forwards. `useReveal` ref goes on an inner plain `<div>`, not `Section`. |
| `Section`/`Container` are NOT `overflow:hidden` → rail can scroll | `Section.module.css:1-21` (no `overflow`), `Container.module.css:1-21` (no `overflow`). | **CONFIRMED — critical.** Neither clips. The `overflow-x:auto` rail will scroll. NO precedent block sets `overflow:hidden` on an ancestor. |
| `Container`: only `size`/`as`/`className`/`children`; no `...rest`, no ref | `Container.tsx:6-16`. `size-default` = `max-inline-size: 1440px` (`Container.module.css:15`). | **CORRECTION (minor):** SPEC says `default` is `min(1280px,92vw)`. Real `size-default` caps at **1440px**, not 1280px. Padding is `--space-container-pad-{sm/md/lg}` = 16/32/64px. Use `size="default"` as-is; the 1440 cap is fine (premium wide). |
| `Image`: `aspect` is named union, `radius` is `none\|sm\|md\|lg` (no pill/clamp), `src`/`alt`/`focalPoint`/`loading`/`className` | `Image.tsx:4-22`. Default CSS `.image { width:100%; height:auto; object-fit:cover }` (`Image.module.css:1-6`). | **CONFIRMED + EXTRA:** `Image` renders a bare `<img class={s.image}>` and exposes **no `width`/`height`/`style` passthrough except `objectPosition`** (set internally from `focalPoint`). Default height is `auto`. To fill a fixed-height figure you MUST override via block CSS targeting `.media img { width:100%; height:100%; object-fit:cover }` — exactly the `FeatureSpotlight.module.css:25-31` (`.frame img`) and `FooterCta.module.css:20-25` (`.runwayMedia img`) precedent. Use `Image radius="none"`; the figure wrapper clips. |
| `Icon`: glyphs `arrow-right`, `check`, `map-pin` only; `role="img"` only when `aria-label` given | `Icon.tsx:7,16-29` — glyph map is exactly those 3. `role={rest['aria-label'] ? 'img' : undefined}`. | **CONFIRMED.** See "Icon prev/next" below — chevrons are NOT in the set. |
| `useReveal` returns `{ ref, revealed }`; `revealed:true` at mount under reduced motion; builds IO in effect | `useReveal.ts:19-45`. `useState(() => prefersReducedMotion())`; effect early-returns if `revealed`; mocked in tests. `ref` typed `HTMLDivElement`. | **CONFIRMED.** Optional single instance on header wrapper. `ref` is `RefObject<HTMLDivElement>` — attach to a `<div>`. |
| `useScrollSections` is vertical-page, NOT a fit for horizontal `scrollLeft` | `useScrollSections.ts:1-40` + its consumer `MTGNeighborhoods.tsx:26-28,71-75` — it observes full-viewport `data-section-id` anchors via `window.scrollY` / IntersectionObserver with `rootMargin '-50% 0% -50% 0%'`. | **CONFIRMED — do NOT use.** It tracks page vertical scroll, has no `scrollLeft` concept. D-5 stands: author component-local horizontal tracking. |
| Card scrim via `--color-overlay-scrim` / `color-mix(--color-text-default …)`; caption `--color-text-on-dark` | `color.ts:91-92`: `overlay.scrim = rgba(42,32,32,0.85)`, emitted as `--color-overlay-scrim`. `NeighborhoodCard.module.css:40` uses `color-mix(in oklch, var(--color-text-default) 86%, transparent)`. In `yellow` theme `text-on-dark` = `neutral[50]` = `#FFFEF2` (`themes/index.ts:135`, `color.ts:7`). | **CONFIRMED.** Both tokens exist and emit. The coordChip is the exact `color-mix` precedent. NOTE: SPEC said "`--color-text-on-dark` = `#FFFEF2` exactly" — true by value, but the token path is `neutral[50]`, not a literal. |

**Net corrections for the planner:**
1. `Container size="default"` caps at **1440px** (not 1280). Acceptable; no change.
2. `Image` exposes no size/style passthrough — fill MUST be done in block CSS on `.media img` (figure-wrapper precedent confirmed).
3. `--color-text-on-dark` is correct in value; reference it as the token, never the hex.
4. All `--space-1`..`--space-12`, `--radius-{none,sm,md,lg,pill,full}`, and the 7 `--motion-*` role pairs ARE emitted (verified in `src/tokens/generated/tokens.css`) — so `--space-7` (48px active-dot pill), `--space-1` (nav lift), `calc(var(--radius-lg) * N)` are all valid.

---

## Pattern Assignments

### `CrashCourseRail.tsx` (component, event-driven)

**Primary anatomy/idiom analog:** `src/system/examples/FooterCta/FooterCta.tsx`
**Interaction analog (aria-current + rAF scroll listener):** `src/system/examples/MTGNeighborhoods/NeighborhoodPaginator.tsx`

**Banner comment + imports** (copy `FooterCta.tsx:1-10`):
```tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { type CSSProperties } from 'react'
import { Section, Container, Stack, Text, Image, Icon } from '@system/primitives'
import { useReveal } from '@system/hooks'
import type { CrashCourseRailContent } from './types'
import s from './CrashCourseRail.module.css'

export type CrashCourseRailProps = { content: CrashCourseRailContent }
```
Note: this block also needs `useEffect, useRef, useState, useCallback` from `react` (see scroll tracking below) — add to the react import.

**`useReveal` + `riseStyle` header stagger** (copy `FooterCta.tsx:12-16` / `FeatureSpotlight.tsx:12,22-23`):
```tsx
const { ref: revealRef, revealed } = useReveal()
const riseStyle = (d: number): CSSProperties => ({ '--rise-d': `${d}ms` } as CSSProperties)
```
Attach `revealRef` to the header wrapper `<div>` (NOT the Section — Section has no ref). Gate the hidden pre-state with `revealed` exactly as `FeatureSpotlight.tsx:27-28` (`[s.head, revealed && s.revealed].filter(Boolean).join(' ')`). The rail/cards are NOT reveal-gated — visible from first paint.

**Plain-wrapper stagger (Text cannot carry `style`)** — copy the comment + pattern from `FooterCta.tsx:49-58`:
```tsx
{/* Text does not accept `style`/`id` — carry the --rise-d stagger on a plain wrapper, the .rise class drives the transition. */}
<div className={s.rise} style={riseStyle(0)}><Text role="tag">{content.eyebrow}</Text></div>
<div className={s.rise} style={riseStyle(90)}><Text role="display" as="h2">{content.heading}</Text></div>
<div className={s.rise} style={riseStyle(180)}><Text role="lead">{content.lead}</Text></div>
```

**Card element switch (`<a href>` vs `<article>`, D-4)** — no direct analog; author:
```tsx
const Tag = card.href ? 'a' : 'article'   // const, capitalized so JSX treats it as a component
// <Tag {...(card.href ? { href: card.href } : {})} className={s.card}>
```
Whole-card-as-link precedent: `FeatureSpotlight.tsx:44` and `FooterCta.tsx:59-66` author block-local `<a className={...}>` for the primary action (not `TextLink`). Card "Read more" arrow = `Icon name="arrow-right" size="sm"` decorative (pass `aria-hidden`), mirroring `FooterCta.tsx:65` (`<Icon name="arrow-right" size="md" />`).

**Active-index scroll tracking (NEW — no copy source; pattern adapted from `NeighborhoodPaginator.tsx:35-114`):**
`NeighborhoodPaginator` is the closest *shape* (a `useRef` for rAF, a passive listener, rAF-throttled `tick()`, cleanup) but it reads `window.scrollY` + `getBoundingClientRect` of page anchors. For this block, adapt the SHAPE to read horizontal `scrollLeft` on a `railRef`:
```tsx
const railRef = useRef<HTMLUListElement | null>(null)
const [activeIndex, setActiveIndex] = useState(0)
const rafRef = useRef<number | null>(null)

useEffect(() => {
  const rail = railRef.current
  if (!rail || typeof window === 'undefined') return
  function tick() {
    rafRef.current = null
    const r = railRef.current
    if (!r) return
    const cell = r.firstElementChild as HTMLElement | null
    if (!cell) return
    const step = cell.offsetWidth + /* gap */ ... // derive from cell rects, not a magic px
    setActiveIndex(Math.round(r.scrollLeft / step))
  }
  function onScroll() {
    if (rafRef.current !== null) return
    rafRef.current = window.requestAnimationFrame(tick)
  }
  rail.addEventListener('scroll', onScroll, { passive: true })
  return () => {
    rail.removeEventListener('scroll', onScroll)
    if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
  }
}, [])
```
Mirror `NeighborhoodPaginator.tsx`: `rafRef` guard (`:100-103`), `{ passive: true }` (`:107`), cancel-in-cleanup (`:109-113`). Step derivation: read `firstElementChild.offsetWidth` + the gap (avoid hardcoding the clamp px). The `typeof window === 'undefined'` guard mirrors `NeighborhoodPaginator.tsx:41` and `useReveal.ts:4`.

**`scrollToIndex` with reduced-motion guard (NEW):**
```tsx
const reduce = typeof window !== 'undefined' && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches   // copy useReveal.ts:4-6 shape
const scrollToIndex = useCallback((i: number) => {
  const rail = railRef.current
  if (!rail) return
  const clamped = Math.max(0, Math.min(content.cards.length - 1, i))
  const cell = rail.children[clamped] as HTMLElement | undefined
  if (!cell) return
  rail.scrollTo({ left: cell.offsetLeft, behavior: reduce ? 'auto' : 'smooth' })
}, [content.cards.length])
```
The `matchMedia` reduced-motion check is the exact pattern in `useReveal.ts:3-7` — reuse it inline (no shared util exists).

**Dot-nav as `<nav>` + aria-current (NOT tablist, D-2)** — copy semantics from `NeighborhoodPaginator.tsx:122-146`:
```tsx
<nav className={s.dots} aria-label="Crash course pagination">
  {content.cards.map((card, i) => (
    <button type="button" key={i}
      className={[s.dot, i === activeIndex && s.dotActive].filter(Boolean).join(' ')}
      aria-current={i === activeIndex ? 'true' : undefined}
      aria-label={`Go to ${card.title}`}
      onClick={() => scrollToIndex(i)} />
  ))}
</nav>
```
Exact precedent: `NeighborhoodPaginator.tsx:123` (`<nav aria-label=...>`), `:140` (`aria-current={isActive ? 'true' : undefined}`), `:141` (`aria-label={\`Jump to ${n.name}\`}`), `:142-147` (`data-id` + `onClick`). The active-widens-to-pill is in CSS (see below).

**Prev/next buttons + inline chevron SVG (Icon has NO chevron)** — author block-local `aria-hidden` SVG. Precedent for block-local inline SVG: `FooterCta.tsx:71-83` (the wordmark `<svg … aria-hidden="true" focusable="false">`). The available `arrow-right` glyph (`icons/ArrowRight.tsx:1-8`) is a right-arrow, NOT a chevron and is reserved for the card "Read more". Author two small chevron `<svg aria-hidden focusable="false">` (left + right); the `aria-label` lives on the `<button>`:
```tsx
<button type="button" className={s.navBtn} aria-label="Previous"
  disabled={activeIndex === 0} onClick={() => scrollToIndex(activeIndex - 1)}>
  <svg viewBox="0 0 24 24" aria-hidden focusable="false">{/* chevron-left */}</svg>
</button>
```
`disabled` at ends mirrors the source; SPEC §Interaction line 277.

**Composition skeleton** — follows the SPEC §Component Anatomy block (lines 96-152) and the `FeatureSpotlight.tsx:31-53` Section→Container→Stack header shape:
```tsx
<Section theme={content.theme ?? 'yellow'} spacing="lg" aria-label={content.heading}>
  <Container size="default">
    <Stack gap="loose" align="center" className={s.head}>{/* reveal wrapper carries revealRef */}…</Stack>
    {content.cards.length > 0 && (
      <>
        <ul ref={railRef} className={s.rail} tabIndex={0}
            aria-label={`${content.heading} — scrollable cards`}
            onKeyDown={onRailKeyDown}>…</ul>
        <div className={s.controls}>…dots…nav…</div>
      </>
    )}
  </Container>
</Section>
```
Empty-state (no rail/controls when `cards` empty) per SPEC line 303 — conditional render mirrors the optional-content guarding in `FooterCta.tsx:28` / `HeroText.tsx` convention (CONVENTIONS.md:69).

**Keyboard (`onKeyDown` on rail, SC#2)** — NEW; no analog. `ArrowLeft/Right` → `scrollToIndex(activeIndex ∓ 1)`; `Home/End` → first/last. `event.preventDefault()` on handled keys.

---

### `types.ts` (types)

**Analog:** `src/system/examples/FooterCta/types.ts` (exact shape idiom)

Copy the import + `Content` naming convention from `FooterCta/types.ts:1-3`:
```ts
import type { ThemeName } from '@tokens/themes'

export type CrashCourseRailCard = {
  title: string
  description: string
  image: { src: string; alt: string }   // matches FooterCta media shape (types.ts:8) — alt required
  href?: string
}

export type CrashCourseRailContent = {
  eyebrow?: string
  heading: string
  lead?: string
  cards: CrashCourseRailCard[]
  theme?: ThemeName                       // mirrors FooterCta runwayTheme?/footerTheme? (types.ts:24-25)
}
```
`{ src; alt }` media shape is verbatim from `FooterCta/types.ts:8`. `theme?: ThemeName` import path `@tokens/themes` verified at `themes/index.ts` (export `ThemeName`). Full content shape is fixed by SPEC lines 74-92.

---

### `CrashCourseRail.module.css` (styles)

**Analogs:** `FooterCta.module.css` (rise, reduced-motion, calc-radius, hover-lift), `FeatureSpotlight.module.css` (figure-fill, rise gating), `NeighborhoodCard.module.css` (image-fill + scrim), `NeighborhoodPaginator.module.css` (dot/active/focus).

**Header rise stagger** (copy `FooterCta.module.css:36-45` / `FeatureSpotlight.module.css:42-51`):
```css
.rise {
  transition:
    opacity var(--motion-reveal-duration) var(--motion-reveal-easing) var(--rise-d, 0ms),
    transform var(--motion-reveal-duration) var(--motion-reveal-easing) var(--rise-d, 0ms);
}
.head:not(.revealed) .rise { opacity: 0; transform: translateY(var(--space-3)); }
```

**Scroll-snap rail (NEW — NO precedent in codebase, authored from SPEC §Motion lines 260):**
```css
.rail {
  display: flex;
  gap: var(--space-stack-default);              /* 16px, source track gap */
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;                        /* Firefox */
  scroll-padding-inline: var(--space-container-pad-md);
  margin-top: var(--space-content-gap);         /* header → rail, 32px */
}
.rail::-webkit-scrollbar { display: none; }     /* WebKit */
.rail:focus-visible {
  outline: var(--border-strong) solid var(--color-focus-ring);
  outline-offset: var(--space-1);
}
.cell { flex: 0 0 clamp(258px, 23vw, 310px); scroll-snap-align: start; list-style: none; }
```
Reasoning verified against `Section.module.css`/`Container.module.css` (no `overflow:hidden` ancestor → rail scrolls). `scrollbar-width:none` + `::-webkit-scrollbar{display:none}` is the SPEC's hidden-scrollbar (line 260). Focus ring style copied from `NeighborhoodPaginator.module.css:64-68`. **Do NOT use `<ul>` default list styling** — zero margin/padding/list-style like `NeighborhoodPaginator.module.css:11-19` and `FooterCta.module.css:125-132`.

**Card figure-fill + radius + scrim** (figure-fill copy `FeatureSpotlight.module.css:25-31` / `NeighborhoodCard.module.css:23-28`; scrim copy `NeighborhoodCard.module.css:40`):
```css
.card { position: relative; display: block; border-radius: calc(var(--radius-lg) * 1.5); overflow: clip;
        background: var(--color-surface-raised); text-decoration: none;
        height: clamp(366px, 31vw, 420px); }
.media { position: absolute; inset: 0; }
.media img { width: 100%; height: 100%; object-fit: cover; display: block; }   /* Image needs this — it ships height:auto */
.card::after { content: ''; position: absolute; inset: 0;
  background: linear-gradient(to top, var(--color-overlay-scrim), transparent 55%); }
.cap { position: relative; … color: var(--color-text-on-dark); }              /* caption above scrim */
```
`calc(var(--radius-lg) * N)` radius idiom is the sanctioned precedent (`FooterCta.module.css:55,78`, `FeatureSpotlight.module.css:17`). Scrim token `--color-overlay-scrim` emits (verified). The `.media img` override is REQUIRED because `Image.module.css:1-6` ships `height:auto` — see Primitive note.

**Active dot widens to pill** (adapt `NeighborhoodPaginator.module.css:70-91` dot/active):
```css
.dot { width: var(--space-3); height: var(--space-3); border-radius: var(--radius-pill);
       background: transparent; border: var(--border-strong) solid var(--color-text-default);
       padding: 0; cursor: pointer;
       transition: width var(--motion-state-change-duration) var(--motion-state-change-easing); }
.dotActive { width: var(--space-7); background: var(--color-text-default); }   /* 48px pill */
.dot:focus-visible { outline: var(--border-strong) solid var(--color-focus-ring); outline-offset: var(--space-1); }
```

**Round nav buttons + hover lift** (lift copy `FooterCta.module.css:97-101`):
```css
.navBtn { display: inline-grid; place-items: center; border-radius: var(--radius-full);
          background: var(--color-text-default); color: var(--color-surface-page); border: 0;
          width: var(--space-7); height: var(--space-7); cursor: pointer;
          transition: transform var(--motion-hover-duration) var(--motion-hover-easing); }
.navBtn:disabled { opacity: 0.4; cursor: not-allowed; }
@media (hover: hover) { .navBtn:not(:disabled):hover { transform: translateY(calc(var(--space-1) * -0.5)); } }
```
Token-only lift `translateY(calc(var(--space-1) * -0.5))` is the exact Phase-2 precedent (`FooterCta.module.css:99`) — SPEC line 265 explicitly mandates this over raw `scale()` magic numbers.

**Card hover (restrained, scale 1.03 not 1.05)** — `@media (hover: hover)` only, per SPEC line 264. Use `--motion-hover-*` tokens.

**Controls row + responsive card sizing** — `.controls { display:flex; justify-content:space-between; align-items:center; gap:var(--space-content-gap); margin-top:var(--space-content-gap); }`. Under 560px: `.cell { flex-basis: 78vw; } .card { height: 104vw; }` (SPEC line 275). Responsive media-query syntax `@media (width < 768px)` copy from `FooterCta.module.css:27,70`.

**Reduced-motion guard** (copy `FooterCta.module.css:166-177` / `FeatureSpotlight.module.css:76-88`):
```css
@media (prefers-reduced-motion: reduce) {
  .rise { transition: none !important; opacity: 1 !important; transform: none !important; }
  .card, .media img, .dot, .navBtn { transition: none !important; transform: none !important; }
}
```
`scrollToIndex` JS-side uses `behavior:'auto'` under reduced motion (component, above).

---

### `CrashCourseRail.stories.tsx` (story)

**Analog:** `src/system/examples/FooterCta/stories.tsx` (exact)

Copy the meta/story shape from `FooterCta.stories.tsx:1-67`:
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CrashCourseRail } from './CrashCourseRail'
import type { CrashCourseRailContent } from './types'
import { IMAGES } from '../../../stories/_fixtures/images'

const content: CrashCourseRailContent = { /* 8 cards from SPEC Copywriting Contract lines 293-300 */ }

const meta: Meta<typeof CrashCourseRail> = {
  title: 'Examples/CrashCourseRail',
  component: CrashCourseRail,
  parameters: { layout: 'fullscreen' }
}
export default meta
type S = StoryObj<typeof CrashCourseRail>
export const Default: S = { args: { content } }
export const FewCards: S = { args: { content: { ...content, cards: content.cards.slice(0, 3) } } }
```
`title: 'Examples/X'`, `parameters: { layout: 'fullscreen' }`, `type S = StoryObj<...>` pattern is verbatim `FooterCta.stories.tsx:56-67`. Image-fixture import path `../../../stories/_fixtures/images` verbatim from `FooterCta.stories.tsx:4`.

**Available fixture keys (verified `_fixtures/images.ts:4-13`):** `water`, `portrait`, `archipelago`, `city`, `industry`, `mtgHeroCoat`, `mtgHeroDadKid`, `mtgHeroCouch`. **There are only 8 keys and 8 cards** — map one per card (e.g. archipelago→Archipelago days, water→Cold swims, city→Långgatorna), reusing any key as needed. SPEC line 68 suggested `IMAGES.archipelago`, `IMAGES.water`, `IMAGES.city` — all exist. The second `FewCards` story proves dots scale + prev/next disable (SPEC line 68).

---

### `CrashCourseRail.test.tsx` (test)

**Analog:** `src/system/examples/FooterCta/FooterCta.test.tsx` (exact — MockObserver + role queries)

Copy the `MockObserver` stub + `beforeEach` verbatim from `FooterCta.test.tsx:9-18`:
```tsx
class MockObserver { observe = vi.fn(); unobserve = vi.fn(); disconnect = vi.fn() }
beforeEach(() => {
  ;(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    MockObserver as unknown as typeof IntersectionObserver
})
```
Query patterns to copy from `FooterCta.test.tsx`:
- `screen.getByText(...)` for eyebrow/heading/lead (`:50-55`)
- `screen.getByRole('heading', { level: 2 })` for the `<h2>` heading (`:70-73`)
- `screen.getByRole('link', { name: /…/i })` + `toHaveAttribute('href', …)` for `<a href>` cards (`:64-68`)
- "content without motion (no-IO baseline)" test (`:93-97`)

**NEW assertions (no analog — SPEC line 69):** `<nav>` has accessible name (`getByRole('navigation', { name: /pagination/i })`); one dot button per card; first dot has `aria-current="true"`; prev button `disabled` at start (`getByRole('button', { name: /previous/i })` → `toBeDisabled()`); card with no `href` is NOT a link (`queryByRole('link')` returns null for that title). **jsdom has no real scroll/`scrollTo`** — assert handler wiring via a `scrollTo` mock or via post-click `aria-current` state, NOT real scroll position (SPEC line 69; same "comment non-obvious test limitation" convention as `ThemedAccordion.test.tsx`, CONVENTIONS.md:89). Add a one-line comment noting the jsdom limitation, mirroring `FooterCta.test.tsx:6-8,94`.

---

### `index.ts` (barrel)

**Analog:** `src/system/examples/FooterCta/index.ts` (exact)

Copy verbatim, renamed (`FooterCta/index.ts:1-2`):
```ts
export { CrashCourseRail, type CrashCourseRailProps } from './CrashCourseRail'
export type { CrashCourseRailContent } from './types'
```

---

## Shared Patterns

### Example-block banner comment
**Source:** `FooterCta.tsx:1-2`, `FeatureSpotlight.tsx:1-2`
**Apply to:** `CrashCourseRail.tsx` (top of file)
```tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.
```
Required by CONVENTIONS.md:88.

### Plain-wrapper `--rise-d` stagger (Text cannot carry `style`)
**Source:** `FooterCta.tsx:49-58` + `FooterCta.module.css:36-45`
**Apply to:** header eyebrow/heading/lead only (rail is NOT reveal-gated)

### `useReveal` ref on inner `<div>`, gated `revealed` class
**Source:** `FeatureSpotlight.tsx:12,27-28` + `:48` CSS gate
**Apply to:** header wrapper `<div>` (Section has no ref forwarding)

### rAF-throttled passive scroll listener with cleanup
**Source (shape only):** `NeighborhoodPaginator.tsx:35-36,100-114`
**Apply to:** component-local `scrollLeft` tracking (adapt vertical→horizontal). Reuse the `rafRef` guard, `{ passive: true }`, `cancelAnimationFrame` cleanup, `typeof window === 'undefined'` guard.

### reduced-motion `matchMedia` check
**Source:** `useReveal.ts:3-7`
**Apply to:** `scrollToIndex` (`behavior: reduce ? 'auto' : 'smooth'`) and the CSS `@media (prefers-reduced-motion: reduce)` block.

### aria-current pagination (NOT tablist)
**Source:** `NeighborhoodPaginator.tsx:122-146`
**Apply to:** the dot `<nav>` (D-2). Active-widens-to-pill is CSS.

### Figure-wrapper image fill (Image ships `height:auto`)
**Source:** `FeatureSpotlight.module.css:25-31`, `NeighborhoodCard.module.css:23-28`
**Apply to:** `.media img { width:100%; height:100%; object-fit:cover }` — mandatory override.

### Dark image scrim via tokens
**Source:** `NeighborhoodCard.module.css:40` (`color-mix(in oklch, var(--color-text-default) 86%, transparent)`)
**Apply to:** card `::after` gradient. Alt token `--color-overlay-scrim` (= `rgba(42,32,32,0.85)`) also emits. Caption uses `--color-text-on-dark`.

### Block-local inline SVG (aria-hidden, focusable="false")
**Source:** `FooterCta.tsx:71-83` (wordmark svg)
**Apply to:** the two prev/next chevrons (Icon has no chevron glyph).

### calc-radius idiom for large radii
**Source:** `FooterCta.module.css:55,78`, `FeatureSpotlight.module.css:17`
**Apply to:** `.card { border-radius: calc(var(--radius-lg) * 1.5) }`.

### Token-only hover lift
**Source:** `FooterCta.module.css:97-101` (`translateY(calc(var(--space-1) * -0.5))`)
**Apply to:** `.navBtn` hover (SPEC line 265 mandates this over raw scale).

---

## No Analog Found

| Pattern | Why no analog | Planner guidance |
|---------|---------------|------------------|
| **Horizontal scroll-snap rail** (`overflow-x:auto; scroll-snap-type: x mandatory; scroll-snap-align: start; hidden scrollbar`) | Verified by grep: `scroll-snap`, `overflow-x`, `overflow:auto`, `scrollLeft` appear **nowhere** in `src/`. This is a first-of-its-kind interaction. | Author from SPEC §Motion (line 260) + the `.rail`/`.cell` CSS sketched above. Confirmed safe: no ancestor sets `overflow:hidden` (`Section.module.css`, `Container.module.css` checked). |
| **Component-local `scrollLeft` active-index tracking** | `NeighborhoodPaginator` tracks `window.scrollY` (vertical page); `useScrollSections` is a vertical-page hook (verified `useScrollSections.ts:34` `rootMargin '-50% 0% -50% 0%'`). Neither reads a horizontal container's `scrollLeft`. | Adapt the `NeighborhoodPaginator.tsx:35-114` *shape* (rafRef, passive listener, cleanup) to read `railRef.current.scrollLeft / step`. ~15 lines, component-local (D-5 — no new hook). |
| **`ArrowLeft/Right`/`Home/End` keyboard on a scroll region** | No keyboard-driven scroll region exists in the codebase. | Author `onKeyDown` on the `<ul tabIndex={0}>` rail per SPEC line 278. |
| **Prev/next chevron glyphs** | `Icon` glyph set is `arrow-right`, `check`, `map-pin` only (verified `Icon.tsx:7`; `icons/` dir has 3 files). `ArrowRight` is a straight arrow, not a chevron, and is reserved for card "Read more". | Author two block-local inline chevron `<svg aria-hidden focusable="false">` (left + right). `aria-label` on the `<button>`. Do NOT add a glyph to `Icon` for one block (SPEC line 50, 168). |

---

## Metadata

**Analog search scope:** `src/system/examples/{FeatureSpotlight,FooterCta,MTGNeighborhoods}/`, `src/system/primitives/`, `src/system/hooks/`, `src/tokens/{primitives,semantic,themes,generated}/`, `src/stories/_fixtures/`
**Files scanned:** ~24 (3 example blocks incl. all MTGNeighborhoods siblings, 8 primitives, useReveal + useScrollSections, radius/space/motion/color/themes tokens + generated CSS, images fixture)
**Codebase-wide greps:** `scroll-snap`, `overflow-x`, `scrollLeft` (all zero hits — confirms the rail interaction is new)
**Pattern extraction date:** 2026-06-03
