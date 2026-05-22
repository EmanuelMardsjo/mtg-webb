// src/tokens/semantic/motion.ts

import type { DurationKey, EasingKey } from '../primitives/motion'

export type MotionRole =
  | 'hover' | 'press' | 'state-change'
  | 'entrance' | 'reveal' | 'scroll-fade' | 'surface-swap'

export const motionRoles: Record<MotionRole, { duration: DurationKey; easing: EasingKey }> = {
  hover:           { duration: 'micro',   easing: 'standard' },
  press:           { duration: 'instant', easing: 'standard' },
  'state-change':  { duration: 'fast',    easing: 'standard' },
  entrance:        { duration: 'base',    easing: 'enter' },
  reveal:          { duration: 'slow',    easing: 'emphasis' },
  'scroll-fade':   { duration: 'slow',    easing: 'enter' },
  'surface-swap':  { duration: 'base',    easing: 'standard' }
}
