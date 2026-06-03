import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureSpotlight } from './FeatureSpotlight'
import type { FeatureSpotlightContent } from './types'

// jsdom has no IntersectionObserver; useReveal constructs one in an effect.
// Stub it (never firing intersection) so the no-motion baseline holds: content
// stays present because the hidden pre-state is CSS-only and not applied in jsdom.
class MockObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

beforeEach(() => {
  ;(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    MockObserver as unknown as typeof IntersectionObserver
})

const content: FeatureSpotlightContent = {
  eyebrow: '№ 01 — A life, not just a job',
  headline: "Live the life you've been saving for later.",
  lead: 'The slower evenings, the time with the people you love.',
  cta: { label: 'Explore the life', href: '/life' },
  image: { src: '/x.webp', alt: 'A warm domestic scene' }
}

describe('FeatureSpotlight', () => {
  it('renders eyebrow, headline and lead text', () => {
    render(<FeatureSpotlight content={content} />)
    expect(screen.getByText(content.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(content.headline)).toBeInTheDocument()
    expect(screen.getByText(content.lead)).toBeInTheDocument()
  })

  it('renders the headline as an h2', () => {
    render(<FeatureSpotlight content={content} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(content.headline)
  })

  it('renders the media image with its alt text', () => {
    render(<FeatureSpotlight content={content} />)
    expect(screen.getByAltText('A warm domestic scene')).toBeInTheDocument()
  })

  it('renders the CTA as a link with the supplied href', () => {
    render(<FeatureSpotlight content={content} />)
    const link = screen.getByRole('link', { name: /explore the life/i })
    expect(link).toHaveAttribute('href', '/life')
  })

  it('shows content without motion (no IntersectionObserver baseline)', () => {
    // jsdom has no IntersectionObserver and the hidden pre-state is CSS-only, so content is present.
    render(<FeatureSpotlight content={content} />)
    expect(screen.getByText(content.headline)).toBeInTheDocument()
  })
})
