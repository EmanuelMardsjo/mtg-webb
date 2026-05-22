import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ThemeName } from '@tokens/themes'

type Ctx = {
  register: (id: number, theme: ThemeName) => void
  unregister: (id: number) => void
  allocate: () => number
}

const ThemeOverrideContext = createContext<Ctx | null>(null)

export type ThemeOverrideProviderProps = {
  scope?: 'body' | 'html'
  children: ReactNode
}

export function ThemeOverrideProvider({ scope = 'body', children }: ThemeOverrideProviderProps) {
  // Map of id → theme. Ids are allocated during render via `allocate()`, so they reflect
  // React's top-down render order: ancestors get lower ids than descendants, and within a
  // single component, earlier hooks get lower ids than later hooks. The entry with the
  // highest id wins — meaning the deepest / source-order-latest override is applied.
  const [, force] = useState(0)
  const entriesRef = useRef<Map<number, ThemeName>>(new Map())
  const idRef = useRef(0)

  const ctx = useMemo<Ctx>(() => ({
    register: (id, theme) => {
      entriesRef.current.set(id, theme)
      force(n => n + 1)
    },
    unregister: id => {
      if (entriesRef.current.delete(id)) {
        force(n => n + 1)
      }
    },
    allocate: () => ++idRef.current
  }), [])

  useEffect(() => {
    const target = scope === 'html' ? document.documentElement : document.body
    let topId = -1
    let topTheme: ThemeName | null = null
    for (const [id, theme] of entriesRef.current) {
      if (id > topId) {
        topId = id
        topTheme = theme
      }
    }
    if (topTheme) target.setAttribute('data-theme', topTheme)
    else target.removeAttribute('data-theme')
    return () => {
      target.removeAttribute('data-theme')
    }
  })

  return <ThemeOverrideContext.Provider value={ctx}>{children}</ThemeOverrideContext.Provider>
}

export function useThemeOverride(theme: ThemeName | null): void {
  const ctx = useContext(ThemeOverrideContext)

  // Allocate a stable id once per consumer using useState's lazy initializer.
  // This runs during render in React's top-down order, so ancestors get lower ids than
  // descendants and earlier-in-source hooks get lower ids than later ones. Highest id wins.
  const [id] = useState<number | null>(() => (ctx ? ctx.allocate() : null))

  useEffect(() => {
    if (!ctx || id === null) return
    if (theme) {
      ctx.register(id, theme)
      return () => {
        ctx.unregister(id)
      }
    }
  }, [ctx, id, theme])
}
