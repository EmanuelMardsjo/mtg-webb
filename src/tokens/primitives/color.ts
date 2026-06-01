// src/tokens/primitives/color.ts
// Raw color values. Components must NEVER consume these directly —
// they reach color only via semantic roles in src/tokens/semantic/color.ts.

export const palette = {
  neutral: {
    50:  '#FFFEF2',
    100: '#FAF6E9',
    200: '#EEE5D8',
    300: '#DED1C5',
    400: '#CCBAAD',
    500: '#B59F94',
    600: '#96817A',
    700: '#6F5E5B',
    800: '#433535',
    900: '#322727',
    950: '#2A2020'
  },
  blue: {
    50:  '#F7FCFF',
    100: '#ECF6FC',
    200: '#D5E9F7',
    300: '#ADCBEB',
    400: '#86AEDE',
    500: '#5F90D0',
    600: '#3773C1',
    700: '#0054B2',
    800: '#003C81',
    900: '#002653',
    950: '#001B3E'
  },
  yellow: {
    50:  '#FFFFF3',
    100: '#FFFFC6',
    200: '#FFFD8C',
    300: '#F4E66B',
    400: '#E5CC48',
    500: '#D0AD24',
    600: '#B68D00',
    700: '#946D00',
    800: '#704F00',
    900: '#4F3700',
    950: '#1E1300'
  },
  amber: {
    50:  '#FFF8F0',
    100: '#FFE8CC',
    200: '#FFD0A3',
    300: '#F9B36E',
    400: '#EA9140',
    500: '#D37118',
    600: '#C45B00',
    700: '#BB4B00',
    800: '#8C3000',
    900: '#5F1A00',
    950: '#2B0A00'
  },
  pink: {
    50:  '#FFF8F6',
    100: '#FBEDE8',
    200: '#F4DBD2',
    300: '#E9BDB1',
    400: '#DA9B8E',
    500: '#C6786B',
    600: '#AA574E',
    700: '#873C35',
    800: '#612A25',
    900: '#3D1A17',
    950: '#240D0C'
  }
} as const

export const brandColorSteps = {
  neutral: [50, 800],
  blue: [200, 700],
  yellow: [200],
  amber: [700, 900],
  pink: [200]
} as const satisfies {
  [Family in keyof typeof palette]: readonly (keyof typeof palette[Family])[]
}

export const status = {
  success: '#3F6B4A',
  warning: '#7A5A1F',
  danger:  '#7A3A2A',
  info:    palette.blue[400]
} as const

export const overlay = {
  'neutral-dark': 'rgba(42, 32, 32, 0.6)',
  scrim:          'rgba(42, 32, 32, 0.85)',
  neutral:        'rgba(255, 254, 242, 0.85)'
} as const

export type PaletteFamily = keyof typeof palette
