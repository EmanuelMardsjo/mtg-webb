// src/tokens/primitives/opacity.ts
export const opacity = {
  0:   '0',
  25:  '0.25',
  50:  '0.5',
  75:  '0.75',
  100: '1'
} as const

export type OpacityKey = keyof typeof opacity
