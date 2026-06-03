import type { Meta, StoryObj } from '@storybook/react'
import { ResidentStories } from './ResidentStories'
import type { ResidentStoriesContent } from './types'
import { IMAGES } from '../../../stories/_fixtures/images'

// The 3 source residents (04-UI-SPEC Copywriting Contract). No intro
// eyebrow/heading on content by default — the Section aria-label carries the
// title (D-8). The global Storybook reduced-motion toolbar exercises the
// static-stack fallback; no per-story decorator needed.
const content: ResidentStoriesContent = {
  stories: [
    {
      eyebrow: 'Bangalore → Lindholmen',
      headline: 'A forest twelve minutes from work.',
      attribution:
        'Aditi Menon — Staff engineer, Volvo Cars · arrived 2022 with partner & daughter',
      image: IMAGES.portrait
    },
    {
      eyebrow: 'Lisbon → Majorna',
      headline: 'My mornings belong to me again.',
      attribution: 'Tomás Ferreira — Product designer, freelance · arrived 2023, solo',
      image: IMAGES.mtgFeatureSofa
    },
    {
      eyebrow: 'Toronto → Haga',
      headline: 'I finally stopped counting the hours.',
      attribution: 'Maya Okonkwo — Data scientist, SKF · arrived 2021 with partner',
      image: IMAGES.mtgHeroCoat
    }
  ]
}

const meta: Meta<typeof ResidentStories> = {
  title: 'Examples/ResidentStories',
  component: ResidentStories,
  parameters: { layout: 'fullscreen' }
}
export default meta
type S = StoryObj<typeof ResidentStories>

// Default: the 3 source residents, no per-story href (editorial, D-7).
export const Default: S = {
  args: { content }
}

// A different story count proves the progress scale changes (4th resident).
export const FourStories: S = {
  args: {
    content: {
      ...content,
      stories: [
        ...content.stories,
        {
          eyebrow: 'Berlin → Hisingen',
          headline: 'The quiet was the first thing I noticed.',
          attribution: 'Jonas Weber — Sound engineer · arrived 2024 with partner',
          image: IMAGES.mtgHeroDadKid
        }
      ]
    }
  }
}

// One story with an href demonstrates the linked-<a> variant (D-7); the rest
// stay non-interactive articles.
export const WithLinkedStory: S = {
  args: {
    content: {
      ...content,
      stories: content.stories.map((story, i) =>
        i === 0 ? { ...story, href: '#aditi' } : story
      )
    }
  }
}
