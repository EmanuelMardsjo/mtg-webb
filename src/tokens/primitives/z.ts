// src/tokens/primitives/z.ts
export const z = {
  base:    '0',
  raised:  '1',
  sticky:  '10',
  overlay: '50',
  modal:   '100',
  toast:   '200'
} as const

export type ZKey = keyof typeof z
