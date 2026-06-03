import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CrashCourseRail } from './CrashCourseRail'
import type { CrashCourseRailContent } from './types'

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

// jsdom limitation: real scroll position / element.scrollTo is unavailable, so we
// assert handler WIRING (button presence, labels, initial aria-current, disabled
// state) rather than real scroll position (CONVENTIONS.md test convention).
const content: CrashCourseRailContent = {
  eyebrow: '№ — A crash course',
  heading: 'A crash course in Gothenburg life',
  lead: 'Not the tourist version — just the small, everyday things that make a week here feel like yours.',
  cards: [
    {
      title: 'Fika',
      description: 'Coffee is only half the point. Fika is where work slows down.',
      image: { src: '/fika.webp', alt: 'A cinnamon bun and coffee' },
      href: '#fika'
    },
    {
      title: 'Archipelago days',
      description: 'A tram, a ferry, and suddenly the city opens into smooth rocks.',
      image: { src: '/archipelago.webp', alt: 'Wooden boats at a harbor' }
    },
    {
      title: 'Cold swims',
      description: 'Some call it wellness. Some call it madness. Both are true.',
      image: { src: '/swim.webp', alt: 'A cold-water swimming dock' },
      href: '#swims'
    }
  ]
}

describe('CrashCourseRail', () => {
  it('renders the heading as an h2', () => {
    render(<CrashCourseRail content={content} />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(content.heading)
  })

  it('renders the eyebrow and lead', () => {
    render(<CrashCourseRail content={content} />)
    expect(screen.getByText(content.eyebrow!)).toBeInTheDocument()
    expect(screen.getByText(content.lead!)).toBeInTheDocument()
  })

  it('renders every card title', () => {
    render(<CrashCourseRail content={content} />)
    for (const card of content.cards) {
      expect(screen.getByText(card.title)).toBeInTheDocument()
    }
  })

  it('renders a card with href as a link with that href', () => {
    render(<CrashCourseRail content={content} />)
    const link = screen.getByRole('link', { name: /fika/i })
    expect(link).toHaveAttribute('href', '#fika')
  })

  it('does not render a card without href as a link (D-4)', () => {
    render(<CrashCourseRail content={content} />)
    expect(screen.queryByRole('link', { name: /archipelago days/i })).toBeNull()
  })

  it('renders the dot nav as a labelled navigation of buttons', () => {
    render(<CrashCourseRail content={content} />)
    const nav = screen.getByRole('navigation', { name: /pagination/i })
    expect(nav).toBeInTheDocument()
    // Each dot button is labelled "Go to {card title}" (aria-label exposed by the component).
    const dots = screen.getAllByRole('button', { name: /go to/i })
    expect(dots).toHaveLength(content.cards.length)
    expect(screen.getByRole('button', { name: 'Go to Fika' })).toBeInTheDocument()
  })

  it('marks the first dot aria-current at mount and no other', () => {
    render(<CrashCourseRail content={content} />)
    const dots = screen.getAllByRole('button', { name: /go to/i })
    expect(dots[0]).toHaveAttribute('aria-current', 'true')
    expect(dots[1]).not.toHaveAttribute('aria-current')
    expect(dots[2]).not.toHaveAttribute('aria-current')
  })

  it('disables Previous at start and enables Next', () => {
    render(<CrashCourseRail content={content} />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
  })

  it('shows content without motion (no IntersectionObserver baseline)', () => {
    // jsdom has no IntersectionObserver and the hidden pre-state is CSS-only, so content is present.
    render(<CrashCourseRail content={content} />)
    expect(screen.getByText(content.heading)).toBeInTheDocument()
  })
})
