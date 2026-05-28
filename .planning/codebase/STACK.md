# Technology Stack

**Analysis Date:** 2026-05-28

## Languages

**Primary:**
- TypeScript 5.9.3 resolved from `package-lock.json`, declared as `^5.6.3` in `package.json` - application, design-token source, Storybook stories, tests, and build scripts under `src/`, `.storybook/`, `vite.config.ts`, and `src/tokens/build.ts`.
- TSX / React JSX - React components and Storybook stories under `src/system/primitives/`, `src/system/examples/`, `src/stories/foundations/`, and `src/stories/pages/`.

**Secondary:**
- CSS / CSS Modules - global styles in `src/system/styles/` and component-scoped modules in `src/system/primitives/*.module.css` and `src/system/examples/**/*.module.css`.
- MDX - Storybook documentation pages in `src/stories/foundations/*.mdx`.
- JavaScript ES modules - lint configuration in `eslint.config.js`.
- HTML - Vite host document in `index.html`.

## Runtime

**Environment:**
- Node.js 20 - project runtime target from `.nvmrc`; used for Vite, Storybook, Vitest, TypeScript, ESLint, Stylelint, and token generation.
- Browser DOM runtime - React mounts from `src/main.tsx` into `index.html` and imports `src/system/styles/global.css`.

**Package Manager:**
- npm - package manager inferred from `package-lock.json` and `README.md`; no `packageManager` field is declared in `package.json`.
- Lockfile: present - `package-lock.json` uses lockfileVersion 3.

## Frameworks

**Core:**
- React 18.3.1 - UI component runtime declared in `package.json` and resolved in `package-lock.json`.
- React DOM 18.3.1 - browser renderer used by `src/main.tsx`.
- Vite 5.4.21 - application dev server and production bundler configured in `vite.config.ts`.
- CSS Modules - component styling pattern used by files such as `src/system/primitives/Grid.module.css` and imported from React primitives such as `src/system/primitives/Grid.tsx`.
- Storybook 8.6.18 with `@storybook/react-vite` 8.6.18 - primary documentation and component development surface configured in `.storybook/main.ts`.

**Testing:**
- Vitest 4.1.7 - unit and component test runner configured through the `test` block in `vite.config.ts`.
- jsdom 29.1.1 - Vitest DOM environment configured in `vite.config.ts`.
- Testing Library React 16.3.2, Jest DOM 6.9.1, and User Event 14.6.1 - component testing utilities declared in `package.json` and set up from `src/test/setup.ts`.
- Storybook addon-a11y 8.6.18 - accessibility checks available in Storybook via `.storybook/main.ts`.

**Build/Dev:**
- TypeScript project references - root `tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`; `npm run typecheck` runs `tsc -b --noEmit`.
- `@vitejs/plugin-react` 4.7.0 - React plugin configured in `vite.config.ts`.
- `tsx` 4.22.3 - executes the token build script `src/tokens/build.ts` through `npm run tokens:build`.
- ESLint 10.4.0 with `typescript-eslint` 8.59.4 - TypeScript linting configured in `eslint.config.js`.
- Stylelint 17.12.0 with `stylelint-config-standard` 40.0.0 - CSS linting configured in `.stylelintrc.json`.

## Key Dependencies

**Critical:**
- `react` 18.3.1 - required for every component under `src/system/primitives/` and `src/system/examples/`.
- `react-dom` 18.3.1 - required by `src/main.tsx` for browser rendering.
- `vite` 5.4.21 - required for `npm run dev`, `npm run build`, `npm run preview`, and Storybook's Vite framework in `.storybook/main.ts`.
- `typescript` 5.9.3 resolved - required for strict app and Node type checking through `tsconfig.app.json` and `tsconfig.node.json`.
- `storybook` 8.6.18 and `@storybook/react-vite` 8.6.18 - required for the design-system documentation surface described in `README.md` and configured in `.storybook/main.ts`.

**Infrastructure:**
- `@storybook/addon-essentials` 8.6.14 - Storybook controls/actions/docs support configured in `.storybook/main.ts`.
- `@storybook/addon-a11y` 8.6.18 - Storybook accessibility addon configured in `.storybook/main.ts`.
- `@storybook/blocks` 8.6.14 - MDX docs import `Meta` from `@storybook/blocks` in files such as `src/stories/foundations/WiringToACMS.mdx`.
- `@storybook/manager-api` 8.6.18 and `@storybook/theming` 8.6.18 - custom Storybook manager theme wired by `.storybook/manager.ts` and `.storybook/sbTheme.ts`.
- `vitest` 4.1.7 and `@vitest/ui` 4.1.7 - test runner and optional UI declared in `package.json`.
- `@testing-library/react` 16.3.2, `@testing-library/jest-dom` 6.9.1, and `@testing-library/user-event` 14.6.1 - component test utilities declared in `package.json`.
- `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh` - lint stack configured in `eslint.config.js`.
- `stylelint` and `stylelint-config-standard` - CSS lint stack configured in `.stylelintrc.json`.
- `globals` 17.6.0 - browser globals used by `eslint.config.js`.
- `tslib` 2.8.1 - TypeScript runtime helpers dependency declared in `package.json`.
- `@types/node`, `@types/react`, and `@types/react-dom` - type packages declared in `package.json`.

## Configuration

**Environment:**
- No required environment variables are declared in `package.json`, `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, or source searches under `src/`.
- No `.env`, `.env.*`, or `*.env` files were detected during the repository scan.
- `.gitignore` ignores `*.local`, so local machine overrides can exist without being committed.
- Project-specific Codex skill directories `.codex/skills/` and `.agents/skills/` were not detected in the repository root.

**Build:**
- `package.json` scripts define the supported commands: `dev`, `build`, `preview`, `typecheck`, `lint`, `test`, `test:watch`, `tokens:build`, `storybook`, and `build-storybook`.
- `vite.config.ts` sets React, path aliases, and Vitest configuration.
- `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json` split browser app and Node/tooling type checking.
- `eslint.config.js` enforces TypeScript, React Hooks, React Refresh, and no raw hex or `px` literals in `src/system/**/*.{ts,tsx}`.
- `.stylelintrc.json` extends `stylelint-config-standard`, bans hex colors globally, and relaxes generated token CSS rules for `src/tokens/**/*.css` and `src/tokens/generated/**/*.css`.
- `.storybook/main.ts`, `.storybook/preview.tsx`, `.storybook/manager.ts`, `.storybook/sbTheme.ts`, and `.storybook/decorators/*.tsx` configure Storybook stories, addons, global toolbar controls, themes, and providers.
- `src/tokens/build.ts` emits `src/tokens/generated/tokens.css` and `src/tokens/generated/tokens.types.ts`; `src/tokens/build/verify.ts` fails the build when theme contrast is below AA for normal text.
- `src/system/styles/global.css` imports `src/tokens/generated/tokens.css`, `src/system/styles/fonts.css`, and `src/system/styles/reset.css`.
- `public/fonts/pp-telegraf/PPTelegraf-Ultrabold.woff2` and `public/fonts/pp-object-sans/PPObjectSans-Regular.woff2` are self-hosted font assets referenced by `src/system/styles/fonts.css`.

## Platform Requirements

**Development:**
- Install dependencies with `npm install` using `package-lock.json`.
- Use Node.js 20 from `.nvmrc`.
- Run `npm run tokens:build` before consuming global styles because `src/system/styles/global.css` imports `src/tokens/generated/tokens.css`.
- Run `npm run dev` for the Vite app on port 5173, or `npm run storybook` for the primary documentation surface on port 6006, as documented in `README.md`.

**Production:**
- Application build target is a static Vite output from `npm run build`, which runs `npm run tokens:build`, `tsc -b`, and `vite build` from `package.json`.
- Storybook static output is `storybook-static/` from `npm run build-storybook` in `package.json`.
- No hosting provider configuration was detected: no `vercel.json`, `netlify.toml`, Dockerfile, or `.github/workflows/` files were found.

---

*Stack analysis: 2026-05-28*
