import { type ReactNode } from 'react'
import s from './Grid.module.css'

export type GridProps = {
  className?: string
  children: ReactNode
}

export function Grid({ className, children }: GridProps) {
  return <div className={[s.grid, className].filter(Boolean).join(' ')}>{children}</div>
}
