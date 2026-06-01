import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Section } from './Section'

describe('Section', () => {
  it('renders as <section> by default', () => {
    const { container } = render(<Section>x</Section>)
    expect(container.firstChild?.nodeName).toBe('SECTION')
  })

  it('applies spacing=md class by default', () => {
    const { container } = render(<Section>x</Section>)
    expect(container.firstChild).toHaveClass('spacing-md')
  })

  it('sets data-theme attribute when theme prop is given', () => {
    const { container } = render(<Section theme="pink">x</Section>)
    expect(container.firstChild).toHaveAttribute('data-theme', 'pink')
  })

  it('does not set data-theme when prop omitted', () => {
    const { container } = render(<Section>x</Section>)
    expect(container.firstChild).not.toHaveAttribute('data-theme')
  })

  it('applies bleed class when bleed prop is true', () => {
    const { container } = render(<Section bleed>x</Section>)
    expect(container.firstChild).toHaveClass('bleed')
  })
})
