# Deferred Items — Phase 03

Out-of-scope discoveries logged during execution. Not fixed (scope boundary: only auto-fix issues directly caused by the current plan's changes).

## From plan 03-02

- **FooterCta test/typecheck failures — RESOLVED (not ours).** During plan 03-02 execution a mid-flight `npx vitest run` momentarily showed 3 failures in `src/system/examples/FooterCta/FooterCta.test.tsx`. Root cause was the **user's own parallel uncommitted edits** to the FooterCta files (an evolving variant distinct from our committed Phase 2 block, which remains intact in git history at commits `4f2d1d2`/`edbb84f`/`11787e7`/`509af3b`). By phase close the user's working-tree version was self-consistent: full suite **124/124 pass**, `npm run typecheck` exit 0. No action needed from this milestone; our Phase 2 FooterCta and Phase 3 CrashCourseRail are both committed and green.
