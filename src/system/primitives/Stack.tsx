import { type ReactNode } from 'react'
import s from './Stack.module.css'

export type StackGap = 'tight' | 'snug' | 'default' | 'loose' | 'xl'
export type StackAlign = 'start' | 'center' | 'end' | 'stretch'

export type StackProps = {
  gap?: StackGap
  align?: StackAlign
  className?: string
  children: ReactNode
}

export function Stack({ gap = 'default', align, className, children }: StackProps) {
  const cls = [s.stack, s[`gap-${gap}`], align && s[`align-${align}`], className].filter(Boolean).join(' ')
  return <div className={cls}>{children}</div>
}
