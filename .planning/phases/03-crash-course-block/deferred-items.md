# Deferred Items — Phase 03

Out-of-scope discoveries logged during execution. Not fixed (scope boundary: only auto-fix issues directly caused by the current plan's changes).

## From plan 03-02

- **FooterCta test/typecheck failures (pre-existing, unrelated).** The full `npx vitest run` shows 3 failing tests in `src/system/examples/FooterCta/FooterCta.test.tsx`, and `npm run typecheck` reports errors in `FooterCta.test.tsx` / `FooterCta/index.ts`. Root cause is pre-existing uncommitted working-tree changes outside plan 03-02: `git status` shows `src/system/examples/FooterCta/FooterCta.tsx` deleted and `src/system/examples/FooterCta/types.ts` modified. CrashCourseRail's own suite is fully green and type-clean. Resolve when the FooterCta working-tree changes are intentionally completed/committed.
