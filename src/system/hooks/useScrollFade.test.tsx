import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { useScrollFade } from './useScrollFade'

function Comp() {
  const { ref, progress } = useScrollFade()
  return <div ref={ref} data-progress={progress.toFixed(2)}>x</div>
}

describe('useScrollFade', () => {
  it('initially reports progress=0', () => {
    const { container } = render(<Comp />)
    expect(container.firstChild).toHaveAttribute('data-progress', '0.00')
  })
})
