// src/tokens/primitives/space.ts
// Base unit 4px. Twelve steps, editorial breathing-room friendly.

export const space = {
  0:  '0',
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '24px',
  6:  '32px',
  7:  '48px',
  8:  '64px',
  9:  '96px',
  10: '128px',
  11: '192px',
  12: '256px'
} as const

export type SpaceKey = keyof typeof space
