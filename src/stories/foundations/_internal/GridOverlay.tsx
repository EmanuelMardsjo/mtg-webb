import type { ReactNode } from 'react'
import s from './GridOverlay.module.css'

export function GridOverlay({ children, on }: { children: ReactNode; on: boolean }) {
  return <div className={on ? s.overlay : ''}>{children}</div>
}

export function Block({ label }: { label: string }) {
  return (
    <div style={{
      background: 'var(--color-surface-raised)',
      padding: 'var(--space-stack-loose)',
      borderRadius: 'var(--radius-sm)',
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-sm)',
      color: 'var(--color-text-muted)'
    }}>{label}</div>
  )
}
