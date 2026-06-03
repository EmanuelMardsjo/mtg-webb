# Phase 4: Resident Stories block — Pattern Map

**Mapped:** 2026-06-03
**Files analyzed:** 6 new files (one new folder `src/system/examples/ResidentStories/`)
**Analogs found:** 6 / 6 (all have strong analogs — no greenfield mechanics)

This block is an **adaptation**, not greenfield. The sticky scroll mechanics it needs already ship in `MTGNeighborhoods` and reuse `useScrollSections`. The file anatomy/idiom (banner, types, story, test stub, token-only CSS, `.rise` stagger) comes from `CrashCourseRail` + `FeatureSpotlight`. The planner should **mirror proven code**, not author scroll math.

---

## Source-Verification Corrections (read first)

I re-verified the UI-SPEC's Primitive Capability Notes + the `useScrollSections` signature against real source. Findings:

1. **`useScrollSections` signature — CONFIRMED EXACT.** `useScrollSections<Id extends string>(ids: readonly Id[], options?) → { activeId, register, scrollTo }` (`useScrollSections.ts:48-52, 28-32`). `register(id)` returns a ref callback that sets `data-section-id` and stores the element in a map (`:77-85`). `activeId` initialises to `ids[0]` (`:53`) — so before any scroll, story 0 is active. The IO uses `rootMargin '-50% 0% -50% 0%'` at the viewport mid-line (`:34, :52`) and picks the entry with the highest `intersectionRatio` (`:61-69`). `scrollTo` uses `behavior: reduced ? 'auto' : 'smooth'` (`:90-91`). **No no-JS/no-IO guard is needed in the component** — the effect early-returns when `IntersectionObserver` is undefined (`:57`), leaving `activeId = ids[0]`. SPEC is accurate.

2. **CORRECTION — progress-fill token.** UI-SPEC §Color (line 234) says the accent fill is `--color-text-default` (dark ink). That is correct for `pink-soft` AND matches the source intent (`#433535` fill). But note the `pink-soft` theme ALSO defines `--color-accent-line: palette.pink[700]` (`themes/index.ts:174`) — the `NeighborhoodPaginator` progress line uses `--color-accent-line` (`NeighborhoodPaginator.module.css:39`). **For this block, follow the SPEC: fill = `--color-text-default`** (the dark editorial ink the source used), track = `color-mix(in oklch, var(--color-text-default) 16%, transparent)` or `--color-border-strong`. Do NOT default-copy the paginator's `--color-accent-line` (that would render the fill pink, not the intended dark ink). Both are token-pure; the SPEC's choice is the faithful one.

3. **CONFIRMED — `--color-border-strong` is a `color-mix`.** `semantic/color.ts:17`: `'border-strong': 'color-mix(in oklch, currentColor 20%, transparent)'`. So `--color-border-strong` resolves to ~20% currentColor — usable directly for the progress track (slightly stronger than the source's 16%; either the SPEC's explicit `color-mix(... 16% ...)` or `--color-border-strong` works, both token-pure).

4. **CONFIRMED — primitive capability notes accurate.** `Text` has NO `style`/`id`/`...rest` (`Text.tsx:19-31`) → `--rise-d` stagger rides plain wrapper `<div>`s. `Section` spreads `...rest` so `aria-label` forwards (`Section.tsx:7, :17-18`), has `theme`+`spacing`+`bleed`+`className`, no ref. `Image` aspect is the named union (no arbitrary ratios), `radius` is `none|sm|md|lg` (`Image.tsx:4-6`); `Image` ships `height:auto` so the figure wrapper must force `object-fit:cover` fill (the `CrashCourseRail.module.css:81-88` precedent). `Icon` glyphs are `arrow-right|check|map-pin` only, renders `role="img"` only with `aria-label` (`Icon.tsx:7, :26`).

5. **CONFIRMED — `pink-soft` theme tokens** (`themes/index.ts:166-177`): `surface-page=pink[200]`, `surface-raised=pink[300]`, `text-default=neutral[800]` (the `#433535` intent), `text-muted=neutral[700]`, `focus-ring=pink[700]`. Exactly as the SPEC §Color maps. No new tokens.

6. **CONFIRMED — image fixtures exist for 3 stories.** `images.ts` has `IMAGES.portrait` (line 6), `IMAGES.mtgFeatureSofa` (line 10), `IMAGES.mtgHeroCoat` (line 12) — the three the SPEC names. Also available: `mtgHeroDadKid`, `mtgHeroCouch`, `water`, `archipelago`, `city`, `industry` for a 4th/extra story. **Enough portraits exist for the default 3-story story and a second 4-story story.** (Note: only `portrait` is literally a person-portrait; the others are warm interior/lifestyle shots — acceptable as resident imagery, matches how `CrashCourseRail.stories.tsx` reuses these.)

---

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `ResidentStories.tsx` | component (example block) | event-driven (IO scroll → activeId → render) | `MTGNeighborhoods.tsx` (mechanics) + `CrashCourseRail.tsx` (anatomy/`.rise`) | exact (mechanics) + exact (idiom) |
| `types.ts` | types (CMS content shape) | n/a | `CrashCourseRail/types.ts` | exact |
| `ResidentStories.module.css` | config (CSS Module, token-only) | n/a | `MTGNeighborhoods.module.css` (sticky stage/track) + `CrashCourseRail.module.css` (`.rise`, figure fill, reduced-motion) | exact (sticky) + exact (idiom) |
| `ResidentStories.stories.tsx` | test/story | n/a | `CrashCourseRail.stories.tsx` (fixtures + 2 stories) + `MTGNeighborhoods.stories.tsx` (`layout:fullscreen`) | exact |
| `ResidentStories.test.tsx` | test | n/a | `CrashCourseRail.test.tsx` (MockObserver + href/article + baseline) | exact |
| `index.ts` | config (barrel) | n/a | `CrashCourseRail/index.ts` + `MTGNeighborhoods/index.ts` | exact |

---

## Pattern Assignments

### `ResidentStories.tsx` (component, event-driven)

**Primary analog (mechanics):** `MTGNeighborhoods.tsx` — copy the `useScrollSections` wiring + the `.block → .stage → .track of register()'d .anchor` structure verbatim. **Anatomy/idiom analog:** `CrashCourseRail.tsx` — copy the banner comment, `riseStyle` helper, the `Tag = href ? 'a' : 'article'` pattern, and the `<Text>`-on-plain-wrapper `.rise` stagger.

**Banner comment** (`MTGNeighborhoods.tsx:1-2`, `CrashCourseRail.tsx:1-2` — identical, REQUIRED per CONVENTIONS.md):
```tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.
```

**Imports** (mix of `MTGNeighborhoods.tsx:4-13` + `CrashCourseRail.tsx:4-8`):
```tsx
import { type CSSProperties } from 'react'
import { Section, Text, Image, Icon } from '@system/primitives'
import { useScrollSections } from '@system/hooks'
import type { ResidentStoriesContent } from './types'
import s from './ResidentStories.module.css'
```
Note: `@system/primitives` + `@system/hooks` aliases (CrashCourseRail uses them); MTGNeighborhoods used relative `../../primitives` — **prefer the `@system/*` alias** (CONVENTIONS.md Import Organization §2, and the newer CrashCourseRail does this).

**`useScrollSections` wiring — copy from `MTGNeighborhoods.tsx:22-32`** (the load-bearing reuse):
```tsx
const { stories } = content
const ids = stories.map((_, i) => `story-${i}`)
const { activeId, register } = useScrollSections<string>(ids)   // NO snap (D-2: un-jacked)
const activeIndex = Math.max(0, ids.indexOf(activeId))
```
Differences from the analog: (a) **do NOT pass `snap`** — MTGNeighborhoods passes `{ snap: {...} }` (`:27`), but D-2 says no viewport nudging for the editorial sequence; (b) you only need `{ activeId, register }`, not `scrollTo` (no jump UI in v1); (c) ids are synthetic `story-${i}` strings, not entity ids.

**`riseStyle` per-piece stagger helper — copy from `CrashCourseRail.tsx:16`:**
```tsx
const riseStyle = (d: number): CSSProperties => ({ '--rise-d': `${d}ms` } as CSSProperties)
```

**Stage + story-panel + track structure — mirror `MTGNeighborhoods.tsx:47-76`** combined with the SPEC §Composition (lines 98-144). The MTGNeighborhoods skeleton to mirror:
```tsx
<Section spacing="sm" theme={active.theme} className={s.section}>
  <div className={s.block}>
    <div className={s.stage}>
      {/* ...absolutely-positioned panels + progress indicator... */}
    </div>
    {/* lg scroll runway: one viewport per neighborhood — drives activeId. */}
    <div className={s.track} aria-hidden>
      {neighborhoods.map(n => (
        <div key={n.id} ref={register(n.id)} className={s.anchor} />
      ))}
    </div>
  </div>
</Section>
```
For ResidentStories: `Section theme={content.theme ?? 'pink-soft'} spacing="sm" aria-label={content.heading ?? 'Stories from people who made the move'}`. Progress indicator (decorative, D-4): `<div className={s.progress} aria-hidden style={{ ['--progress']: (activeIndex + 1) / stories.length } as CSSProperties}><span className={s.progressFill} /></div>`.

**Story panel — `href ? 'a' : 'article'` pattern, copy idiom from `CrashCourseRail.tsx:130-133`:**
```tsx
const Tag = card.href ? 'a' : 'article'
return (
  <li key={i} className={s.cell}>
    <Tag {...(card.href ? { href: card.href } : {})} className={s.card}>
```
For ResidentStories the `Tag` is the panel itself (not wrapped in `<li>` — there's no list, panels are absolutely-positioned siblings in the stage): apply `data-side={story.side ?? (i % 2 ? 'left' : 'right')}` and `className={[s.story, isActive && s.storyActive].filter(Boolean).join(' ')}` where `isActive = ids[i] === activeId`.

**`Text`-on-plain-wrapper `.rise` stagger — copy idiom from `CrashCourseRail.tsx:102-115`** (the comment is load-bearing: explains WHY `Text` can't carry `style`):
```tsx
{/* Text does not accept `style`/`id` — carry the --rise-d stagger on a plain wrapper, the .rise class drives the transition. */}
<div className={s.rise} style={riseStyle(0)}>   <Text role="tag">{story.eyebrow}</Text> </div>
<div className={s.rise} style={riseStyle(90)}>  <Text role="h2" as="h3">{story.headline}</Text> </div>   {/* D-9: role h2, tag h3 */}
<div className={s.rise} style={riseStyle(180)}> <Text role="body" as="p">{story.attribution}</Text> </div>
```
**Headline role = `Text role="h2" as="h3"`** (D-9: display-800 visual at `--fs-2xl`, h3 outline level). Stagger delays 0 / 90 / 180 ms — same triad CrashCourseRail uses (`:104, :108, :112`).

**"Read story" affordance (linked only) — copy from `CrashCourseRail.tsx:146-150`:**
```tsx
{card.href && (
  <span className={s.more}>
    Read more <Icon name="arrow-right" size="sm" aria-hidden />
  </span>
)}
```
For ResidentStories use the copy `Read story` (SPEC line 291).

**Figure + Image — copy fill idiom from `CrashCourseRail.tsx:134-142`:**
```tsx
<figure className={s.media}>
  <Image src={card.image.src} alt={card.image.alt} focalPoint="center" loading="lazy" radius="none" />
</figure>
```
`radius="none"` because the figure wrapper owns the radius + aspect + `object-fit:cover` fill (Image ships `height:auto`).

---

### `types.ts` (types, CMS content shape)

**Analog:** `CrashCourseRail/types.ts` (whole file — same `Content` + per-item shape with optional `href`, `theme?: ThemeName`).

`CrashCourseRail/types.ts:1-16` structure to mirror:
```ts
import type { ThemeName } from '@tokens/themes'

export type CrashCourseRailCard = {
  title: string
  description: string
  image: { src: string; alt: string }
  href?: string
}

export type CrashCourseRailContent = {
  eyebrow?: string
  heading: string
  lead?: string
  cards: CrashCourseRailCard[]
  theme?: ThemeName
}
```
Adapt to the SPEC's shape (UI-SPEC lines 74-93): `ResidentStory` { `eyebrow`, `headline` (supports `\n`), `attribution`, `attributionName?`, `image: {src;alt}`, `side?: 'left'|'right'`, `href?` } and `ResidentStoriesContent` { `eyebrow?`, `heading?`, `stories: ResidentStory[]`, `theme?: ThemeName` }. **Both `eyebrow` and `heading` are optional here** (D-8 — source has no visible block heading), unlike CrashCourseRail where `heading` is required.

---

### `ResidentStories.module.css` (config, token-only)

**Sticky-stage analog:** `MTGNeighborhoods.module.css` (copy `.block`, `.stage`, `.track`, `.anchor`, the `<768px` in-flow fallback, the reduced-motion guard verbatim and adapt). **`.rise` / figure-fill / reduced-motion idiom analog:** `CrashCourseRail.module.css`.

**EXACT sticky-stage CSS — copy from `MTGNeighborhoods.module.css:7-27` (the proven implementation, D-10):**
```css
.block {
  position: relative;
  padding-inline: var(--space-5);
}

/* Sticky stage — 24px gutter on all sides via .block's padding-inline and the
   stage's top + height calc. Stage owns the chrome (border + radius + overflow). */
.stage {
  position: sticky;
  top: var(--space-5);
  height: calc(100vh - 2 * var(--space-5));
  max-height: calc(100vh - 2 * var(--space-5));
  overflow: hidden;
  border-radius: var(--radius-lg);            /* SPEC D-10 nudges to calc(var(--radius-lg) * 1.5) for the softer source --card-radius; either is token-pure */
  border: var(--border-hairline) solid var(--color-border-subtle);
  background: var(--color-surface-page);
  transition:
    background-color var(--motion-surface-swap-duration) var(--motion-surface-swap-easing),
    border-color var(--motion-surface-swap-duration) var(--motion-surface-swap-easing);
}
```

**EXACT track + anchor — copy from `MTGNeighborhoods.module.css:61-70`:**
```css
/* scroll runway — one viewport per story. */
.track {
  display: flex;
  flex-direction: column;
}

.anchor {
  height: 100vh;
  pointer-events: none;
}
```

**EXACT <768px in-flow fallback — adapt from `MTGNeighborhoods.module.css:72-88`** (MTGNeighborhoods makes the stage in-flow with a fixed aspect-ratio and hides the track; for ResidentStories the stage must instead become a static visible STACK of stories — see reduced-motion block below, which is the same target state):
```css
@media (width < 768px) {
  .stage {
    position: relative;
    top: auto;
    height: auto;
    max-height: none;
    overflow: visible;        /* let the stacked stories flow */
  }
  .track,
  .progress {
    display: none;
  }
  /* stories become a normal stack — see the static-stack rules below */
}
```

**EXACT reduced-motion guard — combine `MTGNeighborhoods.module.css:90-96` + `CrashCourseRail.module.css:238-253`.** This is the SC#2 canonical fallback (SPEC lines 253, 267-268). The static-stack target: stage `position:static; height:auto; overflow:visible`; track `height:auto`; each `.story` `position:relative; inset:auto; opacity:1; min-height:auto; padding-block: var(--space-section-y-md)`; `.rise`/media `transition:none; transform:none; opacity:1`; progress `display:none`. Pattern to copy from CrashCourseRail (`:238-253`):
```css
@media (prefers-reduced-motion: reduce) {
  .rise {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .story,
  .media img {
    transition: none !important;
    transform: none !important;
  }
  .progress { display: none; }
  /* + stage/story un-sticky/un-absolute rules per SPEC Motion table line 253 */
}
```

**EXACT `.rise` stagger — copy from `CrashCourseRail.module.css:11-15` (note the load-bearing comment block `:8-10`):**
```css
/* Visible end-state is the base; the hidden pre-state only applies before reveal
   (so no-JS / no-IntersectionObserver baselines still show content). */
.rise {
  transition:
    opacity var(--motion-reveal-duration) var(--motion-reveal-easing) var(--rise-d, 0ms),
    transform var(--motion-reveal-duration) var(--motion-reveal-easing) var(--rise-d, 0ms);
}
```
**CRITICAL (SC#2):** The hidden pre-state must be guarded behind the active/live state — for CrashCourseRail it's `.head:not(.revealed) .rise { opacity:0; transform:... }` (`:17-20`). For ResidentStories the hidden state rides `is-active`: base `.story .rise` is **fully visible** (opacity:1), and only the cross-fade/recede hidden states apply to NON-active panels under a JS-applied class — guaranteeing no-JS = readable stack (SPEC line 267).

**EXACT figure-fill override — copy from `CrashCourseRail.module.css:75-88`** (Image ships `height:auto`, must force cover):
```css
.media {
  position: absolute;   /* or relative depending on layout — CrashCourseRail uses absolute inset:0 */
  inset: 0;
  margin: 0;
}
/* REQUIRED fill override — Image ships height:auto; this makes it cover the figure. */
.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```
For the ResidentStories media (4/5 portrait, max-width 460px) apply `aspect-ratio`, `max-width`, and `border-radius: calc(var(--radius-lg) * 1.5)` on `.media` (the FeatureSpotlight `.frame` precedent, `FeatureSpotlight.module.css:44-53`, which uses `aspect-ratio` + `border-radius: calc(var(--radius-lg) * 2)` + `overflow:clip` + `surface-raised` bg).

**Progress fill (`scaleY` by `--progress`) — NET-NEW but follows the paginator's `--snap-progress` inline-var idiom (`NeighborhoodPaginator.tsx:116`, `NeighborhoodPaginator.module.css:35-45`).** Author:
```css
.progress {
  position: absolute;          /* D-3: inside the stage, NOT page-fixed */
  /* placement: left edge of stage, vertical bar */
  background: color-mix(in oklch, var(--color-text-default) 16%, transparent);  /* track — SPEC line 222/239; or --color-border-strong */
  border-radius: var(--radius-pill);
}
.progressFill {
  transform: scaleY(var(--progress, 0));
  transform-origin: top;
  background: var(--color-text-default);     /* dark ink fill — SPEC line 234 (NOT --color-accent-line) */
  transition: transform var(--motion-state-change-duration) var(--motion-state-change-easing);
}
```
**Do not write per-frame JS heights** (the source did `progressFill.style.height = G*100%`) — set `--progress = (activeIndex+1)/N` as an inline style var on the component, exactly the `NeighborhoodPaginator.tsx:116` `style={{ '--snap-progress': snapProgress }}` idiom. CSS does the `scaleY`.

**Decorative giant quote mark** — block-local ornamental `<span aria-hidden>` sized via `clamp()` (SPEC lines 32, 201, 209). Token-only otherwise; the `clamp()` px are sanctioned layout values (CrashCourseRail's header comment `:5-6` documents this exact sanction).

**Token-only constraint:** No raw hex / no raw px outside sanctioned `clamp()`/`vh`/`calc()` layout values (Stylelint + the CrashCourseRail header comment precedent). All gaps via `--space-*`, radii via `--radius-*`, motion via `--motion-*`.

---

### `ResidentStories.stories.tsx` (story)

**Analog:** `CrashCourseRail.stories.tsx` (fixtures import + 2 stories) + `MTGNeighborhoods.stories.tsx:8` (`parameters: { layout: 'fullscreen' }`).

**Fixtures import + meta — copy from `CrashCourseRail.stories.tsx:4, 62-76`:**
```tsx
import { IMAGES } from '../../../stories/_fixtures/images'
// ...
const meta: Meta<typeof ResidentStories> = {
  title: 'Examples/ResidentStories',
  component: ResidentStories,
  parameters: { layout: 'fullscreen' }
}
export default meta
type S = StoryObj<typeof ResidentStories>

export const Default: S = { args: { content } }
export const FewStories: S = { args: { content: { ...content, stories: content.stories.slice(0, 2) } } }
```
Default content = the 3 source residents (SPEC §Copywriting lines 282-290: Aditi/Tomás/Maya). Image fixtures (verified present): `IMAGES.portrait`, `IMAGES.mtgFeatureSofa`, `IMAGES.mtgHeroCoat`. A second story proving a different count (e.g. add `IMAGES.mtgHeroDadKid` for a 4th, or slice to 2) — proves the progress scale. The global Storybook toolbar handles reduced-motion (proves the static-stack fallback).

---

### `ResidentStories.test.tsx` (test)

**Analog:** `CrashCourseRail.test.tsx` (whole file — the canonical MockObserver + href/article + no-IO baseline pattern; SPEC line 69 references "Phases 1-3 pattern").

**MockObserver stub — copy verbatim from `CrashCourseRail.test.tsx:9-18`:**
```tsx
// jsdom has no IntersectionObserver; useScrollSections constructs one in an effect.
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
(MTGNeighborhoods uses a slightly fuller `IO` class with `takeRecords` at `MTGNeighborhoods.test.tsx:20-28` — either works; the CrashCourseRail one is leaner and is the direct precedent for a `useScrollSections`/observer block.)

**Assertions to mirror (`CrashCourseRail.test.tsx:48-107`), adapted to SPEC line 69:**
- each story's eyebrow + headline + attribution render (`getByText`)
- each headline is an `<h3>` — `screen.getAllByRole('heading', { level: 3 })` (note: D-9 uses `as="h3"`, so level is 3, not 2)
- `href` story is a `<a href>` (`getByRole('link', { name })` → `toHaveAttribute('href', ...)`, copy `:67-71`); non-href story is NOT a link (`queryByRole('link', ...)` null, copy `:73-76`)
- image `alt` present per story
- **static/no-IO baseline shows ALL stories visible** (the reduced-motion/SC#2 contract — copy the `:102-106` "shows content without motion" test: since the hidden pre-state is CSS-only and `activeId` defaults to `ids[0]`, all story text is in the DOM)
- progress indicator is `aria-hidden` (or `aria-valuenow` if D-4 enhancement chosen)
- Section has its accessible name (`getByRole('region', { name: /stories from people/i })` or by `aria-label`)

**jsdom limitation comment — copy idiom from `CrashCourseRail.test.tsx:20-22`** (no real scroll/IO geometry → assert wiring/baseline, not active scroll position).

---

### `index.ts` (barrel)

**Analog:** `CrashCourseRail/index.ts:1-2` + `MTGNeighborhoods/index.ts:1, 7-14`.

Per SPEC line 70:
```ts
export { ResidentStories, type ResidentStoriesProps } from './ResidentStories'
export type { ResidentStoriesContent, ResidentStory } from './types'
```
(Named exports only — CONVENTIONS.md Module Design §Barrel Files.)

---

## Shared Patterns

### Banner comment (REQUIRED, all example blocks)
**Source:** `MTGNeighborhoods.tsx:1-2`, `CrashCourseRail.tsx:1-2` (identical)
**Apply to:** `ResidentStories.tsx` top
```tsx
// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.
```

### `useScrollSections` reuse — NO new hook (SC#3, D-2)
**Source:** `useScrollSections.ts:48-93` + usage `MTGNeighborhoods.tsx:22-32, 71-75`
**Apply to:** `ResidentStories.tsx`
- `ids = stories.map((_, i) => \`story-${i}\`)`
- `const { activeId, register } = useScrollSections<string>(ids)` — **NO `snap`** (D-2 keeps it un-jacked; MTGNeighborhoods passes snap, this block must not)
- register each `.anchor` via `ref={register(ids[i])}` inside the `aria-hidden` `.track`
- `activeIndex = ids.indexOf(activeId)`; `isActive = ids[i] === activeId`
- the hook is the ONLY scroll machinery — no `window.scroll` listener, no `getBoundingClientRect` per frame, no manual `globalProgress()`

### Inline CSS-var for dynamic values (no per-frame JS DOM writes)
**Source:** `NeighborhoodPaginator.tsx:116` (`style={{ '--snap-progress': snapProgress }}`), `CrashCourseRail.tsx:16` (`riseStyle`)
**Apply to:** progress fill (`--progress = (activeIndex+1)/N`) + `.rise` stagger (`--rise-d`)
```tsx
const riseStyle = (d: number): CSSProperties => ({ '--rise-d': `${d}ms` } as CSSProperties)
style={{ ['--progress']: (activeIndex + 1) / stories.length } as CSSProperties}
```

### `Text`-on-plain-wrapper for staggered pieces
**Source:** `CrashCourseRail.tsx:102-115` (+ the explanatory comment)
**Apply to:** every animated text piece (`Text` accepts no `style`/`id` — `Text.tsx:19-31`)

### `href ? 'a' : 'article'` (no fake button/tabindex on a div)
**Source:** `CrashCourseRail.tsx:130-133` + test `:67-76`
**Apply to:** each story panel (D-7)

### Image figure-fill override
**Source:** `CrashCourseRail.module.css:81-88` ("REQUIRED fill override — Image ships height:auto")
**Apply to:** `.media img` in the CSS (Image renders `height:auto` — `Image.tsx:18` defaults; needs `width/height:100%; object-fit:cover`)

### Reduced-motion + no-JS static fallback (SC#2 — binding)
**Source:** `MTGNeighborhoods.module.css:90-96` + `CrashCourseRail.module.css:238-253` + `<768px` block `:75-88`
**Apply to:** `ResidentStories.module.css` — stage un-sticky/un-clip, track height:auto, all stories `opacity:1; position:relative; padding-block:var(--space-section-y-md)`, `.rise`/media static, progress hidden. The base CSS state of every `.story` must be fully visible; hidden/absolute states apply ONLY under JS-applied active classes.

### Theme via `Section`, accessible name via `aria-label`
**Source:** `Section.tsx:7,17-18` (forwards `...rest`); `CrashCourseRail.tsx:94` (`aria-label={content.heading}`)
**Apply to:** `Section theme={content.theme ?? 'pink-soft'} spacing="sm" aria-label={content.heading ?? 'Stories from people who made the move'}` (`Text` has no `id`, so `aria-labelledby` is not wired — Phases 1-3 precedent)

### Large radius idiom (no `--card-radius` token)
**Source:** `CrashCourseRail.module.css:67` + `FeatureSpotlight.module.css:47` (`calc(var(--radius-lg) * N)`)
**Apply to:** stage + media radius `calc(var(--radius-lg) * 1.5)` (the source `--card-radius` ≈24px intent)

---

## No Analog Found

None. Every file has a strong analog. The only genuinely NET-NEW CSS is the `scaleY` progress-fill bar and the absolute cross-faded story panels — but both follow established idioms (`NeighborhoodPaginator` inline-var + `transform`/`opacity` `transition`, and the `MTGNeighborhoods` absolute `.cardOverlay`/`.cardSwap` cross-fade at `MTGNeighborhoods.module.css:30-59`).

| Mechanism | Closest idiom (not a 1:1 file) |
|-----------|-------------------------------|
| `scaleY` progress fill | `NeighborhoodPaginator` themed progress line (`.module.css:33-45`) + inline `--snap-progress` var (`.tsx:116`) |
| Absolute cross-faded story panels | `MTGNeighborhoods` `.cardOverlay` + `.cardSwap` + `@keyframes card-enter` (`.module.css:30-59`) — opacity+translateY cross-fade keyed off active |

---

## Metadata

**Analog search scope:** `src/system/examples/{MTGNeighborhoods,CrashCourseRail,FeatureSpotlight}/`, `src/system/hooks/useScrollSections.ts`, `src/system/primitives/{Text,Section,Image,Icon}.tsx`, `src/tokens/themes/index.ts`, `src/tokens/semantic/color.ts`, `src/stories/_fixtures/images.ts`
**Files scanned:** 21
**Pattern extraction date:** 2026-06-03
**Avoided (per prompt):** `FooterCta` (uncommitted working-tree edits — not used as a code analog)
