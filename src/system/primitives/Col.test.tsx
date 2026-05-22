import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Col } from './Col'

describe('Col', () => {
  it('renders children', () => {
    const { getByText } = render(<Col>hello</Col>)
    expect(getByText('hello')).toBeInTheDocument()
  })

  it('sets inline style custom properties for span per breakpoint', () => {
    const { container } = render(<Col span={{ sm: 1, md: 2, lg: 3 }}>x</Col>)
    const el = container.firstChild as HTMLElement
    expect(el.style.getPropertyValue('--col-span-sm')).toBe('1')
    expect(el.style.getPropertyValue('--col-span-md')).toBe('2')
    expect(el.style.getPropertyValue('--col-span-lg')).toBe('3')
  })

  it('sets inline style custom property for lg start when provided', () => {
    const { container } = render(<Col span={{ lg: 3 }} start={{ lg: 2 }}>x</Col>)
    const el = container.firstChild as HTMLElement
    expect(el.style.getPropertyValue('--col-start-lg')).toBe('2')
  })
})
