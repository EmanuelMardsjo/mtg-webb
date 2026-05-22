import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TextLink } from './TextLink'

describe('TextLink', () => {
  it('renders an <a> with href', () => {
    const { container } = render(<TextLink href="/x">go</TextLink>)
    const a = container.querySelector('a')
    expect(a).toHaveAttribute('href', '/x')
  })

  it('renders an arrow icon when arrow prop is true', () => {
    const { container } = render(<TextLink href="/x" arrow>go</TextLink>)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
