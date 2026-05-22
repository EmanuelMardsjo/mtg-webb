import { type ElementType, type ReactNode } from 'react'
import s from './Container.module.css'

type ContainerSize = 'prose' | 'default' | 'wide' | 'bleed'

export type ContainerProps = {
  size?: ContainerSize
  as?: ElementType
  className?: string
  children: ReactNode
}

export function Container({ size = 'default', as: Tag = 'div', className, children }: ContainerProps) {
  const cls = [s.container, s[`size-${size}`], className].filter(Boolean).join(' ')
  return <Tag className={cls}>{children}</Tag>
}
