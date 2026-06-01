import { describe, it, expect } from 'vitest'
import { emitTokensCss } from './emit'

describe('emitTokensCss', () => {
  const css = emitTokensCss()

  it('includes :root + [data-theme="neutral"] block', () => {
    expect(css).toMatch(/:root,\s*\[data-theme="neutral"\]/)
  })

  it('emits every primitive color as a CSS var', () => {
    expect(css).toContain('--neutral-50:')
    expect(css).toContain('--neutral-950:')
    expect(css).toContain('--blue-700:')
    expect(css).toContain('--yellow-200:')
    expect(css).toContain('--amber-700:')
    expect(css).toContain('--amber-900:')
    expect(css).toContain('--pink-200:')
  })

  it('emits semantic surface var', () => {
    expect(css).toContain('--color-surface-page:')
    expect(css).not.toContain('--color-text-strong:')
    expect(css).toContain('--color-text-on-dark:')
    expect(css).toContain('--color-status-success:')
    expect(css).toContain('--color-status-info:')
    expect(css).toContain('--color-overlay-scrim:')
  })

  it('emits a block per theme', () => {
    expect(css).toMatch(/\[data-theme="neutral-dark"\]/)
    expect(css).toMatch(/\[data-theme="blue-soft"\]/)
    expect(css).toMatch(/\[data-theme="blue-deep"\]/)
    expect(css).toMatch(/\[data-theme="amber"\]/)
    expect(css).toMatch(/\[data-theme="amber-deep"\]/)
    expect(css).toMatch(/\[data-theme="pink-soft"\]/)
    expect(css).toMatch(/\[data-theme="pink"\]/)
    expect(css).toMatch(/\[data-theme="campaign"\]/)
  })

  it('emits motion role vars', () => {
    expect(css).toContain('--motion-hover-duration:')
    expect(css).toContain('--motion-hover-easing:')
  })

  it('emits fluid font-size vars', () => {
    expect(css).toContain('--fs-3xl:')
    expect(css).toMatch(/--fs-3xl:\s*clamp\(/)
  })

  it('emits PP font family and weight vars', () => {
    expect(css).toContain("--font-display: 'PP Telegraf', 'Inter', system-ui, sans-serif;")
    expect(css).toContain("--font-body: 'PP Object Sans', 'Inter', system-ui, sans-serif;")
    expect(css).toContain('--fw-display-ultrabold: 800;')
    expect(css).toContain('--fw-body-regular: 400;')
  })

  it('emits space role vars', () => {
    expect(css).toContain('--space-section-y-lg:')
  })
})
