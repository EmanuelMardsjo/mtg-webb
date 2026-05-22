import s from './Divider.module.css'

export type DividerWeight = 'thin' | 'strong'

export type DividerProps = {
  weight?: DividerWeight
  className?: string
}

export function Divider({ weight = 'thin', className }: DividerProps) {
  const cls = [s.divider, weight === 'strong' && s['weight-strong'], className].filter(Boolean).join(' ')
  return <hr className={cls} />
}
