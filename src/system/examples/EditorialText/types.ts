import type { ThemeName } from '@tokens/themes'

export type EditorialTextContent = {
  heading?: string
  paragraphs: string[]
  pullQuote?: string
  theme?: ThemeName
}
