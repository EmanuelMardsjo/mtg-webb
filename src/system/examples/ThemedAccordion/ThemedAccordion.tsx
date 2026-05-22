// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { useState, type ReactNode } from 'react'
import { Text, Icon } from '@system/primitives'
import { useThemeOverride } from '@system/hooks'
import type { ThemedAccordionContent } from './types'
import s from './ThemedAccordion.module.css'

export type ThemedAccordionProps = {
  content: ThemedAccordionContent
  children: ReactNode
}

export function ThemedAccordion({ content, children }: ThemedAccordionProps) {
  const [open, setOpen] = useState(false)
  useThemeOverride(open ? content.theme : null)
  return (
    <details className={s.root} onToggle={e => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary className={s.summary}>
        <Text role="h3" as="span">{content.summary}</Text>
        <Icon name={open ? 'check' : 'arrow-right'} size="md" aria-hidden />
      </summary>
      <div className={s.body}>{children}</div>
    </details>
  )
}
