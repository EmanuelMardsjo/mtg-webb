// src/tokens/semantic/space.ts
// Components only consume these. Never reach for space[N] directly.

import { space } from '../primitives/space'

export const spaceRoles = {
  // Section vertical rhythm
  'section-y-sm':     space[7],   // 48
  'section-y-md':     space[9],   // 96
  'section-y-lg':     space[10],  // 128
  'section-y-xl':     space[11],  // 192
  // Stack (vertical) gaps
  'stack-tight':      space[2],
  'stack-snug':       space[3],
  'stack-default':    space[4],
  'stack-loose':      space[5],
  'stack-xl':         space[7],
  // Inline (horizontal) gaps
  'inline-tight':     space[1],
  'inline-default':   space[2],
  'inline-loose':     space[4],
  // Grid gutters
  'grid-gutter-sm':   space[4],
  'grid-gutter-md':   space[5],
  'grid-gutter-lg':   space[6],
  // Container horizontal padding
  'container-pad-sm': space[4],
  'container-pad-md': space[6],
  'container-pad-lg': space[8],
  // Content
  'content-gap':      space[6]
} as const

export type SpaceRoleKey = keyof typeof spaceRoles
