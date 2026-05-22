import { Text } from '@system/primitives'
import type { ReactNode } from 'react'
import s from './Swatch.module.css'

export function Swatch({ name, value, color }: { name: string; value: string; color: string }) {
  return (
    <div className={s.swatch}>
      <div className={s.chip} style={{ background: color }} />
      <Text role="meta" as="span">{name}</Text>
      <Text role="caption" tone="muted" as="span">{value}</Text>
    </div>
  )
}

export function SwatchRow({ children }: { children: ReactNode }) {
  return <div className={s.row}>{children}</div>
}
