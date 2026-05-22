import type { Meta, StoryObj } from '@storybook/react'
import { HeroText } from './HeroText'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'
import { SHORT_HEADLINE, LONG_HEADLINE, SHORT_LEAD, LONG_LEAD } from '../../../stories/_fixtures/copy'

const meta: Meta<typeof HeroText> = {
  title: 'Examples/HeroText',
  component: HeroText,
  parameters: {
    docs: {
      description: { component: 'EXAMPLE — demonstrates foundations only. Not a production component.' }
    }
  }
}
export default meta

type S = StoryObj<typeof HeroText>

export const Default: S = {
  args: { content: { eyebrow: 'Edition 01', headline: SHORT_HEADLINE, lead: SHORT_LEAD, cta: { label: 'Start here', href: '#' } } }
}

export const Short: S = { args: { content: { headline: SHORT_HEADLINE } } }
export const Long:  S = { args: { content: { eyebrow: 'Welcome', headline: LONG_HEADLINE, lead: LONG_LEAD, cta: { label: 'Open the guide', href: '#' } } } }
export const NoCTA: S = { args: { content: { headline: SHORT_HEADLINE, lead: SHORT_LEAD } } }
export const EmptyOptionals: S = { args: { content: { headline: SHORT_HEADLINE } } }

export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map((t: ThemeName) => (
        <HeroText key={t} content={{ eyebrow: t, headline: SHORT_HEADLINE, lead: SHORT_LEAD, theme: t }} />
      ))}
    </Stack>
  )
}
