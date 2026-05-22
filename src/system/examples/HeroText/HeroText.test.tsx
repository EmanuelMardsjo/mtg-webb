import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroText } from './HeroText'

describe('HeroText', () => {
  it('renders headline as display text', () => {
    render(<HeroText content={{ headline: 'Move to Gothenburg' }} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Move to Gothenburg')
  })

  it('renders lead when provided', () => {
    render(<HeroText content={{ headline: 'A', lead: 'A practical guide.' }} />)
    expect(screen.getByText('A practical guide.')).toBeInTheDocument()
  })

  it('omits lead when not provided', () => {
    const { container } = render(<HeroText content={{ headline: 'A' }} />)
    expect(container.querySelectorAll('p').length).toBe(0)
  })

  it('renders eyebrow tag when provided', () => {
    render(<HeroText content={{ headline: 'A', eyebrow: 'Welcome' }} />)
    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })
})
