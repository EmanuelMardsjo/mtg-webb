import { type CSSProperties } from 'react'
import s from './Image.module.css'

export type ImageRadius = 'none' | 'sm' | 'md' | 'lg'
export type ImageAspect = 'square' | 'portrait' | 'landscape' | 'wide' | 'cinematic'
export type ImageFocalPoint = 'top' | 'center' | 'bottom' | 'left' | 'right'

export type ImageProps = {
  src: string
  alt: string
  radius?: ImageRadius
  aspect?: ImageAspect
  focalPoint?: ImageFocalPoint
  loading?: 'lazy' | 'eager'
  className?: string
}

export function Image({ src, alt, radius = 'none', aspect, focalPoint = 'center', loading = 'lazy', className }: ImageProps) {
  const style: CSSProperties = { objectPosition: focalPoint }
  const cls = [s.image, s[`radius-${radius}`], aspect && s[`aspect-${aspect}`], className].filter(Boolean).join(' ')
  return <img src={src} alt={alt} loading={loading} className={cls} style={style} />
}
