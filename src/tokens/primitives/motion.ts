// src/tokens/primitives/motion.ts
export const duration = {
  instant: '0ms',
  micro:   '120ms',
  fast:    '200ms',
  base:    '320ms',
  slow:    '500ms',
  ambient: '900ms'
} as const

export const easing = {
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
  enter:    'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
  exit:     'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
  emphasis: 'cubic-bezier(0.2, 0.0, 0.0, 1.0)',
  linear:   'linear'
} as const

export type DurationKey = keyof typeof duration
export type EasingKey   = keyof typeof easing
