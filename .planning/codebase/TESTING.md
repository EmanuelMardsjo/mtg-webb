# Testing Patterns

**Analysis Date:** 2026-05-28

## Test Framework

**Runner:**
- Vitest 4.1.7
- Config: `vite.config.ts`
- Environment: `jsdom` from `vite.config.ts`
- Globals: enabled through `test.globals: true` in `vite.config.ts`
- Setup: `src/test/setup.ts`
- Include pattern: `src/**/*.test.{ts,tsx}` in `vite.config.ts`

**Assertion Library:**
- Vitest `expect` for unit assertions: `src/tokens/build/contrast.test.ts`, `src/tokens/build/emit.test.ts`.
- `@testing-library/jest-dom` matchers loaded through `@testing-library/jest-dom/vitest`: `src/test/setup.ts`.
- Testing Library React for component and hook render tests: `src/system/primitives/Text.test.tsx`, `src/system/hooks/useReveal.test.tsx`.

**Run Commands:**
```bash
npm test              # Run all Vitest tests once
npm run test:watch    # Run Vitest in watch mode
npm run lint          # Run ESLint and Stylelint
npm run typecheck     # Run TypeScript project references with no emit
```

## Test File Organization

**Location:**
- Tests are co-located with the source module they cover: `src/system/primitives/Text.test.tsx`, `src/system/hooks/useReveal.test.tsx`, `src/tokens/build/emit.test.ts`.
- A toolchain smoke test lives under `src/test/`: `src/test/smoke.test.ts`.
- Test setup lives in `src/test/setup.ts`.

**Naming:**
- React component and hook tests use `*.test.tsx`: `src/system/examples/ImageText/ImageText.test.tsx`, `src/system/hooks/ThemeOverride.test.tsx`.
- Token and build helper tests use `*.test.ts`: `src/tokens/build/contrast.test.ts`, `src/tokens/semantic/type.test.ts`.
- No `*.spec.*` files are present.

**Structure:**
```text
src/
├── test/
│   ├── setup.ts
│   └── smoke.test.ts
├── system/
│   ├── primitives/
│   │   ├── Text.tsx
│   │   └── Text.test.tsx
│   ├── hooks/
│   │   ├── useReveal.ts
│   │   └── useReveal.test.tsx
│   └── examples/
│       └── ImageText/
│           ├── ImageText.tsx
│           ├── ImageText.test.tsx
│           └── types.ts
└── tokens/
    ├── build/
    │   ├── emit.ts
    │   └── emit.test.ts
    └── semantic/
        ├── type.ts
        └── type.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Text } from './Text'

describe('Text', () => {
  it('renders body role as <p> by default', () => {
    const { container } = render(<Text role="body">x</Text>)
    expect(container.firstChild?.nodeName).toBe('P')
  })
})
```

Use this component suite style from `src/system/primitives/Text.test.tsx` for new primitives and examples.

**Patterns:**
- One `describe('{ModuleName}')` suite per module: `src/system/primitives/Grid.test.tsx`, `src/system/examples/StoryTeaser/StoryTeaser.test.tsx`, `src/tokens/build/contrast.test.ts`.
- Test names describe behavior in user-facing or contract terms: `src/system/examples/HeroText/HeroText.test.tsx`, `src/system/primitives/Section.test.tsx`.
- Prefer accessible queries through `screen.getByRole`, `screen.getByText`, and `screen.getAllByRole` for rendered content: `src/system/examples/HeroText/HeroText.test.tsx`, `src/system/examples/Signpost/Signpost.test.tsx`.
- Use `container` and DOM selectors for structural contracts that do not have accessible handles, such as class names, SVG presence, custom CSS variables, and `<img>` attributes: `src/system/primitives/Icon.test.tsx`, `src/system/primitives/Col.test.tsx`, `src/system/examples/ImageText/ImageText.test.tsx`.
- Use local constants for repeated content fixtures: `baseContent` in `src/system/examples/ImageText/ImageText.test.tsx`, `base` in `src/system/examples/StoryTeaser/StoryTeaser.test.tsx`.
- Use local `setup()` helpers when a provider wrapper is repeated: `src/system/examples/ThemedAccordion/ThemedAccordion.test.tsx`.
- Reset global DOM mutations in `beforeEach` when tests affect `document.body`: `src/system/hooks/ThemeOverride.test.tsx`.

## Mocking

**Framework:** Vitest

**Patterns:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

let observerCallback: IntersectionObserverCallback | null = null

class MockObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb
  }
}

beforeEach(() => {
  ;(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    MockObserver as unknown as typeof IntersectionObserver
  observerCallback = null
})
```

Use this manual browser API mock pattern from `src/system/hooks/useReveal.test.tsx` when jsdom lacks an API needed by a hook.

**What to Mock:**
- Mock missing browser APIs, especially observer or media APIs, at `globalThis` level inside the test file: `src/system/hooks/useReveal.test.tsx`.
- Mock callback methods with `vi.fn()` when the test needs to assert or safely provide API shape: `src/system/hooks/useReveal.test.tsx`.
- Simulate state changes with `act` when triggering hook callbacks or imperative state updates: `src/system/hooks/useReveal.test.tsx`, `src/system/hooks/ThemeOverride.test.tsx`.
- Use `fireEvent` for DOM events that jsdom does not perform natively, with a comment explaining the limitation: `src/system/examples/ThemedAccordion/ThemedAccordion.test.tsx`.

**What NOT to Mock:**
- Do not mock local primitives when testing example blocks; render the composed component tree: `src/system/examples/ImageText/ImageText.test.tsx`, `src/system/examples/ThemedAccordion/ThemedAccordion.test.tsx`.
- Do not mock CSS Modules. Vitest is configured with `css.modules.classNameStrategy: 'non-scoped'`, so tests assert readable class names directly: `vite.config.ts`, `src/system/primitives/Stack.test.tsx`.
- Do not mock token functions for token build tests; call the real functions and assert output contracts: `src/tokens/build/emit.test.ts`, `src/tokens/build/verify.test.ts`.
- No module-level `vi.mock(...)` usage is detected.

## Fixtures and Factories

**Test Data:**
```typescript
const baseContent = {
  headline: 'Living by the water',
  body: 'Some prose.',
  image: { src: '/x.jpg', alt: 'archipelago' }
}
```

Use small inline fixtures for tests, as in `src/system/examples/ImageText/ImageText.test.tsx`.

**Location:**
- Test fixtures are usually local constants inside each test file: `src/system/examples/ImageText/ImageText.test.tsx`, `src/system/examples/StoryTeaser/StoryTeaser.test.tsx`, `src/system/examples/ChecklistTeaser/ChecklistTeaser.test.tsx`.
- Storybook-specific copy and image fixtures live under `src/stories/_fixtures/`: `src/stories/_fixtures/copy.ts`, `src/stories/_fixtures/images.ts`.
- There is no shared test factory directory.

## Coverage

**Requirements:** None enforced. `package.json` has `test` and `test:watch` scripts only, and no coverage script or coverage provider package is configured.

**View Coverage:**
```bash
# Not configured. Add a Vitest coverage provider and script before relying on coverage output.
```

## Test Types

**Unit Tests:**
- Token build logic and semantic tokens are tested as pure functions and data contracts: `src/tokens/build/contrast.test.ts`, `src/tokens/build/emit.test.ts`, `src/tokens/build/verify.test.ts`, `src/tokens/semantic/type.test.ts`.
- Basic toolchain availability is covered by `src/test/smoke.test.ts`.

**Integration Tests:**
- Component tests render real React components through Testing Library and assert DOM behavior: `src/system/primitives/Text.test.tsx`, `src/system/examples/ImageText/ImageText.test.tsx`, `src/system/examples/ThemedAccordion/ThemedAccordion.test.tsx`.
- Hook/provider tests exercise DOM side effects such as `data-theme` on `document.body`: `src/system/hooks/ThemeOverride.test.tsx`.
- Storybook documents visual and a11y behavior but is not wired as a separate automated Storybook test runner: `.storybook/main.ts`, `.storybook/preview.tsx`, `src/stories/foundations/Accessibility.stories.tsx`.

**E2E Tests:**
- Not used. No Playwright, Cypress, or browser E2E config is present.

## Common Patterns

**Async Testing:**
```typescript
act(() => {
  observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
})
expect(container.firstChild).toHaveAttribute('data-revealed', 'true')
```

Most tests are synchronous. Use `act` for React state changes triggered outside the normal render flow, as in `src/system/hooks/useReveal.test.tsx` and `src/system/hooks/ThemeOverride.test.tsx`.

**Error Testing:**
```typescript
it('fails AA when ratio < 4.5', () => {
  expect(passesAA('#999999', '#AAAAAA')).toBe(false)
})
```

Explicit `toThrow` tests are not detected. Current error-adjacent tests prefer negative return assertions and build contract assertions in `src/tokens/build/contrast.test.ts` and `src/tokens/build/verify.test.ts`.

---

*Testing analysis: 2026-05-28*
