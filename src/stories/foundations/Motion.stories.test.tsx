import type { ReactElement } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tokens } from './Motion.stories'

describe('Motion story', () => {
  it('waits for play before animating duration tokens', async () => {
    const user = userEvent.setup()
    const renderTokens = Tokens.render as (() => ReactElement) | undefined
    const { container } = render(renderTokens?.() ?? null)
    const bars = Array.from(container.querySelectorAll<HTMLElement>('.motion-duration-bar'))

    expect(bars).toHaveLength(3)
    expect(bars.every(bar => bar.style.animation === '')).toBe(true)

    await user.click(screen.getByRole('button', { name: 'Play' }))

    const playedBars = Array.from(container.querySelectorAll<HTMLElement>('.motion-duration-bar'))
    expect(playedBars.every(bar => bar.style.animation === '')).toBe(false)
    expect(container.querySelector<HTMLElement>('.motion-duration-bar')?.style.animation)
      .toContain('motion-token-slide')
  })
})
