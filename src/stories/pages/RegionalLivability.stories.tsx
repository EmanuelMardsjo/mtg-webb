// src/stories/pages/RegionalLivability.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HeroText } from '@system/examples/HeroText'
import { ImageText } from '@system/examples/ImageText'
import { EditorialText } from '@system/examples/EditorialText'
import { Signpost } from '@system/examples/Signpost'
import { StoryTeaser } from '@system/examples/StoryTeaser'
import { IMAGES } from '../_fixtures/images'

const meta: Meta = { title: 'Pages/Regional & livability flow' }
export default meta
type S = StoryObj

export const Page: S = {
  render: () => (
    <>
      <HeroText content={{ eyebrow: 'Region', headline: 'West Sweden, beyond the city.', lead: 'Coastline, forest, and small towns within an hour of the tram.', theme: 'neutral', cta: { label: 'Open the regional guide', href: '#' } }} />
      <ImageText content={{ headline: 'Coast, archipelago, forest.', body: 'There are 8,000 islands. Most of the year you have them to yourself.', image: IMAGES.archipelago, theme: 'yellow', bleed: true }} />
      <EditorialText content={{ heading: 'Livability is not lifestyle.', paragraphs: [
        'Livability here means the practical things working. Childcare. Healthcare. Transit. Water that is safe and beautiful.',
        'It also means a culture that lets you go home at five and call it a day. The country is not in a hurry. The work still gets done.'
      ], theme: 'neutral' }} />
      <Signpost content={{ eyebrow: 'Explore', heading: 'Sub-regions', items: [
        { label: 'Gothenburg', href: '#', description: 'Centre, Hisingen, Majorna, Linné.' },
        { label: 'Bohuslän coast', href: '#', description: 'Marstrand, Smögen, Fjällbacka.' },
        { label: 'Inland forest', href: '#', description: 'Borås, Dalsland, the lakes.' }
      ], theme: 'pink' }} />
      <StoryTeaser content={{ tag: 'Stories', headline: 'A family who moved to a smaller town.', excerpt: 'Anna and Tom moved from London to Marstrand. A year in, they reflect on commute, schools, and the practical realities.', image: IMAGES.city, byline: { name: 'Anna & Tom', role: 'Design + Engineering' }, cta: { label: 'Read', href: '#' }, theme: 'yellow' }} />
    </>
  )
}
