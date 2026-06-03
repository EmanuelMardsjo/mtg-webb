# Phase 1: Live-the-life Feature block (FeatureSpotlight) - Pattern Map

**Mapped:** 2026-06-03
**Files analyzed:** 9 (6 example-block files + 3 hook files)
**Analogs found:** 9 / 9

> Every new file has a strong in-repo analog. The executor should copy the cited
> excerpts almost verbatim, swapping names/content. Two load-bearing corrections to
> the UI-SPEC are flagged below (`--card-radius` is not a real token; `Image` cannot
> express the `1312/611` aspect — both resolved here).

---

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `src/system/examples/FeatureSpotlight/FeatureSpotlight.tsx` | component (example block) | request-response (static content prop) | `src/system/examples/EditorialText/EditorialText.tsx` (composition) + `src/stories/foundations/Motion.stories.tsx` `RevealDemo` (reveal wiring) + `src/system/examples/JourneyPanel/JourneyPanel.tsx` (`--rd` stagger) | exact (composite) |
| `src/system/examples/FeatureSpotlight/types.ts` | model (CMS content shape) | transform | `src/system/examples/EditorialText/types.ts` | exact |
| `src/system/examples/FeatureSpotlight/FeatureSpotlight.module.css` | config (CSS Module) | transform | `src/system/examples/MTGHero/MTGHero.module.css` (CSS-var + reduced-motion guard) | role-match |
| `src/system/examples/FeatureSpotlight/FeatureSpotlight.stories.tsx` | test (story) | request-response | `src/system/examples/EditorialText/EditorialText.stories.tsx` + `src/system/examples/MTGHero/MTGHero.stories.tsx` (fixtures) | exact |
| `src/system/examples/FeatureSpotlight/FeatureSpotlight.test.tsx` | test | request-response | `src/system/examples/MTGHero/MTGHero.test.tsx` + `src/system/examples/EditorialText/EditorialText.test.tsx` | exact |
| `src/system/examples/FeatureSpotlight/index.ts` | config (barrel) | — | `src/system/examples/MTGHero/index.ts` | exact |
| `src/system/hooks/useParallax.ts` | hook | event-driven (scroll + rAF) | `src/system/hooks/useScrollFade.ts` (scroll/rAF/reduced-motion) + `src/system/hooks/useMagneticLean.ts` (writes CSS vars on the node) | exact (composite) |
| `src/system/hooks/useParallax.test.tsx` | test | event-driven | `src/system/hooks/useScrollFade.test.tsx` + `src/system/hooks/useReveal.test.tsx` | exact |
| `src/system/hooks/index.ts` (modify) | config (barrel) | — | existing `src/system/hooks/index.ts` | exact |

---

## Pattern Assignments

### `src/system/hooks/useParallax.ts` (hook, event-driven)

**Primary analog:** `src/system/hooks/useScrollFade.ts` (scroll + rAF + reduced-motion).
**Secondary analog:** `src/system/hooks/useMagneticLean.ts` (writes CSS custom properties directly on the DOM node — no re-render).

The spec wants the hook to expose per-layer drift via CSS custom properties on the block root (`--parallax-text`, `--parallax-frame`, `--parallax-img`). That is exactly the `useMagneticLean` `--mx`/`--my` model, driven by the `useScrollFade` rAF-throttled scroll listener. Combine the two: take the scroll/lifecycle skeleton from `useScrollFade`, and the `style.setProperty` write pattern from `useMagneticLean`. **Do not** call `setState` per scroll frame (the spec wants smoothed CSS-var writes, not re-renders) — write to the ref node like `useMagneticLean`.

**Reduced-motion guard — copy verbatim** (`useScrollFade.ts` lines 3-7; identical in `useReveal.ts`):
```ts
function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
```
Note `useMagneticLean.ts` lines 3-7 has a richer `isReduced()` that also honors the `force-reduced-motion` class set by the Storybook toolbar decorator (`.storybook/decorators/withReducedMotion.tsx`). **Prefer the `useMagneticLean` form** so the Storybook reduced-motion toolbar actually disables parallax in stories:
```ts
function isReduced(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('force-reduced-motion')) return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}
```

**Scroll + rAF lifecycle — mirror** (`useScrollFade.ts` lines 13-39). Early-return under reduced motion (no listener attached → fully static, satisfies REQ-04):
```ts
useEffect(() => {
  if (isReduced()) return            // REQ-04: no listener, zero offsets, fully static
  const el = ref.current
  if (!el) return

  let raf = 0
  function onScroll() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      const target = ref.current
      if (!target) return
      const rect = target.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const p = Math.min(1, Math.max(0, 1 - rect.top / vh))   // 0→1 progress
      // restrained translateY only — no scale/rotate (brand motion guardrail)
      target.style.setProperty('--parallax-text', `${(p * TEXT_DRIFT).toFixed(2)}px`)
      target.style.setProperty('--parallax-frame', `${(p * FRAME_DRIFT).toFixed(2)}px`)
      target.style.setProperty('--parallax-img', `${(p * IMG_DRIFT).toFixed(2)}px`)
    })
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    cancelAnimationFrame(raf)
  }
}, [])
```

**Module constants — uppercase per CONVENTIONS** (cf. `DEFAULT_ROOT_MARGIN` in `useReveal.ts` line 17). Keep drift magnitudes small/restrained (source used ~34px text / ~64px media):
```ts
const TEXT_DRIFT = -18    // px, restrained translateY only
const FRAME_DRIFT = -28
const IMG_DRIFT = -40
```

**Return shape — mirror `useScrollFade`/`useReveal`** (return `{ ref }`; CSS vars are written to the node, nothing rendered from state):
```ts
export function useParallax() {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => { /* … */ }, [])
  return { ref }
}
```
TSDoc the hook like `useMagneticLean` (lines 14-20): a short block explaining it writes `--parallax-*` vars on the node and that the CSS module consumes them; disabled under reduced motion. Hook file is `.ts` (no JSX) like `useScrollFade.ts`/`useReveal.ts`.

> If the spec's "smoothed progress/offset value" is also wanted as a return, expose a
> ref-stored value, not React state — never `setState` per frame.

---

### `src/system/hooks/useParallax.test.tsx` (test, event-driven)

**Analog:** `src/system/hooks/useScrollFade.test.tsx` (full file — it is only 16 lines).

That test renders a tiny `Comp` that uses the hook and asserts the initial state in jsdom (no scroll). Since `useParallax` writes CSS vars rather than returning a number, assert the initial inline custom-property value on the node. Mirror the `Comp` harness pattern from `useReveal.test.tsx` lines 22-25.

**Harness pattern** (from `useScrollFade.test.tsx` lines 5-15):
```tsx
function Comp() {
  const { ref } = useParallax()
  return <div ref={ref} data-testid="px">x</div>
}

describe('useParallax', () => {
  it('does not throw and attaches a ref in jsdom', () => {
    const { getByTestId } = render(<Comp />)
    expect(getByTestId('px')).toBeInTheDocument()
  })
})
```
Also add a reduced-motion test: set `document.documentElement.classList.add('force-reduced-motion')` before render and assert the parallax vars are unset/zero (no listener path). jsdom has no real scroll; do not try to simulate smoothed drift — assert the static/guard behavior only, matching how `useScrollFade.test.tsx` only checks the initial value.

---

### `src/system/hooks/index.ts` (barrel, modify)

**Analog:** the file itself. Append one line in the existing style (named export, no semicolon):
```ts
export { useParallax } from './useParallax'
```
Place it next to the other scroll/motion hooks (after `useScrollFade` / `useMagneticLean`).

---

### `src/system/examples/FeatureSpotlight/FeatureSpotlight.tsx` (component, request-response)

**Composition analog:** `EditorialText.tsx` (whole file — the `{ content }` + `Section`→`Container`→`Stack`→`Text` idiom).
**Reveal-wiring analog:** `Motion.stories.tsx` `RevealDemo` (lines 105-119).
**Stagger analog:** `JourneyPanel.tsx` (`staggerReveal` / `--rd` inline custom property, lines 67-68, 106-108).

**Banner comment — required, copy verbatim** (`EditorialText.tsx` lines 1-2, identical in every example block):
```tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.
```

**Imports — alias order per CONVENTIONS** (cf. `EditorialText.tsx` lines 4-5, `MTGHero.tsx` lines 4-9):
```tsx
import { Section, Container, Stack, Text, Image, Icon } from '@system/primitives'
import { useReveal, useParallax } from '@system/hooks'
import type { FeatureSpotlightContent } from './types'
import s from './FeatureSpotlight.module.css'
```

**Props type — mirror `EditorialText.tsx` line 7 / `MTGHero.tsx` lines 17-20** (single `content` object; this block has no callbacks like MTGHero's `onSubmit`, so keep it as simple as `EditorialText`):
```tsx
export type FeatureSpotlightProps = { content: FeatureSpotlightContent }
```

**Reveal hook usage — mirror `RevealDemo`** (`Motion.stories.tsx` lines 106-114). Call `useReveal()` once; apply a `revealed` class on the root. The hidden pre-state lives in CSS `.rise`, so prefer a class toggle over inline style here:
```tsx
export function FeatureSpotlight({ content }: FeatureSpotlightProps) {
  const { ref: revealRef, revealed } = useReveal()
  const { ref: parallaxRef } = useParallax()
  // …compose; apply `revealed` class + attach both refs to the block root
}
```
> **Two refs, one root node.** `useReveal` returns a `RefObject<HTMLDivElement>` and so
> does `useParallax`. To attach both to the same element, use a small merged-ref callback
> (`el => { revealRef.current = el; parallaxRef.current = el }`). There is no existing
> merge-ref helper in the repo, so inline the callback — do not add a utility for one use.

**Stagger via inline CSS custom property — mirror `JourneyPanel.tsx` lines 67-68 + 106-108** (typed `CSSProperties` cast for the custom prop, the project's documented dynamic-value idiom per CONVENTIONS line 41):
```tsx
import { type CSSProperties } from 'react'
// per child, in stagger order eyebrow→headline→lead→CTA→media:
const riseStyle = (d: number): CSSProperties => ({ '--rise-d': `${d}ms` } as CSSProperties)
// …
<Text role="tag" className={s.rise} ...>{content.eyebrow}</Text>     // style={riseStyle(0)}
// headline 90, lead 180, cta 270, media 360 (source 0/90/180/270/360)
```

**Composition target** (from UI-SPEC §Component Anatomy; primitives verified below). Headline MUST render `<h2>` per a11y note → `Text role="display" as="h2"`:
```tsx
<Section theme={content.theme ?? 'pink-soft'} spacing="lg">
  <Container size="default">
    <Stack gap="loose" align="center" className={s.editorial}>
      <Text role="tag" className={s.rise} style={riseStyle(0)}>{content.eyebrow}</Text>
      <Text role="display" as="h2" id={headingId} className={s.rise} style={riseStyle(90)}>{content.headline}</Text>
      <Text role="lead" className={s.rise} style={riseStyle(180)}>{content.lead}</Text>
      <a href={content.cta.href} className={`${s.cta} ${s.rise}`} style={riseStyle(270)}>
        <Text role="button" as="span">{content.cta.label}</Text>
        <Icon name="arrow-right" size="md" />
      </a>
    </Stack>
    <figure className={`${s.frame} ${s.rise}`} style={riseStyle(360)}>
      <Image src={content.image.src} alt={content.image.alt} focalPoint="center" loading="lazy" />
    </figure>
  </Container>
</Section>
```

**Verified primitive prop contracts** (so the executor does not guess):
- `Section` (`Section.tsx` lines 7-15): `theme?: ThemeName`, `spacing?: 'sm'|'md'|'lg'|'xl'`, spreads `...rest` onto `<section>`, sets `data-theme`. Use `spacing="lg"`. To attach the merged ref + `aria-labelledby`, pass them through `...rest` (Section forwards arbitrary `HTMLAttributes`). **Note `Section` does NOT forward a `ref`** (it is a plain function component) — so attach `revealRef`/`parallaxRef`/`className`/`aria-labelledby` via the props it spreads, OR wrap the inner content. Simplest: set the reveal/parallax root on the block via `ref` is not possible on `Section`; attach the merged ref to a wrapping element or to `Container`'s rendered node is also not ref-forwarded. **Resolution:** render an explicit root the hooks can ref — e.g. keep `Section` and put the merged ref + `revealed` class on it through `...rest` is invalid (no ref). Instead, the cleanest in-repo-consistent move is: `Section` accepts arbitrary attrs but not `ref`; the `--parallax-*`/`revealed` root should be the `<section>`. Since neither `Section` nor `Container` forwards refs, attach the merged ref to the `figure`/wrapper is wrong. **Use this:** wrap the whole block in a bare `<div ref={mergedRef} className={revealed ? s.revealed : undefined}>` placed INSIDE nothing — i.e. make the outermost element a `Section` and accept that parallax vars must live on a child. See the CSS note: set `--parallax-*` and `revealed` on a single wrapper `<div>` that contains `Section`, OR on `Section` via a tiny local ref-forwarding. The pre-existing pattern (`MTGHero.tsx` line 36) attaches the ref to a plain `<main className={s.hero} ref={heroRef}>`, NOT to a primitive. **Mirror MTGHero: the ref-bearing root is a plain element, the primitives sit inside it.**
- `Container` (`Container.tsx` lines 6-13): `size?: 'prose'|'default'|'wide'|'bleed'`. Use `size="default"`.
- `Stack` (`Stack.tsx` lines 4-15): `gap?: 'tight'|'snug'|'default'|'loose'|'xl'`, `align?: 'start'|'center'|'end'|'stretch'`, accepts `className`. Use `gap="loose" align="center"`.
- `Text` (`Text.tsx` lines 5-31): `role` + optional `as`. `role="display"` defaults to `<h1>` — **must pass `as="h2"`**. `Text` has NO `id`/style passthrough — only `className`, `tone`, `as`, `children`. **The headline `id` (for `aria-labelledby`) cannot be set via `Text`.** Either render the headline heading directly (`<h2 id={headingId} className={...}>`) styled with the role class, or wrap. Cleanest: use `Text role="display" as="h2"` for styling and put `id` on a wrapping element the `aria-labelledby` points to — but `aria-labelledby` must target the element with the accessible name. **Resolution:** render the headline as a plain `<h2 id={headingId} className={s.headlineClassFromText}>` is not possible (role classes are CSS-module-scoped to Text). Pragmatic fix consistent with the repo: keep `Text role="display" as="h2"` and give the *Section/root* `aria-label={content.headline}` instead of `aria-labelledby` — simpler and avoids the `id` plumbing the `Text` primitive does not support. Flag this as a minor a11y-equivalent deviation for the planner.
- `Image` (`Image.tsx` lines 4-22): `aspect` is a **named token only** (`square|portrait|landscape|wide|cinematic`) — it **cannot** express `1312/611` or `4/5`. So **do not pass `aspect`** for the source ratios; control the media ratio with `aspect-ratio` on the `.frame` figure in CSS (see CSS section). `Image` supports `focalPoint="center"`, `loading="lazy"`, `radius`. The frame radius/clip goes on the `figure`, not the `Image`.
- `Icon` (`Icon.tsx` lines 7-29): `name: 'arrow-right'|'check'|'map-pin'`, `size?: 'sm'|'md'|'lg'`. Use `<Icon name="arrow-right" size="md" />`.

---

### `src/system/examples/FeatureSpotlight/types.ts` (model)

**Analog:** `EditorialText/types.ts` (whole file — 8 lines). Same `import type { ThemeName }` + `{ComponentName}Content` shape with optional `theme`:
```ts
import type { ThemeName } from '@tokens/themes'

export type FeatureSpotlightContent = {
  eyebrow: string
  headline: string
  lead: string
  cta: { label: string; href: string }
  image: { src: string; alt: string }
  theme?: ThemeName
}
```
(Use the exact shape from UI-SPEC §FeatureSpotlightContent. `image` mirrors the `HeroImage` `{ src; alt }` shape in `MTGHero/types.ts` lines 1-4.)

---

### `src/system/examples/FeatureSpotlight/FeatureSpotlight.module.css` (config)

**Analog:** `MTGHero.module.css` — it is the only example-block CSS with the CSS-custom-property + `prefers-reduced-motion` guard pattern this block needs.

**CSS-var consumption pattern — mirror `MTGHero.module.css` lines 45-60** (declare the var with a fallback on the element, then consume it in `transform: translate3d(...)`). The parallax layers consume `--parallax-text/-frame/-img` written by the hook:
```css
.editorial { transform: translate3d(0, var(--parallax-text, 0px), 0); }
.frame     { transform: translate3d(0, var(--parallax-frame, 0px), 0); }
.frame img { transform: translate3d(0, var(--parallax-img, 0px), 0); }  /* extra inner drift */
```
Declare a sensible default (`--parallax-*: 0px`) on the root, like `.card { --mx:0px; --my:0px }` (lines 52-53), so SSR/no-JS is static.

**Media frame** — UI-SPEC says `border-radius: var(--card-radius)`, but **`--card-radius` is NOT a real token** (verified absent from `tokens.css`). MTGHero defines "card radius" as `calc(var(--radius-lg) * 2)` (`MTGHero.module.css` lines 1, 46). **Mirror that:**
```css
.frame {
  border-radius: calc(var(--radius-lg) * 2);   /* = card radius, per MTGHero */
  overflow: clip;
  background: var(--color-surface-raised);      /* shows while image loads (UI-SPEC color table) */
  aspect-ratio: 1312 / 611;                     /* set HERE — Image primitive can't express it */
  margin: 0;
}
.frame img { width: 100%; height: 100%; object-fit: cover; display: block; }  /* MTGHero lines 62-67 */

@media (width < 768px) {
  .frame { aspect-ratio: 4 / 5; }
}
```

**Rise / staggered entrance** — base style is the visible end-state; hidden pre-state only applies when the root is NOT `.revealed` (so no-JS shows content). Use the reveal motion tokens (`--motion-reveal-duration` / `--motion-reveal-easing`, confirmed in `tokens.css`) and the per-child `--rise-d` set inline by the component:
```css
.rise {
  transition:
    opacity var(--motion-reveal-duration) var(--motion-reveal-easing) var(--rise-d, 0ms),
    transform var(--motion-reveal-duration) var(--motion-reveal-easing) var(--rise-d, 0ms);
}
/* hidden pre-state: only before reveal (JS ran) — not the no-JS baseline */
:not(.revealed) > .rise { opacity: 0; transform: translateY(var(--space-3)); }
```
> Adjust the `:not(.revealed)` selector to match however the root `revealed` class
> is structured; the principle (visible = base, hidden = guarded) comes from UI-SPEC
> Motion row 1.

**CTA filled pill** (D-2, block-local; UI-SPEC §Color/§Interaction). Accent-by-inversion, hover only under `@media (hover: hover)`:
```css
.cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-inline-default);
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-pill);
  background: var(--color-text-default);
  color: var(--color-surface-page);
  text-decoration: none;
  transition: opacity var(--motion-hover-duration) var(--motion-hover-easing),
              transform var(--motion-hover-duration) var(--motion-hover-easing);
}
@media (hover: hover) {
  .cta:hover { opacity: 0.9; transform: translateY(-1px); }
}
```
(`MTGHero.module.css` lines 152-187 `.pillSend` is the in-repo precedent for an inverted `background: var(--color-text-default); color: var(--color-surface-page)` control + icon sizing.)

**Reduced-motion guard — copy the structure of `MTGHero.module.css` lines 296-308.** Kill rise transitions AND parallax transforms so the block is fully static (REQ-04 + success criterion 2):
```css
@media (prefers-reduced-motion: reduce) {
  .rise { transition: none !important; opacity: 1 !important; transform: none !important; }
  .editorial, .frame, .frame img { transform: none !important; }
}
```

**Constraints (ESLint/Stylelint enforced — CONVENTIONS lines 50-51):** no raw hex, no raw `px` string literals in `.ts`/`.tsx` (the inline `--rise-d` ms strings are fine; the px drift strings are built in the hook `.ts` which is under `src/system/**` — use template strings with numeric vars as shown, NOT bare `'18px'` literals, to stay clear of `no-restricted-syntax`). All spacing/radius/color in CSS via tokens only. Responsive padding flows through `Section`/`Container`; only add breakpoint rules for the frame aspect ratio.

---

### `src/system/examples/FeatureSpotlight/FeatureSpotlight.stories.tsx` (test/story)

**Analogs:** `EditorialText.stories.tsx` (default + theme-variant story shape) + `MTGHero.stories.tsx` lines 1-12 (importing `IMAGES` fixture; relative path `../../../stories/_fixtures/images`).

**Meta + story shape — mirror `EditorialText.stories.tsx` lines 8-13:**
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { FeatureSpotlight } from './FeatureSpotlight'
import { IMAGES } from '../../../stories/_fixtures/images'

const meta: Meta<typeof FeatureSpotlight> = { title: 'Examples/FeatureSpotlight', component: FeatureSpotlight }
export default meta
type S = StoryObj<typeof FeatureSpotlight>
```

**Default story** uses the seeded copy from UI-SPEC §Copywriting Contract (eyebrow `№ 01 — A life, not just a job`, headline with line break before "been", the lead paragraph, CTA `Explore the life`) and a fixture image (e.g. `IMAGES.water` or `IMAGES.portrait` — pick a warm editorial image; `IMAGES` shape is `{ src, alt }`, exactly the `content.image` shape). Add a `pink-soft` themed default and one alternate-theme story (UI-SPEC §stories). Reduced motion is handled by the global Storybook toolbar decorator — do NOT add a reduced-motion story (cf. how no example block hand-rolls one). `MTGHero.stories.tsx` line 18 shows `parameters: { layout: 'fullscreen' }` if a full-bleed preview is wanted; `EditorialText` omits it — choose per visual intent.

---

### `src/system/examples/FeatureSpotlight/FeatureSpotlight.test.tsx` (test)

**Analogs:** `MTGHero.test.tsx` (render + `getByText`/`getByAltText`/href assertions) + `EditorialText.test.tsx` (minimal `{ content }` render).

**Mirror `MTGHero.test.tsx` lines 1-29 structure** (build a `content` object, render, assert text + alt). Add:
- eyebrow / headline / lead text present (`screen.getByText`)
- image `alt` present (`screen.getByAltText`, cf. MTGHero lines 24-28)
- CTA label present and its `href` (assert `closest('a')` / `getByRole('link')` has the expected `href`)
- **content visible without motion baseline** (UI-SPEC test contract): in jsdom there is no `IntersectionObserver` by default — `useReveal` will not flip `revealed`, but the CSS hidden pre-state is CSS-only (not applied in jsdom), so `getByText` still finds the nodes. Assert the text is in the document (the no-motion baseline). Do NOT mock the observer unless asserting the revealed class specifically; `MTGHero.test.tsx` does not mock it.
```tsx
const content: FeatureSpotlightContent = {
  eyebrow: '№ 01 — A life, not just a job',
  headline: "Live the life you've been saving for later.",
  lead: 'The slower evenings…',
  cta: { label: 'Explore the life', href: '/life' },
  image: { src: '/x.webp', alt: 'A warm domestic scene' }
}
// render, then assert eyebrow/headline/lead/cta text, image alt, and link href
```

---

### `src/system/examples/FeatureSpotlight/index.ts` (barrel)

**Analog:** `MTGHero/index.ts` (lines 1-2) / `EditorialText/index.ts`. Named exports, no semicolons. Per UI-SPEC:
```ts
export { FeatureSpotlight, type FeatureSpotlightProps } from './FeatureSpotlight'
export type { FeatureSpotlightContent } from './types'
```

---

## Shared Patterns

### Reduced-motion guard (cross-cutting)
**Source:** `src/system/hooks/useScrollFade.ts` lines 3-7 (simple) and `src/system/hooks/useMagneticLean.ts` lines 3-7 (also honors the `force-reduced-motion` Storybook class).
**Apply to:** `useParallax.ts` (prefer the `useMagneticLean` form), `FeatureSpotlight.module.css` `@media (prefers-reduced-motion: reduce)` block.
The `useReveal` hook already returns `revealed: true` at mount under reduced motion (`useReveal.ts` line 22) — so no extra work in the component; just ensure CSS visible-base + the media-query guard.

### CSS custom property dynamic values (cross-cutting)
**Source:** `src/system/examples/JourneyPanel/JourneyPanel.tsx` lines 67-68, 106-108 (inline `{ '--rd': '…' } as CSSProperties`) and `src/system/hooks/useMagneticLean.ts` lines 52-53 (`el.style.setProperty('--mx', …)`).
**Apply to:** component (`--rise-d` stagger via inline style) and hook (`--parallax-*` via `setProperty`). This is the project's documented dynamic-value idiom (CONVENTIONS line 41) — never generate dynamic CSS classes.

### Example-block file anatomy (cross-cutting)
**Source:** `src/system/examples/MTGHero/` (6-file folder) + `src/system/examples/EditorialText/`.
**Apply to:** all 6 FeatureSpotlight files. Banner comment on the `.tsx`, `s` import alias for the CSS module, named exports, co-located test/story, `types.ts` for the content shape, `index.ts` barrel.

### Class-name composition (cross-cutting)
**Source:** `Text.tsx` line 29, `Section.tsx` line 16, `JourneyPanel.tsx` lines 100-105 — `[a, cond && b, className].filter(Boolean).join(' ')`.
**Apply to:** combining `.rise` + `.revealed` + state classes in the component.

---

## No Analog Found

None. Every file maps to a strong in-repo precedent.

---

## Flagged Corrections for the Planner (load-bearing)

1. **`--card-radius` does not exist.** UI-SPEC §Interaction references `var(--card-radius)`; it is not in `tokens.css`. Use `calc(var(--radius-lg) * 2)` — the exact "card radius" expression MTGHero uses (`MTGHero.module.css` lines 1, 46).
2. **`Image` cannot express `1312/611` / `4/5`.** Its `aspect` prop is a named-token union (`square|portrait|landscape|wide|cinematic`). Set the media ratio with `aspect-ratio` on the `.frame` `figure` in CSS instead; do not pass `aspect` to `Image` for the source ratios.
3. **`Text` exposes no `id` and no inline-style passthrough.** The `aria-labelledby`→headline-`id` plan in UI-SPEC §Accessibility cannot use the `Text` primitive's element for the `id`. Recommend `aria-label={content.headline}` on the Section/root as an equivalent accessible name, OR render the headline as a bare `<h2 id=…>` (losing the role class). Planner to choose.
4. **`Section`/`Container` do not forward `ref`.** The `useReveal`+`useParallax` merged ref must attach to a plain element, exactly like MTGHero attaches `heroRef` to `<main className={s.hero} ref={heroRef}>` (`MTGHero.tsx` line 36). Make the parallax/reveal root a plain ref-bearing element; primitives nest inside it.
5. **Two hooks, one root → inline merged-ref callback.** No merge-ref utility exists; inline `el => { aRef.current = el; bRef.current = el }`. Do not add a helper for one use (CONVENTIONS / STRUCTURE "avoid utility folders until repeated").

---

## Metadata

**Analog search scope:** `src/system/examples/` (MTGHero, EditorialText, JourneyPanel), `src/system/hooks/` (useReveal, useScrollFade, useMagneticLean, index), `src/system/primitives/` (Section, Container, Stack, Text, Image, Icon, index), `src/stories/foundations/Motion.stories.tsx`, `src/stories/_fixtures/images.ts`, `src/tokens/generated/tokens.css`, `src/tokens/semantic/motion.ts`.
**Files scanned:** ~22
**Pattern extraction date:** 2026-06-03
