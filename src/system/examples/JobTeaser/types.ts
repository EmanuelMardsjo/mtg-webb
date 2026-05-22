import type { ThemeName } from '@tokens/themes'

export type JobTeaserContent = {
  tag?: string
  role: string
  location: string
  summary?: string
  meta?: { company?: string; posted?: string }
  cta?: { label: string; href: string }
  theme?: ThemeName
}
