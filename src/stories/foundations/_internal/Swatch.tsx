import { Text } from '@system/primitives'
import type { ReactNode } from 'react'
import s from './Swatch.module.css'

export function Swatch({ name, value, color, isBrandColor }: { name: string; value: string; color: string; isBrandColor?: boolean }) {
  return (
    <div className={[s.swatch, isBrandColor ? s.brand : null].filter(Boolean).join(' ')}>
      <div className={s.chip} style={{ background: color }} />
      <span className={s.labelRow}>
        <Text role="meta" as="span">{name}</Text>
        {isBrandColor && <span className={s.tag}>Brand color</span>}
      </span>
      <Text role="caption" tone="muted" as="span">{value}</Text>
    </div>
  )
}

export function SwatchRow({ children }: { children: ReactNode }) {
  return <div className={s.row}>{children}</div>
}
