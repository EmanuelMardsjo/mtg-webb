import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeOverrideProvider } from '@system/hooks'
import { ThemedAccordion } from './ThemedAccordion'

function setup() {
  return render(
    <ThemeOverrideProvider>
      <ThemedAccordion content={{ theme: 'pink', summary: 'Family' }}>
        <div>Inner</div>
      </ThemedAccordion>
    </ThemeOverrideProvider>
  )
}

describe('ThemedAccordion', () => {
  it('renders the summary text', () => {
    setup()
    expect(screen.getByText('Family')).toBeInTheDocument()
  })

  it('does not set page theme when closed', () => {
    document.body.removeAttribute('data-theme')
    setup()
    expect(document.body.hasAttribute('data-theme')).toBe(false)
  })

  it('sets page theme to pink when opened', () => {
    document.body.removeAttribute('data-theme')
    const { container } = setup()
    const details = container.querySelector('details')!
    // jsdom doesn't toggle <details> on click — set open and fire toggle
    details.open = true
    fireEvent(details, new Event('toggle'))
    expect(document.body.getAttribute('data-theme')).toBe('pink')
  })
})
