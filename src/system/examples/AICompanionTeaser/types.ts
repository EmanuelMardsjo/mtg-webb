import type { ThemeName } from '@tokens/themes'

export type AICompanionTeaserContent = {
  eyebrow?: string
  headline: string
  body?: string
  prompt: string
  cta: { label: string; href: string }
  theme?: ThemeName
}
