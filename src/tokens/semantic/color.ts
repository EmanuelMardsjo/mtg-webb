// src/tokens/semantic/color.ts
// Default theme = bone. Each semantic role references a primitive.
// Other themes (Phase 4) override these mappings.

import { palette, status, overlay } from '../primitives/color'

export const colorRoles = {
  // Surfaces
  'surface-page':    palette.bone[50],
  'surface-raised':  palette.bone[100],
  // Text
  'text-strong':     palette.navy[900],
  'text-default':    palette.navy[800],
  'text-muted':      palette.navy[700],
  'text-on-ink':     palette.bone[50],
  // Borders (currentColor-mixed for theme adaptability)
  'border-subtle':   'color-mix(in oklch, currentColor 10%, transparent)',
  'border-strong':   'color-mix(in oklch, currentColor 20%, transparent)',
  // Accent / focus
  'focus-ring':      palette.sky[400],
  'accent-line':     palette.sky[400],
  // Status (utility)
  'status-success':  status.success,
  'status-warning':  status.warning,
  'status-danger':   status.danger,
  'status-info':     status.info,
  // Overlays
  'overlay-ink':     overlay.ink,
  'overlay-scrim':   overlay.scrim,
  'overlay-bone':    overlay.bone
} as const

export type ColorRoleKey = keyof typeof colorRoles
