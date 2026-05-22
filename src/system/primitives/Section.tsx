import { type HTMLAttributes, type ReactNode } from 'react'
import type { ThemeName } from '@tokens/themes'
import s from './Section.module.css'

export type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl'

export type SectionProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  theme?: ThemeName
  spacing?: SectionSpacing
  bleed?: boolean
  className?: string
  children: ReactNode
}

export function Section({ theme, spacing = 'md', bleed, className, children, ...rest }: SectionProps) {
  const cls = [s.section, s[`spacing-${spacing}`], bleed && s.bleed, className].filter(Boolean).join(' ')
  return (
    <section {...rest} className={cls} data-theme={theme}>
      {children}
    </section>
  )
}
