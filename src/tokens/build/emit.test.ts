import { describe, it, expect } from 'vitest'
import { emitTokensCss } from './emit'

describe('emitTokensCss', () => {
  const css = emitTokensCss()

  it('includes :root + [data-theme="bone"] block', () => {
    expect(css).toMatch(/:root,\s*\[data-theme="bone"\]/)
  })

  it('emits every primitive color as a CSS var', () => {
    expect(css).toContain('--bone-50:')
    expect(css).toContain('--navy-900:')
    expect(css).toContain('--sky-400:')
  })

  it('emits semantic surface var', () => {
    expect(css).toContain('--color-surface-page:')
  })

  it('emits a block per theme', () => {
    expect(css).toMatch(/\[data-theme="ink"\]/)
    expect(css).toMatch(/\[data-theme="clay"\]/)
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

  it('emits space role vars', () => {
    expect(css).toContain('--space-section-y-lg:')
  })
})
