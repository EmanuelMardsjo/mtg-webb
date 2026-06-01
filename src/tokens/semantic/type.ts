// src/tokens/semantic/type.ts
// Thirteen semantic text roles. <Text role="..."> consumes these.

import type { FontSizeKey, FontFamilyKey } from '../primitives/type'

export type TextRole =
  | 'display' | 'hero' | 'h1' | 'h2' | 'h3'
  | 'lead' | 'body' | 'body-sm'
  | 'caption' | 'meta' | 'tag' | 'quote' | 'button'

type RoleDef = {
  family:    FontFamilyKey
  size:      FontSizeKey
  leading:   string
  tracking:  string
  weight:    number
  transform?: 'uppercase'
  style?:     'italic'
}

export const textRoles: Record<TextRole, RoleDef> = {
  display:   { family: 'display', size: '5xl', leading: '0.95',  tracking: '-0.02em',  weight: 800 },
  hero:      { family: 'display', size: '4xl', leading: '1.0',   tracking: '-0.015em', weight: 800 },
  h1:        { family: 'display', size: '3xl', leading: '1.05',  tracking: '-0.01em',  weight: 800 },
  h2:        { family: 'display', size: '2xl', leading: '1.1',   tracking: '-0.005em', weight: 800 },
  h3:        { family: 'body',    size: 'xl',  leading: '1.15',  tracking: '0',        weight: 400 },
  lead:      { family: 'body',    size: 'lg',  leading: '1.45',  tracking: '0',        weight: 400 },
  body:      { family: 'body',    size: 'md',  leading: '1.55',  tracking: '0',        weight: 400 },
  'body-sm': { family: 'body',    size: 'sm',  leading: '1.55',  tracking: '0',        weight: 400 },
  caption:   { family: 'body',    size: 'xs',  leading: '1.4',   tracking: '0.01em',   weight: 400 },
  meta:      { family: 'body',    size: 'xs',  leading: '1.4',   tracking: '0',        weight: 400 },
  tag:       { family: 'body',    size: '2xs', leading: '1.2',   tracking: '0.08em',   weight: 400, transform: 'uppercase' },
  quote:     { family: 'body',    size: 'xl',  leading: '1.3',   tracking: '-0.005em', weight: 400 },
  button:    { family: 'display', size: 'md',  leading: '1.0',   tracking: '0',        weight: 800 }
}
