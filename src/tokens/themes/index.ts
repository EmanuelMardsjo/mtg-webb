// src/tokens/themes/index.ts
// Each theme is a complete remap of semantic color roles.
// Themes are peers — there is no separate light/dark axis.

import { palette } from '../primitives/color'

export type ThemeName =
  | 'bone' | 'bone-raised'
  | 'sky' | 'clay' | 'sage'
  | 'ink'
  | 'campaign'

type ThemeColors = {
  'surface-page':   string
  'surface-raised': string
  'text-strong':    string
  'text-default':   string
  'text-muted':     string
  'border-subtle':  string
  'border-strong':  string
  'focus-ring':     string
  'accent-line':    string
}

export const themes: Record<ThemeName, ThemeColors> = {
  bone: {
    'surface-page':   palette.bone[50],
    'surface-raised': palette.bone[100],
    'text-strong':    palette.navy[900],
    'text-default':   palette.navy[800],
    'text-muted':     palette.navy[700],
    'border-subtle':  'color-mix(in oklch, currentColor 10%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 20%, transparent)',
    'focus-ring':     palette.sky[400],
    'accent-line':    palette.sky[400]
  },
  'bone-raised': {
    'surface-page':   palette.bone[100],
    'surface-raised': palette.bone[200],
    'text-strong':    palette.navy[900],
    'text-default':   palette.navy[800],
    'text-muted':     palette.navy[700],
    'border-subtle':  'color-mix(in oklch, currentColor 10%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 20%, transparent)',
    'focus-ring':     palette.sky[400],
    'accent-line':    palette.sky[400]
  },
  sky: {
    'surface-page':   palette.sky[100],
    'surface-raised': palette.sky[200],
    'text-strong':    palette.navy[900],
    'text-default':   palette.navy[900],
    'text-muted':     palette.navy[800],
    'border-subtle':  'color-mix(in oklch, currentColor 14%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 22%, transparent)',
    'focus-ring':     palette.navy[900],
    'accent-line':    palette.navy[900]
  },
  clay: {
    'surface-page':   palette.clay[100],
    'surface-raised': palette.clay[200],
    'text-strong':    palette.navy[900],
    'text-default':   palette.navy[900],
    'text-muted':     palette.navy[800],
    'border-subtle':  'color-mix(in oklch, currentColor 14%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 22%, transparent)',
    'focus-ring':     palette.navy[900],
    'accent-line':    palette.navy[900]
  },
  sage: {
    'surface-page':   palette.sage[100],
    'surface-raised': palette.sage[200],
    'text-strong':    palette.navy[900],
    'text-default':   palette.navy[900],
    'text-muted':     palette.navy[800],
    'border-subtle':  'color-mix(in oklch, currentColor 14%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 22%, transparent)',
    'focus-ring':     palette.navy[900],
    'accent-line':    palette.navy[900]
  },
  ink: {
    'surface-page':   palette.navy[900],
    'surface-raised': palette.navy[800],
    'text-strong':    palette.bone[50],
    'text-default':   palette.bone[50],
    'text-muted':     'color-mix(in oklch, ' + palette.bone[50] + ' 75%, transparent)',
    'border-subtle':  'color-mix(in oklch, currentColor 12%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 24%, transparent)',
    'focus-ring':     palette.sky[400],
    'accent-line':    palette.sky[400]
  },
  // Runtime-variable theme. Falls back to bone if --campaign-* vars are unset.
  campaign: {
    'surface-page':   'var(--campaign-surface, ' + palette.bone[50] + ')',
    'surface-raised': 'var(--campaign-surface-raised, ' + palette.bone[100] + ')',
    'text-strong':    'var(--campaign-text-strong, ' + palette.navy[900] + ')',
    'text-default':   'var(--campaign-text, ' + palette.navy[800] + ')',
    'text-muted':     'var(--campaign-text-muted, ' + palette.navy[700] + ')',
    'border-subtle':  'color-mix(in oklch, currentColor 10%, transparent)',
    'border-strong':  'color-mix(in oklch, currentColor 20%, transparent)',
    'focus-ring':     'var(--campaign-focus-ring, ' + palette.sky[400] + ')',
    'accent-line':    'var(--campaign-accent, ' + palette.sky[400] + ')'
  }
}

export const themeNames: ThemeName[] = ['bone', 'bone-raised', 'sky', 'clay', 'sage', 'ink', 'campaign']
