// src/tokens/semantic/motion.ts

import type { DurationKey, EasingKey } from '../primitives/motion'

export type MotionRole =
  | 'hover' | 'press' | 'state-change'
  | 'entrance' | 'reveal' | 'scroll-fade' | 'surface-swap'

export const motionRoles: Record<MotionRole, { duration: DurationKey; easing: EasingKey }> = {
  hover:           { duration: 'fast',    easing: 'standard' },
  press:           { duration: 'fast',    easing: 'standard' },
  'state-change':  { duration: 'fast',    easing: 'standard' },
  entrance:        { duration: 'base',    easing: 'standard' },
  reveal:          { duration: 'slow',    easing: 'standard' },
  'scroll-fade':   { duration: 'slow',    easing: 'standard' },
  'surface-swap':  { duration: 'base',    easing: 'standard' }
}
