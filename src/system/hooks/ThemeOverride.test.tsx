import { describe, it, expect, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useState, useImperativeHandle, type Ref } from 'react'
import { ThemeOverrideProvider, useThemeOverride } from './ThemeOverride'

type Handle<T> = { current: T | null }

function TestConsumer({ theme }: { theme: 'blue' | 'pink' | null }) {
  useThemeOverride(theme)
  return null
}

function App({ initial, handleRef }: {
  initial: 'blue' | 'pink' | null
  handleRef?: Ref<{ setTheme: (t: 'blue' | 'pink' | null) => void }>
}) {
  const [theme, setTheme] = useState<'blue' | 'pink' | null>(initial)
  useImperativeHandle(handleRef, () => ({ setTheme }), [])
  return (
    <ThemeOverrideProvider>
      <TestConsumer theme={theme} />
    </ThemeOverrideProvider>
  )
}

describe('ThemeOverride', () => {
  beforeEach(() => {
    document.body.removeAttribute('data-theme')
  })

  it('sets data-theme on body when an override is active', () => {
    render(<App initial="blue" />)
    expect(document.body.getAttribute('data-theme')).toBe('blue')
  })

  it('removes data-theme when override clears', () => {
    const handle: Handle<{ setTheme: (t: 'blue' | 'pink' | null) => void }> = { current: null }
    render(<App initial="blue" handleRef={handle} />)
    act(() => { handle.current?.setTheme(null) })
    expect(document.body.hasAttribute('data-theme')).toBe(false)
  })

  it('most recently pushed override wins when multiple are active', () => {
    function Two() {
      useThemeOverride('blue')
      useThemeOverride('pink')
      return null
    }
    render(
      <ThemeOverrideProvider>
        <Two />
      </ThemeOverrideProvider>
    )
    expect(document.body.getAttribute('data-theme')).toBe('pink')
  })

  it('reverts to previous override after newest pops', () => {
    function Switcher({ showSecond }: { showSecond: boolean }) {
      useThemeOverride('blue')
      return showSecond ? <Inner /> : null
    }
    function Inner() {
      useThemeOverride('pink')
      return null
    }
    function Wrapper({ handleRef }: {
      handleRef: Ref<{ hide: () => void }>
    }) {
      const [show, setShow] = useState(true)
      useImperativeHandle(handleRef, () => ({ hide: () => setShow(false) }), [])
      return (
        <ThemeOverrideProvider>
          <Switcher showSecond={show} />
        </ThemeOverrideProvider>
      )
    }
    const handle: Handle<{ hide: () => void }> = { current: null }
    render(<Wrapper handleRef={handle} />)
    expect(document.body.getAttribute('data-theme')).toBe('pink')
    act(() => { handle.current?.hide() })
    expect(document.body.getAttribute('data-theme')).toBe('blue')
  })
})
