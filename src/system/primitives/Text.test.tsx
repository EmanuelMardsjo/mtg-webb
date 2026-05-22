import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Text } from './Text'

describe('Text', () => {
  it('renders body role as <p> by default', () => {
    const { container } = render(<Text role="body">x</Text>)
    expect(container.firstChild?.nodeName).toBe('P')
  })

  it('renders h1 role as <h1> by default', () => {
    const { container } = render(<Text role="h1">x</Text>)
    expect(container.firstChild?.nodeName).toBe('H1')
  })

  it('renders display role as <h1> by default', () => {
    const { container } = render(<Text role="display">x</Text>)
    expect(container.firstChild?.nodeName).toBe('H1')
  })

  it('renders tag role as <span> by default', () => {
    const { container } = render(<Text role="tag">x</Text>)
    expect(container.firstChild?.nodeName).toBe('SPAN')
  })

  it('respects `as` override', () => {
    const { container } = render(<Text role="display" as="h2">x</Text>)
    expect(container.firstChild?.nodeName).toBe('H2')
  })

  it('applies the role class', () => {
    const { container } = render(<Text role="lead">x</Text>)
    expect(container.firstChild).toHaveClass('role-lead')
  })
})
