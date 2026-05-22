// src/tokens/primitives/color.ts
// Raw color values. Components must NEVER consume these directly —
// they reach color only via semantic roles in src/tokens/semantic/color.ts.

export const palette = {
  bone: {
    50:  '#FBF8F3',
    100: '#F5EFE5',
    200: '#EBE3D2'
  },
  navy: {
    700: '#1B2740',
    800: '#121A2E',
    900: '#0A1020'
  },
  sky: {
    100: '#E6EDF5',
    200: '#C9D6E6',
    400: '#7C9BBE',
    600: '#3D5878'   // reserved for future deeper-tinted themes
  },
  clay: {
    100: '#F4E4D3',
    200: '#E8C8AC',
    400: '#C68C66',
    600: '#86553A'   // reserved
  },
  sage: {
    100: '#E5EADC',
    200: '#C7D2B7',
    400: '#869670',
    600: '#4F5C40'   // reserved
  }
} as const

export const status = {
  success: '#3F6B4A',
  warning: '#7A5A1F',
  danger:  '#7A3A2A',
  info:    palette.sky[400]
} as const

export const overlay = {
  ink:   'rgba(10, 16, 32, 0.6)',
  scrim: 'rgba(10, 16, 32, 0.85)',
  bone:  'rgba(251, 248, 243, 0.85)'
} as const

export type PaletteFamily = keyof typeof palette
