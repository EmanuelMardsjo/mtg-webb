import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders ArrowRight svg by name', () => {
    const { container } = render(<Icon name="arrow-right" aria-label="next" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies size=md class by default', () => {
    const { container } = render(<Icon name="check" aria-hidden />)
    expect(container.querySelector('svg')).toHaveClass('size-md')
  })

  it('applies size=lg class when prop set', () => {
    const { container } = render(<Icon name="map-pin" size="lg" aria-hidden />)
    expect(container.querySelector('svg')).toHaveClass('size-lg')
  })
})
