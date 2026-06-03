import { describe, it, expect, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { useParallax } from './useParallax'

function Comp() {
  const { ref } = useParallax()
  return <div ref={ref} data-testid="px">x</div>
}

afterEach(() => {
  // Reset the Storybook reduced-motion class so it does not leak to other tests.
  document.documentElement.classList.remove('force-reduced-motion')
})

describe('useParallax', () => {
  it('does not throw and attaches a ref in jsdom', () => {
    const { getByTestId } = render(<Comp />)
    expect(getByTestId('px')).toBeInTheDocument()
  })

  it('writes no parallax vars under reduced motion (guard path attaches no listener)', () => {
    document.documentElement.classList.add('force-reduced-motion')
    const { getByTestId } = render(<Comp />)
    const el = getByTestId('px')
    expect(el.style.getPropertyValue('--parallax-text')).toBe('')
  })
})
