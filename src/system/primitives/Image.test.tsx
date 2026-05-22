import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Image } from './Image'

describe('Image', () => {
  it('renders an <img> with required alt + src', () => {
    const { container } = render(<Image src="/x.jpg" alt="hello" />)
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('src', '/x.jpg')
    expect(img).toHaveAttribute('alt', 'hello')
  })

  it('applies radius=md class when prop set', () => {
    const { container } = render(<Image src="/x.jpg" alt="hello" radius="md" />)
    expect(container.querySelector('img')).toHaveClass('radius-md')
  })

  it('sets object-position via focalPoint', () => {
    const { container } = render(<Image src="/x.jpg" alt="hello" focalPoint="top" />)
    const img = container.querySelector('img') as HTMLImageElement
    expect(img.style.objectPosition).toBe('top')
  })
})
