// src/tokens/primitives/radius.ts
export const radius = {
  none: '0',
  xs:   '2px',
  sm:   '4px',
  md:   '8px',
  lg:   '16px',
  pill: '9999px',
  full: '50%'
} as const

export type RadiusKey = keyof typeof radius
