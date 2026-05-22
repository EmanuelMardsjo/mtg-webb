import { type ElementType, type ReactNode } from 'react'
import type { TextRole } from '@tokens/semantic/type'
import s from './Text.module.css'

const defaultTag: Record<TextRole, ElementType> = {
  display: 'h1', hero: 'h1', h1: 'h1', h2: 'h2', h3: 'h3',
  lead: 'p', body: 'p', 'body-sm': 'p',
  caption: 'span', meta: 'span', tag: 'span', quote: 'blockquote', button: 'span'
}

const roleClass: Record<TextRole, string> = {
  display: 'role-display', hero: 'role-hero', h1: 'role-h1', h2: 'role-h2', h3: 'role-h3',
  lead: 'role-lead', body: 'role-body', 'body-sm': 'role-bodysm',
  caption: 'role-caption', meta: 'role-meta', tag: 'role-tag', quote: 'role-quote', button: 'role-button'
}

export type TextTone = 'strong' | 'default' | 'muted'

export type TextProps = {
  role: TextRole
  as?: ElementType
  tone?: TextTone
  className?: string
  children: ReactNode
}

export function Text({ role, as, tone, className, children }: TextProps) {
  const Tag = as ?? defaultTag[role]
  const cls = [s.text, s[roleClass[role]], tone && s[`tone-${tone}`], className].filter(Boolean).join(' ')
  return <Tag className={cls}>{children}</Tag>
}
