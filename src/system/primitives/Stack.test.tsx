import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Stack } from './Stack'

describe('Stack', () => {
  it('applies gap=default class by default', () => {
    const { container } = render(<Stack>x</Stack>)
    expect(container.firstChild).toHaveClass('gap-default')
  })

  it('applies gap=loose class when prop set', () => {
    const { container } = render(<Stack gap="loose">x</Stack>)
    expect(container.firstChild).toHaveClass('gap-loose')
  })

  it('applies align=start class when prop set', () => {
    const { container } = render(<Stack align="start">x</Stack>)
    expect(container.firstChild).toHaveClass('align-start')
  })
})
