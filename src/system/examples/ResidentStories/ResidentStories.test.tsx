import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResidentStories } from './ResidentStories'
import type { ResidentStoriesContent } from './types'

// jsdom has no IntersectionObserver; useScrollSections constructs one in an
// effect. Stub it (never firing) so activeId stays ids[0] and the cross-fade
// hidden state is never the deciding factor — all content stays in the DOM
// (the SC#2 no-JS / no-motion baseline; the hidden pre-state is CSS-only).
class MockObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

beforeEach(() => {
  ;(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    MockObserver as unknown as typeof IntersectionObserver
})

// jsdom limitation: real scroll/IO geometry + layout (getComputedStyle /
// toBeVisible on absolute/opacity) is unavailable, so we assert WIRING (the
// data-live gate, panel classes) + presence, not painted visibility
// (CONVENTIONS.md test convention). css.modules.classNameStrategy is
// 'non-scoped' so .story / .storyActive class selectors are readable here.
const content: ResidentStoriesContent = {
  stories: [
    {
      eyebrow: 'Bangalore → Lindholmen',
      headline: 'A forest twelve minutes from work.',
      attribution: 'Aditi Menon — Staff engineer, Volvo Cars',
      image: { src: '/aditi.webp', alt: 'Aditi in her hallway' },
      href: '#aditi'
    },
    {
      eyebrow: 'Lisbon → Majorna',
      headline: 'My mornings belong to me again.',
      attribution: 'Tomás Ferreira — Product designer, freelance',
      image: { src: '/tomas.webp', alt: 'Tomás on a sofa' }
    },
    {
      eyebrow: 'Toronto → Haga',
      headline: 'I finally stopped counting the hours.',
      attribution: 'Maya Okonkwo — Data scientist, SKF',
      image: { src: '/maya.webp', alt: 'Maya pulling on a coat' }
    }
  ]
}

describe('ResidentStories', () => {
  it('renders every story eyebrow, headline, and attribution', () => {
    render(<ResidentStories content={content} />)
    for (const story of content.stories) {
      expect(screen.getByText(story.eyebrow)).toBeInTheDocument()
      expect(screen.getByText(story.headline)).toBeInTheDocument()
      expect(screen.getByText(story.attribution)).toBeInTheDocument()
    }
  })

  it('renders each story headline as an h3 (D-9 as="h3")', () => {
    render(<ResidentStories content={content} />)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(content.stories.length)
  })

  it('renders the href story as a link with that href (D-7)', () => {
    render(<ResidentStories content={content} />)
    const link = screen.getByRole('link', { name: /a forest twelve minutes from work/i })
    expect(link).toHaveAttribute('href', '#aditi')
  })

  it('does not render a non-href story as a link (D-7)', () => {
    render(<ResidentStories content={content} />)
    expect(screen.queryByRole('link', { name: /my mornings belong to me again/i })).toBeNull()
  })

  it('gives each story image its alt text', () => {
    render(<ResidentStories content={content} />)
    for (const story of content.stories) {
      expect(screen.getByAltText(story.image.alt)).toBeInTheDocument()
    }
    expect(screen.getAllByRole('img')).toHaveLength(content.stories.length)
  })

  it('keys the hidden cross-fade state SOLELY to the data-live gate (SC#2 regression guard)', () => {
    // (a) The gate must be present after the post-mount effect (it runs under
    //     RTL's act, so data-live is applied by the time render returns).
    // (b) The hidden state must be keyed ONLY to the gate, never hard-coded on
    //     panels: exactly one .storyActive panel; non-active panels carry only
    //     .story (no extra hidden-state class). If a future edit removes the
    //     data-live gate or hard-codes the hidden state, (a)/(b) fail.
    const { container } = render(<ResidentStories content={content} />)

    // (a) gate present after mount
    expect(container.querySelector('[data-live]')).not.toBeNull()

    // (b) panels present; exactly one active; the rest carry only .story
    const panels = container.querySelectorAll('.story')
    expect(panels).toHaveLength(content.stories.length)
    expect(container.querySelectorAll('.storyActive')).toHaveLength(1)
    for (const panel of panels) {
      if (!panel.classList.contains('storyActive')) {
        // a non-active panel must not carry a hard-coded hidden marker — only
        // .story distinguishes it; the gate + CSS [data-live] do the hiding.
        expect([...panel.classList].filter((c) => c !== 'story')).toHaveLength(0)
      }
    }

    // (c) all content present in this never-firing baseline (SC#2 presence)
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(content.stories.length)
    for (const story of content.stories) {
      expect(screen.getByText(story.attribution)).toBeInTheDocument()
    }
  })

  it('exposes the progress indicator as decorative, not a progressbar (D-4)', () => {
    const { container } = render(<ResidentStories content={content} />)
    const progress = container.querySelector('[aria-hidden].progress')
    expect(progress).not.toBeNull()
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  it('gives the Section its accessible name (D-8)', () => {
    render(<ResidentStories content={content} />)
    expect(
      screen.getByRole('region', { name: /stories from people who made the move/i })
    ).toBeInTheDocument()
  })
})
