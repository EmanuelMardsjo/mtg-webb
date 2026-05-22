// src/stories/pages/EditorialHomepage.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HeroText } from '@system/examples/HeroText'
import { ImageText } from '@system/examples/ImageText'
import { Signpost } from '@system/examples/Signpost'
import { EditorialText } from '@system/examples/EditorialText'
import { StoryTeaser } from '@system/examples/StoryTeaser'
import { AICompanionTeaser } from '@system/examples/AICompanionTeaser'
import { IMAGES } from '../_fixtures/images'

const meta: Meta = {
  title: 'Pages/Editorial homepage flow',
  parameters: {
    docs: { description: { component: 'EXAMPLE — assembled from foundation blocks. Theme rhythm: bone → ink → clay → bone → sage → bone → ink.' } }
  }
}
export default meta

type S = StoryObj

export const Page: S = {
  render: () => (
    <>
      <HeroText content={{ eyebrow: 'Edition 01', headline: 'Move to Gothenburg. A different kind of move.', lead: 'A practical, warm guide for international professionals, partners and families.', cta: { label: 'Start where you are', href: '#' }, theme: 'bone' }} />
      <ImageText content={{ headline: 'Water shapes the week.', body: 'The archipelago is not a weekend trip. It is part of the rhythm of the city.', image: IMAGES.water, theme: 'ink', bleed: true }} />
      <Signpost content={{ eyebrow: 'Pick a path', heading: 'Start where you are.', items: [
        { label: 'Career', href: '#', description: 'Find your role.' },
        { label: 'Family', href: '#', description: 'Childcare, schools, partner support.' },
        { label: 'Community', href: '#', description: 'Where to land softly.' },
        { label: 'Housing', href: '#', description: 'Renting, buying, moving in.' }
      ], theme: 'clay' }} />
      <EditorialText content={{ heading: 'A region of purposeful work.', paragraphs: [
        'West Sweden has a quiet ambition. It is shaped by water, granite, and a kind of seriousness that never tips into self-importance.',
        'There is room here to do good work — at companies that take craft seriously — and room to live alongside it.'
      ], pullQuote: 'I came for the job. I stayed for the rhythm of the place.', theme: 'bone' }} />
      <StoryTeaser content={{ tag: 'Stories', headline: 'Building a life by the archipelago.', excerpt: 'Sara moved from Madrid in 2024 with her partner and two children.', image: IMAGES.portrait, byline: { name: 'Sara P.', role: 'Researcher' }, cta: { label: 'Read Sara\'s story', href: '#' }, theme: 'sage' }} />
      <AICompanionTeaser content={{ eyebrow: 'AI moving companion', headline: 'A patient guide for the real questions.', body: 'Ask anything — and get answers grounded in what real people have done.', prompt: 'How much does childcare cost in Gothenburg for a 3-year-old?', cta: { label: 'Open the guide', href: '#' }, theme: 'ink' }} />
      <ImageText content={{ headline: 'Stay close to the water.', image: IMAGES.archipelago, theme: 'bone', bleed: true }} />
    </>
  )
}
