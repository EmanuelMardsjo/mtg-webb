// src/tokens/themes/index.ts
// Each theme is a complete remap of semantic color roles.
// Themes are peers — there is no separate light/dark axis.

import { palette, status, overlay } from '../primitives/color'
import type { ColorRoleKey } from '../semantic/color'

export type ThemeName =
  | 'neutral' | 'neutral-raised' | 'neutral-dark'
  | 'blue-soft' | 'blue' | 'blue-deep'
  | 'yellow-soft' | 'yellow'
  | 'amber' | 'amber-deep'
  | 'pink-soft' | 'pink'
  | 'campaign'

type ThemeColors = Record<ColorRoleKey, string>

const STATUS_COLORS = {
  'status-success': status.success,
  'status-warning': status.warning,
  'status-danger':  status.danger,
  'status-info':    status.info
} as const

const OVERLAY_COLORS = {
  'overlay-neutral-dark': overlay['neutral-dark'],
  'overlay-scrim':        overlay.scrim,
  'overlay-neutral':      overlay.neutral
} as const

const LIGHT_BORDER = {
  'border-subtle': 'color-mix(in oklch, currentColor 10%, transparent)',
  'border-strong': 'color-mix(in oklch, currentColor 20%, transparent)'
} as const

const STRONG_BORDER = {
  'border-subtle': 'color-mix(in oklch, currentColor 16%, transparent)',
  'border-strong': 'color-mix(in oklch, currentColor 28%, transparent)'
} as const

function mutedOn(color: string): string {
  return 'color-mix(in oklch, ' + color + ' 72%, transparent)'
}

export const themes: Record<ThemeName, ThemeColors> = {
  neutral: {
    'surface-page':   palette.neutral[50],
    'surface-raised': palette.neutral[100],
    'text-default':   palette.neutral[800],
    'text-muted':     palette.neutral[700],
    'text-on-dark':   palette.neutral[50],
    ...LIGHT_BORDER,
    'focus-ring':     palette.blue[700],
    'accent-line':    palette.blue[700],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  'neutral-raised': {
    'surface-page':   palette.neutral[100],
    'surface-raised': palette.neutral[200],
    'text-default':   palette.neutral[800],
    'text-muted':     palette.neutral[700],
    'text-on-dark':   palette.neutral[50],
    ...LIGHT_BORDER,
    'focus-ring':     palette.blue[700],
    'accent-line':    palette.blue[700],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  'neutral-dark': {
    'surface-page':   palette.neutral[950],
    'surface-raised': palette.neutral[900],
    'text-default':   palette.neutral[50],
    'text-muted':     mutedOn(palette.neutral[50]),
    'text-on-dark':   palette.neutral[50],
    ...STRONG_BORDER,
    'focus-ring':     palette.yellow[200],
    'accent-line':    palette.yellow[200],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  'blue-soft': {
    'surface-page':   palette.blue[200],
    'surface-raised': palette.blue[300],
    'text-default':   palette.neutral[800],
    'text-muted':     palette.neutral[700],
    'text-on-dark':   palette.neutral[50],
    ...LIGHT_BORDER,
    'focus-ring':     palette.blue[700],
    'accent-line':    palette.blue[700],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  blue: {
    'surface-page':   palette.blue[700],
    'surface-raised': palette.blue[800],
    'text-default':   palette.blue[200],
    'text-muted':     mutedOn(palette.blue[200]),
    'text-on-dark':   palette.blue[200],
    ...STRONG_BORDER,
    'focus-ring':     palette.yellow[200],
    'accent-line':    palette.yellow[200],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  'blue-deep': {
    'surface-page':   palette.blue[900],
    'surface-raised': palette.blue[950],
    'text-default':   palette.blue[100],
    'text-muted':     mutedOn(palette.blue[100]),
    'text-on-dark':   palette.blue[100],
    ...STRONG_BORDER,
    'focus-ring':     palette.yellow[200],
    'accent-line':    palette.yellow[200],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  'yellow-soft': {
    'surface-page':   palette.yellow[100],
    'surface-raised': palette.yellow[200],
    'text-default':   palette.neutral[800],
    'text-muted':     palette.neutral[700],
    'text-on-dark':   palette.neutral[50],
    ...LIGHT_BORDER,
    'focus-ring':     palette.amber[700],
    'accent-line':    palette.amber[700],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  yellow: {
    'surface-page':   palette.yellow[200],
    'surface-raised': palette.yellow[300],
    'text-default':   palette.neutral[800],
    'text-muted':     palette.neutral[700],
    'text-on-dark':   palette.neutral[50],
    ...LIGHT_BORDER,
    'focus-ring':     palette.neutral[800],
    'accent-line':    palette.neutral[800],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  amber: {
    'surface-page':   palette.amber[700],
    'surface-raised': palette.amber[800],
    'text-default':   palette.yellow[200],
    'text-muted':     mutedOn(palette.yellow[200]),
    'text-on-dark':   palette.yellow[200],
    ...STRONG_BORDER,
    'focus-ring':     palette.yellow[100],
    'accent-line':    palette.yellow[100],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  'amber-deep': {
    'surface-page':   palette.amber[900],
    'surface-raised': palette.amber[800],
    'text-default':   palette.yellow[200],
    'text-muted':     mutedOn(palette.yellow[200]),
    'text-on-dark':   palette.yellow[200],
    ...STRONG_BORDER,
    'focus-ring':     palette.yellow[100],
    'accent-line':    palette.yellow[100],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  'pink-soft': {
    'surface-page':   palette.pink[200],
    'surface-raised': palette.pink[300],
    'text-default':   palette.neutral[800],
    'text-muted':     palette.neutral[700],
    'text-on-dark':   palette.neutral[50],
    ...LIGHT_BORDER,
    'focus-ring':     palette.pink[700],
    'accent-line':    palette.pink[700],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  pink: {
    'surface-page':   palette.pink[700],
    'surface-raised': palette.pink[800],
    'text-default':   palette.pink[100],
    'text-muted':     mutedOn(palette.pink[100]),
    'text-on-dark':   palette.pink[100],
    ...STRONG_BORDER,
    'focus-ring':     palette.pink[200],
    'accent-line':    palette.pink[200],
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  },
  // Runtime-variable theme. Falls back to neutral if --campaign-* vars are unset.
  campaign: {
    'surface-page':   'var(--campaign-surface, ' + palette.neutral[50] + ')',
    'surface-raised': 'var(--campaign-surface-raised, ' + palette.neutral[100] + ')',
    'text-default':   'var(--campaign-text, ' + palette.neutral[800] + ')',
    'text-muted':     'var(--campaign-text-muted, ' + palette.neutral[700] + ')',
    'text-on-dark':   palette.neutral[50],
    ...LIGHT_BORDER,
    'focus-ring':     'var(--campaign-focus-ring, ' + palette.blue[700] + ')',
    'accent-line':    'var(--campaign-accent, ' + palette.blue[700] + ')',
    ...STATUS_COLORS,
    ...OVERLAY_COLORS
  }
}

export const themeNames: ThemeName[] = [
  'neutral',
  'neutral-raised',
  'neutral-dark',
  'blue-soft',
  'blue',
  'blue-deep',
  'yellow-soft',
  'yellow',
  'amber',
  'amber-deep',
  'pink-soft',
  'pink',
  'campaign'
]
