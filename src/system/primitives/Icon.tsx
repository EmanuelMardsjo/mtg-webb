import { type ReactNode, type SVGProps } from 'react'
import { ArrowRight } from './icons/ArrowRight'
import { Check } from './icons/Check'
import { MapPin } from './icons/MapPin'
import s from './Icon.module.css'

export type IconName = 'arrow-right' | 'check' | 'map-pin'
export type IconSize = 'sm' | 'md' | 'lg'

export type IconProps = {
  name: IconName
  size?: IconSize
  className?: string
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'fill' | 'stroke'>

const glyphs: Record<IconName, () => ReactNode> = {
  'arrow-right': ArrowRight,
  'check': Check,
  'map-pin': MapPin
}

export function Icon({ name, size = 'md', className, ...rest }: IconProps) {
  const Glyph = glyphs[name]
  const cls = [s.icon, s[`size-${size}`], className].filter(Boolean).join(' ')
  return (
    <svg viewBox="0 0 24 24" className={cls} role={rest['aria-label'] ? 'img' : undefined} {...rest}>
      <Glyph />
    </svg>
  )
}
