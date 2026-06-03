import type { ThemeName } from '@tokens/themes'

export type FeatureSpotlightContent = {
  eyebrow: string
  headline: string
  lead: string
  cta: { label: string; href: string }
  image: { src: string; alt: string }
  theme?: ThemeName
}
