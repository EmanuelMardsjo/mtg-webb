import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Container } from './Container'

describe('Container', () => {
  it('renders children', () => {
    const { getByText } = render(<Container>hello</Container>)
    expect(getByText('hello')).toBeInTheDocument()
  })

  it('applies size=default class by default', () => {
    const { container } = render(<Container>x</Container>)
    expect(container.firstChild).toHaveClass('size-default')
  })

  it('applies size=prose class', () => {
    const { container } = render(<Container size="prose">x</Container>)
    expect(container.firstChild).toHaveClass('size-prose')
  })

  it('applies size=bleed class with no horizontal padding marker', () => {
    const { container } = render(<Container size="bleed">x</Container>)
    expect(container.firstChild).toHaveClass('size-bleed')
  })

  it('renders as <div> by default and accepts `as` override', () => {
    const { container } = render(<Container as="section">x</Container>)
    expect(container.firstChild?.nodeName).toBe('SECTION')
  })
})
