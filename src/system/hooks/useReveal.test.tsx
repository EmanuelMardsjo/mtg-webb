import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useReveal } from './useReveal'

let observerCallback: IntersectionObserverCallback | null = null

class MockObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb
  }
}

beforeEach(() => {
  ;(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
    MockObserver as unknown as typeof IntersectionObserver
  observerCallback = null
})

function Comp() {
  const { ref, revealed } = useReveal()
  return <div ref={ref} data-revealed={revealed ? 'true' : 'false'}>x</div>
}

describe('useReveal', () => {
  it('starts not revealed', () => {
    const { container } = render(<Comp />)
    expect(container.firstChild).toHaveAttribute('data-revealed', 'false')
  })

  it('transitions to revealed when the element intersects', () => {
    const { container } = render(<Comp />)
    act(() => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    })
    expect(container.firstChild).toHaveAttribute('data-revealed', 'true')
  })

  it('does not revert once revealed', () => {
    const { container } = render(<Comp />)
    act(() => {
      observerCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)
    })
    act(() => {
      observerCallback?.([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver)
    })
    expect(container.firstChild).toHaveAttribute('data-revealed', 'true')
  })
})
