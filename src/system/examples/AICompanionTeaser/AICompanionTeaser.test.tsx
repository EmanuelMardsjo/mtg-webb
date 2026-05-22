import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AICompanionTeaser } from './AICompanionTeaser'

describe('AICompanionTeaser', () => {
  it('renders headline + prompt', () => {
    render(<AICompanionTeaser content={{
      headline: 'Ask the guide anything.',
      prompt: 'How much does childcare cost?',
      cta: { label: 'Open guide', href: '/guide' }
    }} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Ask the guide anything.')
    expect(screen.getByText(/How much does childcare cost\?/)).toBeInTheDocument()
  })

  it('renders on ink theme by default', () => {
    const { container } = render(<AICompanionTeaser content={{
      headline: 'x', prompt: 'y', cta: { label: 'go', href: '/' }
    }} />)
    expect(container.firstChild).toHaveAttribute('data-theme', 'ink')
  })
})
