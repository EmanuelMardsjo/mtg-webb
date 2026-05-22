import { themes, themeNames } from '../themes'
import { contrastRatio } from './contrast'

const HEX_RE = /#[0-9a-fA-F]{6}/

function extractHex(v: string): string | null {
  const m = v.match(HEX_RE)
  return m ? m[0] : null
}

export type ContrastError = {
  theme: string
  text: string
  surface: string
  ratio: number
}

// AA threshold for normal text.
export const AA_NORMAL = 4.5

export function verifyThemeContrast(): ContrastError[] {
  const errors: ContrastError[] = []
  for (const name of themeNames) {
    if (name === 'campaign') continue // runtime values, not verifiable here
    const t = themes[name]
    const surface = extractHex(t['surface-page'])
    const text    = extractHex(t['text-default'])
    if (!surface || !text) continue
    const ratio = contrastRatio(text, surface)
    if (ratio < AA_NORMAL) {
      errors.push({ theme: name, text, surface, ratio })
    }
  }
  return errors
}
