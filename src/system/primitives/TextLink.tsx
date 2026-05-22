import { type AnchorHTMLAttributes, type ReactNode } from 'react'
import { Icon } from './Icon'
import s from './TextLink.module.css'

export type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  arrow?: boolean
  children: ReactNode
}

export function TextLink({ arrow, className, children, ...rest }: TextLinkProps) {
  return (
    <a className={[s.link, className].filter(Boolean).join(' ')} {...rest}>
      <span>{children}</span>
      {arrow && <Icon name="arrow-right" size="sm" aria-hidden />}
    </a>
  )
}
