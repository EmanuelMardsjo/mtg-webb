// src/stories/pages/MovingJourney.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HeroText } from '@system/examples/HeroText'
import { ChecklistTeaser } from '@system/examples/ChecklistTeaser'
import { EditorialText } from '@system/examples/EditorialText'
import { AICompanionTeaser } from '@system/examples/AICompanionTeaser'
import { Signpost } from '@system/examples/Signpost'

const meta: Meta = { title: 'Pages/Moving journey flow' }
export default meta
type S = StoryObj

export const Page: S = {
  render: () => (
    <>
      <HeroText content={{ eyebrow: 'The move', headline: 'What to expect when you move.', lead: 'A practical sequence — pre-arrival, first 30 days, settling in.', theme: 'neutral', cta: { label: 'Open the full guide', href: '#' } }} />
      <ChecklistTeaser content={{ eyebrow: 'Step 1', heading: 'Pre-arrival', intro: 'Start these before you fly.', items: [
        { label: 'Apply for personnummer', description: 'Skatteverket booking, ~6 weeks lead time.' },
        { label: 'Sort temporary housing',  description: 'Short-let or company housing for the first 30 days.' },
        { label: 'Translate key documents', description: 'Birth, marriage, medical records.' }
      ], theme: 'pink' }} />
      <ChecklistTeaser content={{ eyebrow: 'Step 2', heading: 'First 30 days', intro: 'Once you are on the ground.', items: [
        { label: 'Register with the Migration Agency' },
        { label: 'Open a bank account' },
        { label: 'Choose a school or förskola' },
        { label: 'Get a transit card' }
      ], theme: 'yellow' }} />
      <EditorialText content={{ heading: 'Bringing a partner.', paragraphs: [
        'Moving a partner well is its own project. Many international families assume the trailing partner will find work easily. The reality is more textured.',
        'There is help here — at the city level, at the regional level, and in informal communities of people who have done the same thing.'
      ], theme: 'neutral' }} />
      <AICompanionTeaser content={{ eyebrow: 'AI guide', headline: 'Ask anything about your move.', body: 'A patient companion built for relocation questions.', prompt: 'My partner has a Swedish job offer. What does this look like tax-wise in our first year?', cta: { label: 'Open the guide', href: '#' }, theme: 'neutral-dark' }} />
      <Signpost content={{ heading: 'Resources', items: [
        { label: 'Moving guides', href: '#' },
        { label: 'Housing options', href: '#' },
        { label: 'Partner support', href: '#' }
      ], theme: 'neutral' }} />
    </>
  )
}
