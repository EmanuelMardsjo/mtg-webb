import type { ThemeName } from '@tokens/themes'
import type { ImageAspect, ImageFocalPoint } from '@system/primitives'

export type ImageTextContent = {
  eyebrow?: string
  headline: string
  body?: string
  image: { src: string; alt: string; aspect?: ImageAspect; focalPoint?: ImageFocalPoint }
  cta?: { label: string; href: string }
  reversed?: boolean
  bleed?: boolean
  theme?: ThemeName
}
