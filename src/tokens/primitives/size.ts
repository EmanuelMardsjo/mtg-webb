// src/tokens/primitives/size.ts
// Fixed-size primitives for icons, avatars, frames.

export const size = {
  '3xs': '12px',
  '2xs': '16px',
  'xs':  '20px',
  'sm':  '24px',
  'md':  '32px',
  'lg':  '48px',
  'xl':  '64px',
  '2xl': '96px',
  '3xl': '128px'
} as const

export const iconSize = {
  sm: '16px',
  md: '20px',
  lg: '28px'
} as const

export type SizeKey = keyof typeof size
export type IconSizeKey = keyof typeof iconSize
