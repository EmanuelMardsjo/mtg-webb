import { describe, it, expect, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { useState, useImperativeHandle, type Ref } from 'react'
import { ThemeOverrideProvider, useThemeOverride } from './ThemeOverride'

type Handle<T> = { current: T | null }

function TestConsumer({ theme }: { theme: 'sky' | 'clay' | null }) {
  useThemeOverride(theme)
  return null
}

function App({ initial, handleRef }: {
  initial: 'sky' | 'clay' | null
  handleRef?: Ref<{ setTheme: (t: 'sky' | 'clay' | null) => void }>
}) {
  const [theme, setTheme] = useState<'sky' | 'clay' | null>(initial)
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
    render(<App initial="sky" />)
    expect(document.body.getAttribute('data-theme')).toBe('sky')
  })

  it('removes data-theme when override clears', () => {
    const handle: Handle<{ setTheme: (t: 'sky' | 'clay' | null) => void }> = { current: null }
    render(<App initial="sky" handleRef={handle} />)
    act(() => { handle.current?.setTheme(null) })
    expect(document.body.hasAttribute('data-theme')).toBe(false)
  })

  it('most recently pushed override wins when multiple are active', () => {
    function Two() {
      useThemeOverride('sky')
      useThemeOverride('clay')
      return null
    }
    render(
      <ThemeOverrideProvider>
        <Two />
      </ThemeOverrideProvider>
    )
    expect(document.body.getAttribute('data-theme')).toBe('clay')
  })

  it('reverts to previous override after newest pops', () => {
    function Switcher({ showSecond }: { showSecond: boolean }) {
      useThemeOverride('sky')
      return showSecond ? <Inner /> : null
    }
    function Inner() {
      useThemeOverride('clay')
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
    expect(document.body.getAttribute('data-theme')).toBe('clay')
    act(() => { handle.current?.hide() })
    expect(document.body.getAttribute('data-theme')).toBe('sky')
  })
})
