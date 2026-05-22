import type { ThemeName } from '@tokens/themes'

export type ChecklistItem = { label: string; description?: string }
export type ChecklistTeaserContent = {
  eyebrow?: string
  heading: string
  intro?: string
  items: ChecklistItem[]
  theme?: ThemeName
}
