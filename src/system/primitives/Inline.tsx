import { type ReactNode } from 'react'
import s from './Inline.module.css'

export type InlineGap = 'tight' | 'default' | 'loose'
export type InlineJustify = 'start' | 'center' | 'end' | 'between'
export type InlineAlign = 'start' | 'center' | 'end' | 'baseline'

export type InlineProps = {
  gap?: InlineGap
  wrap?: boolean
  justify?: InlineJustify
  align?: InlineAlign
  className?: string
  children: ReactNode
}

export function Inline({ gap = 'default', wrap, justify, align, className, children }: InlineProps) {
  const cls = [s.inline, s[`gap-${gap}`], wrap && s.wrap, justify && s[`justify-${justify}`], align && s[`align-${align}`], className].filter(Boolean).join(' ')
  return <div className={cls}>{children}</div>
}
