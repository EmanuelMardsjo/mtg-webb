import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FooterCta } from './FooterCta'
import type { FooterCtaContent } from './types'

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

const content: FooterCtaContent = {
  runway: {
    eyebrow: '№ 09 — Before you go',
    headline: "You've read the stories.",
    lead: 'One honest sentence about the life you are after.',
    media: { src: '/couch.webp', alt: 'A mother and daughter on a sofa' }
  },
  cta: {
    eyebrow: "№ 10 — When you're ready",
    title: 'What kind of life are you looking for?',
    lead: "Start with one honest sentence.",
    action: { label: 'Begin with one line', href: '/start' }
  },
  footer: {
    columns: [
      {
        tag: 'An initiative of',
        items: [{ text: 'City of Gothenburg' }, { text: '+ 142 ecosystem partners' }]
      },
      {
        tag: 'Built openly',
        items: [{ text: 'Privacy first', href: '/privacy' }, { text: 'No tracking pixels', href: '/no-tracking' }]
      }
    ],
    legal: '© Move to Gothenburg · 2026 · A non-profit relocation companion',
    coords: '57.7089°N · 11.9746°E'
  }
}

describe('FooterCta', () => {
  it('renders runway eyebrow, headline and lead', () => {
    render(<FooterCta content={content} />)
    expect(screen.getByText(content.runway.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(content.runway.headline)).toBeInTheDocument()
    expect(screen.getByText(content.runway.lead)).toBeInTheDocument()
  })

  it('renders CTA eyebrow, title and lead', () => {
    render(<FooterCta content={content} />)
    expect(screen.getByText(content.cta.eyebrow)).toBeInTheDocument()
    expect(screen.getByText(content.cta.title)).toBeInTheDocument()
    expect(screen.getByText(content.cta.lead)).toBeInTheDocument()
  })

  it('renders the CTA as a link with the supplied href and accessible name', () => {
    render(<FooterCta content={content} />)
    const link = screen.getByRole('link', { name: /begin with one line/i })
    expect(link).toHaveAttribute('href', '/start')
  })

  it('renders the CTA title as an h2', () => {
    render(<FooterCta content={content} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(content.cta.title)
  })

  it('renders the runway headline as an h1', () => {
    render(<FooterCta content={content} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content.runway.headline)
  })

  it('renders footer column tags, a link item and a non-link item', () => {
    render(<FooterCta content={content} />)
    expect(screen.getByText('An initiative of')).toBeInTheDocument()
    expect(screen.getByText('City of Gothenburg')).toBeInTheDocument()
    const privacy = screen.getByRole('link', { name: /privacy first/i })
    expect(privacy).toHaveAttribute('href', '/privacy')
  })

  it('renders the footer legal copy', () => {
    render(<FooterCta content={content} />)
    expect(screen.getByText(content.footer.legal)).toBeInTheDocument()
  })

  it('shows content without motion (no IntersectionObserver baseline)', () => {
    // jsdom has no IntersectionObserver and the hidden pre-state is CSS-only, so content is present.
    render(<FooterCta content={content} />)
    expect(screen.getByText(content.cta.title)).toBeInTheDocument()
  })
})
