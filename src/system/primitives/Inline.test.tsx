import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Inline } from './Inline'

describe('Inline', () => {
  it('applies gap=default class by default', () => {
    const { container } = render(<Inline>x</Inline>)
    expect(container.firstChild).toHaveClass('gap-default')
  })

  it('applies wrap class when wrap prop true', () => {
    const { container } = render(<Inline wrap>x</Inline>)
    expect(container.firstChild).toHaveClass('wrap')
  })
})
