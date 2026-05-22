import type { Meta, StoryObj } from '@storybook/react'
import { StoryTeaser } from './StoryTeaser'
import { Stack } from '@system/primitives'
import { themeNames, type ThemeName } from '@tokens/themes'
import { STORY_EXCERPT } from '../../../stories/_fixtures/copy'
import { IMAGES } from '../../../stories/_fixtures/images'

const meta: Meta<typeof StoryTeaser> = { title: 'Examples/StoryTeaser', component: StoryTeaser }
export default meta
type S = StoryObj<typeof StoryTeaser>

const base = { tag: 'Stories', headline: 'Building a life by the archipelago', excerpt: STORY_EXCERPT, image: IMAGES.portrait, byline: { name: 'Sara P.', role: 'Researcher' }, cta: { label: 'Read Sara\'s story', href: '#' } }

export const Default: S = { args: { content: base } }
export const Short:   S = { args: { content: { headline: 'A short story.' } } }
export const Long:    S = { args: { content: { ...base, excerpt: STORY_EXCERPT + ' ' + STORY_EXCERPT } } }
export const NoImage: S = { args: { content: { ...base, image: undefined } } }
export const NoCTA:   S = { args: { content: { ...base, cta: undefined } } }
export const EmptyOptionals: S = { args: { content: { headline: base.headline } } }
export const ThemeVariants: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map((t: ThemeName) => (
        <StoryTeaser key={t} content={{ ...base, theme: t }} />
      ))}
    </Stack>
  )
}
