import { type ReactNode } from 'react'
import type { ThemeName } from '@tokens/themes'
import s from './Surface.module.css'

export type SurfaceProps = {
  theme?: ThemeName
  className?: string
  children: ReactNode
}

export function Surface({ theme, className, children }: SurfaceProps) {
  return (
    <div className={[s.surface, className].filter(Boolean).join(' ')} data-theme={theme}>
      {children}
    </div>
  )
}
