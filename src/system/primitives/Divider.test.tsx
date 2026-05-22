import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders an <hr> with the divider class', () => {
    const { container } = render(<Divider />)
    expect(container.firstChild?.nodeName).toBe('HR')
    expect(container.firstChild).toHaveClass('divider')
  })

  it('applies weight=strong class', () => {
    const { container } = render(<Divider weight="strong" />)
    expect(container.firstChild).toHaveClass('weight-strong')
  })
})
