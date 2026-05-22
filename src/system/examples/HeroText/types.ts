import type { ThemeName } from '@tokens/themes'

export type HeroTextContent = {
  eyebrow?: string
  headline: string
  lead?: string
  cta?: { label: string; href: string }
  theme?: ThemeName
}
