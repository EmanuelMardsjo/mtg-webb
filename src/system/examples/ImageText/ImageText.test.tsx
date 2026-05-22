import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ImageText } from './ImageText'

const baseContent = {
  headline: 'Living by the water',
  body: 'Some prose.',
  image: { src: '/x.jpg', alt: 'archipelago' }
}

describe('ImageText', () => {
  it('renders headline and body', () => {
    render(<ImageText content={baseContent} />)
    expect(screen.getByRole('heading')).toHaveTextContent('Living by the water')
    expect(screen.getByText('Some prose.')).toBeInTheDocument()
  })

  it('renders image with required alt', () => {
    const { container } = render(<ImageText content={baseContent} />)
    expect(container.querySelector('img')).toHaveAttribute('alt', 'archipelago')
  })

  it('applies reversed layout via Col start when reversed=true', () => {
    const { container } = render(<ImageText content={{ ...baseContent, reversed: true }} />)
    // When reversed, the image column starts at col 3 on lg (text on col 1).
    const cols = container.querySelectorAll('[class*="col"]')
    const imageCol = cols[0] as HTMLElement
    expect(imageCol.style.getPropertyValue('--col-start-lg')).toBe('3')
  })
})
