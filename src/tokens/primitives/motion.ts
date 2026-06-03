// src/tokens/primitives/motion.ts
export const duration = {
  fast:    '200ms',
  base:    '400ms',
  slow:    '700ms'
} as const

export const easing = {
  standard: 'cubic-bezier(0.51, 0.09, 0, 0.88)'
} as const

export type DurationKey = keyof typeof duration
export type EasingKey   = keyof typeof easing
