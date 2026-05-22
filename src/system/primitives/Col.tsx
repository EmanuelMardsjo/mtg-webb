import { type CSSProperties, type ReactNode } from 'react'
import s from './Col.module.css'

type Bp = 'sm' | 'md' | 'lg'

export type ColProps = {
  span?: Partial<Record<Bp, number>>
  start?: Partial<Record<Bp, number>>
  className?: string
  children: ReactNode
}

export function Col({ span = {}, start = {}, className, children }: ColProps) {
  const style: CSSProperties & Record<string, string | number> = {}
  if (span.sm !== undefined) style['--col-span-sm'] = String(span.sm)
  if (span.md !== undefined) style['--col-span-md'] = String(span.md)
  if (span.lg !== undefined) style['--col-span-lg'] = String(span.lg)
  if (start.lg !== undefined) style['--col-start-lg'] = String(start.lg)
  return <div className={[s.col, className].filter(Boolean).join(' ')} style={style}>{children}</div>
}
