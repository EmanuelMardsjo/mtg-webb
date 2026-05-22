// src/tokens/primitives/type.ts

export const fontFamily = {
  display: `'Cabinet Grotesk', 'Inter', system-ui, sans-serif`,
  body:    `'Satoshi', 'Inter', system-ui, sans-serif`
} as const

export const fontWeight = {
  // Cabinet Grotesk
  'display-light':  300,
  'display-medium': 500,
  // Satoshi
  'body-regular':   400,
  'body-medium':    500
} as const

// Fluid clamp() scale — readable from 320px to 2560px viewport.
export const fontSize = {
  '3xs': 'clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem)',
  '2xs': 'clamp(0.8125rem, 0.75rem + 0.3vw, 0.875rem)',
  'xs':  'clamp(0.875rem, 0.8rem + 0.4vw, 0.9375rem)',
  'sm':  'clamp(0.9375rem, 0.85rem + 0.5vw, 1rem)',
  'md':  'clamp(1rem, 0.95rem + 0.5vw, 1.125rem)',
  'lg':  'clamp(1.125rem, 1rem + 0.8vw, 1.375rem)',
  'xl':  'clamp(1.375rem, 1.1rem + 1.5vw, 1.875rem)',
  '2xl': 'clamp(1.75rem, 1.3rem + 2.5vw, 2.75rem)',
  '3xl': 'clamp(2.25rem, 1.5rem + 4vw, 4rem)',
  '4xl': 'clamp(2.75rem, 1.8rem + 6vw, 5.5rem)',
  '5xl': 'clamp(3.25rem, 2rem + 8vw, 7.5rem)'
} as const

export const lineHeight = {
  none:    '1',
  display: '0.95',
  hero:    '1.0',
  h1:      '1.05',
  h2:      '1.1',
  h3:      '1.15',
  quote:   '1.3',
  body:    '1.55',
  lead:    '1.45',
  meta:    '1.4',
  tag:     '1.2',
  button:  '1.0'
} as const

export const tracking = {
  display: '-0.02em',
  hero:    '-0.015em',
  h1:      '-0.01em',
  h2:      '-0.005em',
  none:    '0',
  caption: '0.01em',
  button:  '0.02em',
  tag:     '0.08em',
  quote:   '-0.005em'
} as const

export type FontSizeKey   = keyof typeof fontSize
export type FontFamilyKey = keyof typeof fontFamily
