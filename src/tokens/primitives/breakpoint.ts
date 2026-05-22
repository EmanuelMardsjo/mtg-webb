// src/tokens/primitives/breakpoint.ts
export const breakpoint = {
  sm: '0px',
  md: '768px',
  lg: '1200px'
} as const

export type BreakpointKey = keyof typeof breakpoint
