import type { Meta, StoryObj } from '@storybook/react'
import { ChecklistTeaser } from './ChecklistTeaser'
import { Stack } from '@system/primitives'
import type { ThemeName } from '@tokens/themes'

const meta: Meta<typeof ChecklistTeaser> = { title: 'Examples/ChecklistTeaser', component: ChecklistTeaser }
export default meta
type S = StoryObj<typeof ChecklistTeaser>

const items = [
  { label: 'Apply for personnummer', description: 'Skatteverket appointment, ~6 weeks lead time.' },
  { label: 'Sort temporary housing',  description: 'Short-let or company housing for the first 30 days.' },
  { label: 'Translate key documents', description: 'Birth certificates, marriage certificates, medical records.' },
  { label: 'Open a bank account',     description: 'Requires personnummer.' }
]

export const Default: S = { args: { content: { heading: 'Pre-arrival', items, intro: 'A few things to start on before you fly.' } } }
export const Short:   S = { args: { content: { heading: 'Pre-arrival', items: items.slice(0,2) } } }
export const Long:    S = { args: { content: { eyebrow: 'Step 1 of 3', heading: 'Pre-arrival', items, intro: 'A few things to start on before you fly.' } } }
export const EmptyOptionals: S = { args: { content: { heading: 'Pre-arrival', items: items.slice(0,2) } } }
export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {(['neutral','pink','yellow'] as ThemeName[]).map(t => (
        <ChecklistTeaser key={t} content={{ heading: `Theme: ${t}`, items: items.slice(0,3), theme: t }} />
      ))}
    </Stack>
  )
}
