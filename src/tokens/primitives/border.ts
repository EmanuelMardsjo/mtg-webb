// src/tokens/primitives/border.ts
export const borderWidth = {
  hairline: '1px',
  thin:     '1px',
  strong:   '2px'
} as const

export type BorderWidthKey = keyof typeof borderWidth
