import type { ThemeName } from '@tokens/themes'

export type SignpostItem = { label: string; href: string; description?: string }
export type SignpostContent = {
  eyebrow?: string
  heading: string
  items: SignpostItem[]
  theme?: ThemeName
}
