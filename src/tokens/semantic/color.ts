// src/tokens/semantic/color.ts
// Default theme = neutral. Each semantic role references a primitive.
// Other themes (Phase 4) override these mappings.

import { palette, status, overlay } from '../primitives/color'

export const colorRoles = {
  // Surfaces
  'surface-page':    palette.neutral[50],
  'surface-raised':  palette.neutral[100],
  // Text
  'text-default':    palette.neutral[800],
  'text-muted':      palette.neutral[700],
  'text-on-dark':    palette.neutral[50],
  // Borders (currentColor-mixed for theme adaptability)
  'border-subtle':   'color-mix(in oklch, currentColor 10%, transparent)',
  'border-strong':   'color-mix(in oklch, currentColor 20%, transparent)',
  // Accent / focus
  'focus-ring':      palette.blue[700],
  'accent-line':     palette.blue[700],
  // Status (utility)
  'status-success':  status.success,
  'status-warning':  status.warning,
  'status-danger':   status.danger,
  'status-info':     status.info,
  // Overlays
  'overlay-neutral-dark': overlay['neutral-dark'],
  'overlay-scrim':   overlay.scrim,
  'overlay-neutral': overlay.neutral
} as const

export type ColorRoleKey = keyof typeof colorRoles
