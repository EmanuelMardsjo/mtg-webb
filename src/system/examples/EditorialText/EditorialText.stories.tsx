// src/system/examples/EditorialText/EditorialText.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { EditorialText } from './EditorialText'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'
import { SHORT_BODY, LONG_BODY } from '../../../stories/_fixtures/copy'

const meta: Meta<typeof EditorialText> = { title: 'Examples/EditorialText', component: EditorialText }
export default meta
type S = StoryObj<typeof EditorialText>

export const Default: S = { args: { content: { heading: 'A region of purposeful work.', paragraphs: [LONG_BODY], pullQuote: 'I came for the job. I stayed for the rhythm of the place.' } } }
export const Short:   S = { args: { content: { paragraphs: [SHORT_BODY] } } }
export const Long:    S = { args: { content: { heading: 'The shape of a Gothenburg week.', paragraphs: [LONG_BODY, LONG_BODY, LONG_BODY] } } }
export const NoHeading: S = { args: { content: { paragraphs: [LONG_BODY] } } }
export const NoPullQuote: S = { args: { content: { heading: 'Why we wrote this.', paragraphs: [SHORT_BODY] } } }
export const EmptyOptionals: S = { args: { content: { paragraphs: [SHORT_BODY] } } }
export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map((t: ThemeName) => (
        <EditorialText key={t} content={{ heading: `Theme: ${t}`, paragraphs: [SHORT_BODY], theme: t }} />
      ))}
    </Stack>
  )
}
