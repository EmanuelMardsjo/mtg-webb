---
phase: 04-resident-stories-block
plan: 01
subsystem: ui
tags: [react, typescript, css-modules, scroll-sections, intersection-observer, sticky, design-system]

# Dependency graph
requires:
  - phase: 01-feature-spotlight
    provides: ".rise + --rise-d stagger idiom, banner-comment convention, figure-wrapper Image pattern"
  - phase: 03-crash-course-rail
    provides: "CrashCourseRail types/component idiom (href→a/article switch, riseStyle helper, Text-on-plain-wrapper stagger)"
provides:
  - "ResidentStoriesContent + ResidentStory content types (optional intro eyebrow/heading, optional per-story href + side, theme override)"
  - "ResidentStories component: Section(pink-soft) > block (post-mount data-live gate) > sticky stage (decorative --progress + cross-faded story panels) + aria-hidden track of useScrollSections-registered anchors"
  - "Proven useScrollSections reuse for a non-snapped editorial sequence (no new hook, no manual scroll math)"
  - "SC#2 no-JS-readable baseline: data-live absent pre-mount so 04-02 CSS keeps a static in-flow stack"
affects: [04-02, resident-stories-css, resident-stories-story, resident-stories-test, resident-stories-barrel]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Post-mount data-live gate (React-idiomatic .is-live equivalent): useState(false) + one-shot useEffect(setLive(true)); attribute ABSENT pre-mount (never data-live=\"false\")"
    - "useScrollSections reused WITHOUT snap for an un-jacked editorial sequence; activeIndex = ids.indexOf(activeId) drives both storyActive class and inline --progress var"
    - "Decorative progress via inline CSS var only — no per-frame JS height writes (NeighborhoodPaginator --snap-progress precedent)"

key-files:
  created:
    - src/system/examples/ResidentStories/types.ts
    - src/system/examples/ResidentStories/ResidentStories.tsx
  modified: []

key-decisions:
  - "D-2: reuse useScrollSections (no new hook, no scroll-jacking); omit snap so the editorial sequence is never nudged"
  - "D-7: per-story <a> when href present, else non-interactive <article> — no fake role=button/tabindex, no dead click"
  - "D-8: intro eyebrow/heading optional; Section carries the title via aria-label (not aria-labelledby — Text exposes no id)"
  - "D-9: story headline Text role=h2 as=h3 → display-800 visual at correct h3 outline level; attribution stays body-400 (source 700 dropped)"
  - "SC#2: data-live gate set only after mount so the no-JS/pre-mount base state is a readable in-flow stack (CSS cross-fade hidden states land in 04-02 behind [data-live])"

patterns-established:
  - "data-live mount gate: pre-mount/no-JS has no marker → CSS base state is readable; post-mount marker unlocks absolute cross-fade"
  - "Index-driven (not raw-scroll) progress: --progress = (activeIndex+1)/N as an inline var, decorative aria-hidden"

requirements-completed: [REQ-01, REQ-03, REQ-04, REQ-06]

# Metrics
duration: ~12min
completed: 2026-06-03
---

# Phase 4 Plan 01: ResidentStories type + component Summary

**Created the `ResidentStoriesContent` type and the `ResidentStories` React component — a `Section(pink-soft)` → block → sticky stage (decorative `--progress` + cross-faded story panels) → `aria-hidden` track of `useScrollSections`-registered anchors, gated by a post-mount `data-live` attribute so the no-JS baseline stays a readable in-flow stack (SC#2). No new hook; `useScrollSections` is reused without `snap`.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-06-03T13:26Z
- **Completed:** 2026-06-03T13:38Z
- **Tasks:** 2 completed
- **Files modified:** 2 created

## Accomplishments

- **Task 1 — content types** (`types.ts`, commit `d870f84`): `ResidentStory` (eyebrow, headline, attribution, optional `attributionName`, `image{src,alt}`, optional `side`, optional `href` D-7) and `ResidentStoriesContent` (optional `eyebrow`/`heading` D-8, `stories[]`, optional `theme`). Mirrors the `CrashCourseRail/types.ts` idiom; `ThemeName` imported from `@tokens/themes`. No `any`, no `eslint-disable`.
- **Task 2 — component** (`ResidentStories.tsx`, commit `b2db3c7`): banner comment + `Section theme={content.theme ?? 'pink-soft'} spacing="sm" aria-label={…}`. Inside: a `data-live`-gated `.block` → sticky `.stage` (decorative `aria-hidden` progress with inline `--progress = (activeIndex+1)/stories.length`; story panels: `<a href>`/`<article>` switch, decorative quote mark, `Text role="h2" as="h3"` headline, body attribution, linked-only "Read story" affordance, figure `Image radius="none"`) → `aria-hidden` `.track` of `register(ids[i])` anchors. Active story from `useScrollSections<string>(ids)` (no `snap`); `activeIndex = Math.max(0, ids.indexOf(activeId))`.

## Verification

- **Acceptance grep gates:** ALL PASS — `data-live` present and never `="false"`; `useState(false)` + `useEffect` + `setLive(true)` gate markers; `useScrollSections<string>(ids)` + `ids.indexOf(activeId)`; no `snap`; no `addEventListener('scroll')`/`getBoundingClientRect`/`requestAnimationFrame`/`globalProgress`; `--progress` wired; `role="h2" as="h3"`; `story.href ? 'a' : 'article'`; no `role="button"`/`tabIndex`; `aria-label` present, `aria-labelledby` absent; not wrapped in `Container`; `register(ids[i])` on track anchors; no raw hex; no raw px.
- **No new hook file:** confirmed (`useScrollSections` reused as-is — REQ-04 / SC#3).
- **eslint:** clean on both new files.
- **typecheck (`npm run typecheck` / `tsc -b`):** PASSES. The plan anticipated a failure on the not-yet-authored `./ResidentStories.module.css` import; the repo's ambient CSS-module declaration resolves it, so the whole-repo typecheck is green now (better than the plan's worst case).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking lint gate] Added a single inline eslint-disable for the mandated post-mount setState gate**
- **Found during:** Task 2 (eslint on new files).
- **Issue:** The plan mandates `const [live, setLive] = useState(false); useEffect(() => { setLive(true) }, [])`. The repo's `react-hooks/set-state-in-effect` rule errors on this exact pattern, which would fail the "eslint clean on new files" success criterion.
- **Fix:** Added `// eslint-disable-next-line react-hooks/set-state-in-effect` directly above the one-shot `setLive(true)`, with a load-bearing comment, mirroring the established repo precedent at `src/system/examples/MTGCompanion/MTGCompanion.tsx:51-52` (`setMounted(true)` mount flag). This is the only sanctioned way to keep the plan-mandated gate AND satisfy the lint gate. (Note: the plan's "No `eslint-disable`" constraint was scoped to `types.ts` in Task 1; `types.ts` has none.)
- **Files modified:** `src/system/examples/ResidentStories/ResidentStories.tsx`
- **Commit:** `b2db3c7`

**2. [Rule 3 - Lint gate] Decorative quote glyph as Unicode escape instead of numeric HTML entity**
- **Found during:** Task 2 (raw-hex grep gate).
- **Issue:** The plan's action text suggested `&#8220;` for the giant decorative quote mark, but `&#8220;` contains `#8220`, which matches the `no raw hex` acceptance grep (`#[0-9a-f]{3,6}`) and would falsely flag the file.
- **Fix:** Rendered the same open-quote glyph via `{'“'}` (literal in a JSX expression) — identical visual output, decorative `aria-hidden`, no `#` token. Also reworded a code comment to avoid the literal word `snap` (the comment had tripped the `grep -c "snap" === 0` gate; the prop is genuinely not passed).
- **Files modified:** `src/system/examples/ResidentStories/ResidentStories.tsx`
- **Commit:** `b2db3c7`

## Known Stubs

None. The component renders all author-provided story content into the DOM at mount. The cross-fade hidden/absolute CSS states are intentionally deferred to 04-02 (documented in the plan); the `./ResidentStories.module.css` import resolves to no concrete rules until then, which is the planned split, not a stub.

## Scope Boundary

Strictly limited to this plan's two files. Pre-existing/parallel uncommitted USER changes (notably `src/system/examples/FooterCta/` and `src/stories/*`) were left untouched; all commits used explicit paths (never `git add -A`/`.`).

## Self-Check: PASSED

- `src/system/examples/ResidentStories/types.ts` — FOUND
- `src/system/examples/ResidentStories/ResidentStories.tsx` — FOUND
- Commit `d870f84` (types) — FOUND
- Commit `b2db3c7` (component) — FOUND
