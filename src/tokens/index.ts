// src/tokens/index.ts
// Typed re-export for runtime access. Components rarely import from here —
// most consume CSS vars from tokens.css.

export * from './primitives/color'
export * from './primitives/type'
export * from './primitives/space'
export * from './primitives/size'
export * from './primitives/breakpoint'
export * from './primitives/radius'
export * from './primitives/border'
export * from './primitives/motion'
export * from './primitives/opacity'
export * from './primitives/z'

export { colorRoles, type ColorRoleKey } from './semantic/color'
export { textRoles, type TextRole } from './semantic/type'
export { spaceRoles, type SpaceRoleKey } from './semantic/space'
export { motionRoles, type MotionRole } from './semantic/motion'
export { themes, themeNames, type ThemeName } from './themes'
