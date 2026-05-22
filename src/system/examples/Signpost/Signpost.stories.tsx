// src/system/examples/Signpost/Signpost.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Signpost } from './Signpost'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'

const meta: Meta<typeof Signpost> = { title: 'Examples/Signpost', component: Signpost }
export default meta
type S = StoryObj<typeof Signpost>

const items = [
  { label: 'Career', href: '/career', description: 'Find your role and your team.' },
  { label: 'Family', href: '/family', description: 'School, childcare, partner support.' },
  { label: 'Community', href: '/community', description: 'Where to land softly.' },
  { label: 'Housing', href: '/housing', description: 'Renting, buying, moving in.' }
]

export const Default: S = { args: { content: { heading: 'Start where you are', items } } }
export const Short: S   = { args: { content: { heading: 'Pick a path', items: items.slice(0, 2) } } }
export const Long: S    = { args: { content: { eyebrow: 'For your move', heading: 'Start where you are', items } } }
export const NoDescriptions: S = { args: { content: { heading: 'Pick a path', items: items.map(i => ({ label: i.label, href: i.href })) } } }
export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map((t: ThemeName) => (
        <Signpost key={t} content={{ heading: `Theme: ${t}`, items: items.slice(0,3), theme: t }} />
      ))}
    </Stack>
  )
}
