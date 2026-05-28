# External Integrations

**Analysis Date:** 2026-05-28

## APIs & External Services

**Image Fixtures:**
- Unsplash image CDN - used only by Storybook/demo fixtures and not through an SDK.
  - SDK/Client: none; direct image URLs are hard-coded in `src/stories/_fixtures/images.ts` and `src/stories/foundations/Motion.stories.tsx`.
  - Auth: none detected in `src/stories/_fixtures/images.ts`, `src/stories/foundations/Motion.stories.tsx`, `package.json`, or `vite.config.ts`.

**CMS Readiness Documentation:**
- Future CMS adapters - documented but not implemented.
  - SDK/Client: none installed in `package.json`; `src/stories/foundations/WiringToACMS.mdx` documents future adapters for Optimizely, Contentful, Sanity, Storyblok, or another headless CMS.
  - Auth: none detected; `src/stories/foundations/WiringToACMS.mdx` states the future adapter location would be `src/cms/adapters/`, and that folder is not present.

**Application APIs:**
- Not detected - no `fetch`, Axios, GraphQL client, REST client, WebSocket, EventSource, or `/api/` integration was found in `src/`, `.storybook/`, `package.json`, or `vite.config.ts`.
  - SDK/Client: none detected in `package.json`.
  - Auth: none detected in `src/`, `.storybook/`, `package.json`, or `vite.config.ts`.

## Data Storage

**Databases:**
- Not detected.
  - Connection: no database environment variable usage was found in `src/`, `.storybook/`, `package.json`, or `vite.config.ts`.
  - Client: no ORM or database client package is declared in `package.json`.

**File Storage:**
- Local repository and public static assets only.
  - Fonts live under `public/fonts/` and are referenced by `src/system/styles/fonts.css`.
  - Brand assets live under `public/brand/` and are referenced by `src/stories/foundations/Brand.stories.tsx`.
  - Image-bank assets live under `public/images/image-bank/` and are referenced by `src/stories/foundations/ImageBank.stories.tsx`.
  - Generated design-token assets are emitted to `src/tokens/generated/` by `src/tokens/build.ts` and ignored by `.gitignore`.

**Caching:**
- None detected.
  - No Redis, Upstash, browser cache abstraction, service worker, or runtime cache package appears in `package.json`.
  - No cache integration code was found in `src/`, `.storybook/`, or `vite.config.ts`.

## Authentication & Identity

**Auth Provider:**
- None detected.
  - Implementation: no Clerk, Auth0, Firebase Auth, Supabase Auth, OAuth, session, cookie, login, or sign-in implementation was found in `package.json`, `src/`, `.storybook/`, or `vite.config.ts`.

## Monitoring & Observability

**Error Tracking:**
- None detected.
  - No Sentry, LogRocket, Datadog, PostHog, or analytics package is declared in `package.json`.
  - No monitoring initialization was found in `src/main.tsx`, `src/App.tsx`, `.storybook/`, or `vite.config.ts`.

**Logs:**
- Build-script console output only.
  - `src/tokens/build.ts` logs successful token generation and contrast failures.
  - No application logging framework is declared in `package.json`.

## CI/CD & Deployment

**Hosting:**
- Not detected.
  - No `vercel.json`, `netlify.toml`, Dockerfile, or deployment-specific configuration was found in the repository scan.
  - Production artifacts are local static outputs from `npm run build` and `npm run build-storybook` in `package.json`.

**CI Pipeline:**
- None detected.
  - No `.github/workflows/` files were found.
  - Verification commands are local scripts in `package.json`: `npm run build`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build-storybook`.

## Environment Configuration

**Required env vars:**
- None detected.
  - No `import.meta.env`, `process.env`, `VITE_`, database, auth, webhook, analytics, or API key usage was found in `src/`, `.storybook/`, `package.json`, or `vite.config.ts`.

**Secrets location:**
- Not detected.
  - No `.env`, `.env.*`, or `*.env` files were found.
  - `.gitignore` ignores `*.local`, so machine-local config can remain uncommitted when needed.

## Webhooks & Callbacks

**Incoming:**
- None detected.
  - No server, API routes, webhook handlers, or callback endpoints were found in `src/`, `.storybook/`, `package.json`, or `vite.config.ts`.

**Outgoing:**
- None detected.
  - No HTTP client calls, analytics beacons, webhook dispatchers, or background job integrations were found in `src/`, `.storybook/`, `package.json`, or `vite.config.ts`.

---

*Integration audit: 2026-05-28*
