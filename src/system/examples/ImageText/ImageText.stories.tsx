// src/system/examples/ImageText/ImageText.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ImageText } from './ImageText'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'
import { SHORT_HEADLINE, SHORT_BODY, LONG_HEADLINE, LONG_BODY } from '../../../stories/_fixtures/copy'
import { IMAGES } from '../../../stories/_fixtures/images'

const meta: Meta<typeof ImageText> = { title: 'Examples/ImageText', component: ImageText }
export default meta
type S = StoryObj<typeof ImageText>

const base = { headline: SHORT_HEADLINE, body: SHORT_BODY, image: IMAGES.water, cta: { label: 'Continue', href: '#' } }

export const Default: S       = { args: { content: { ...base } } }
export const Short: S         = { args: { content: { headline: SHORT_HEADLINE, image: IMAGES.water } } }
export const Long: S          = { args: { content: { eyebrow: 'Region', headline: LONG_HEADLINE, body: LONG_BODY, image: IMAGES.archipelago } } }
export const Reversed: S      = { args: { content: { ...base, reversed: true } } }
export const Bleed: S         = { args: { content: { ...base, bleed: true, image: IMAGES.water } } }
export const NoCTA: S         = { args: { content: { headline: SHORT_HEADLINE, body: SHORT_BODY, image: IMAGES.water } } }
export const EmptyOptionals: S = { args: { content: { headline: SHORT_HEADLINE, image: IMAGES.water } } }
export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map((t: ThemeName) => (
        <ImageText key={t} content={{ ...base, theme: t, image: IMAGES.water }} />
      ))}
    </Stack>
  )
}
