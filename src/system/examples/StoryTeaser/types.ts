import type { ThemeName } from '@tokens/themes'
import type { ImageFocalPoint } from '@system/primitives'

export type StoryTeaserContent = {
  tag?: string
  headline: string
  excerpt?: string
  image?: { src: string; alt: string; focalPoint?: ImageFocalPoint }
  byline?: { name: string; role?: string }
  cta?: { label: string; href: string }
  theme?: ThemeName
}
