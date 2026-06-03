import type { Meta, StoryObj } from '@storybook/react'
import { CrashCourseRail } from './CrashCourseRail'
import type { CrashCourseRailContent } from './types'
import { IMAGES } from '../../../stories/_fixtures/images'

const content: CrashCourseRailContent = {
  eyebrow: '№ — A crash course',
  heading: 'A crash course in Gothenburg life',
  lead: 'Not the tourist version — just the small, everyday things that make a week here feel like yours. Think of it as a local friend pointing at the good stuff.',
  cards: [
    {
      title: 'Fika',
      description: 'Coffee is only half the point. Fika is where work slows down and the cinnamon bun earns its place in the calendar.',
      image: IMAGES.portrait,
      href: '#fika'
    },
    {
      title: 'Archipelago days',
      description: 'A tram, a ferry, and suddenly the city opens into smooth rocks, salt water and quiet islands.',
      image: IMAGES.archipelago,
      href: '#archipelago'
    },
    {
      title: 'Hagabullen',
      description: 'A cinnamon bun the size of your face. Best shared — unless you’re ready to commit.',
      image: IMAGES.industry,
      href: '#hagabullen'
    },
    {
      title: 'Midsummer',
      description: 'Flowers, songs, potatoes, and people dancing like nobody’s filming. Strange at first. Hard not to love.',
      image: IMAGES.mtgHeroDadKid,
      href: '#midsummer'
    },
    {
      title: 'First outdoor coffee of spring',
      description: 'After a long winter the chairs come out, faces turn to the sun, and the whole city seems to exhale.',
      image: IMAGES.mtgHeroCoat,
      href: '#spring-coffee'
    },
    {
      title: 'Rain with character',
      description: 'Gothenburg weather has opinions. Bring a jacket, keep your plans, and you’ll see why people celebrate the sun properly here.',
      image: IMAGES.mtgHeroCouch,
      href: '#rain'
    },
    {
      title: 'Långgatorna',
      description: 'Bars, food, music, tattoos, friends on the pavement — and the feeling the city has a little edge.',
      image: IMAGES.city,
      href: '#langgatorna'
    },
    {
      title: 'Cold swims',
      description: 'Some call it wellness. Some call it madness. In Gothenburg, both are true.',
      image: IMAGES.water,
      href: '#cold-swims'
    }
  ]
}

const meta: Meta<typeof CrashCourseRail> = {
  title: 'Examples/CrashCourseRail',
  component: CrashCourseRail,
  parameters: { layout: 'fullscreen' }
}
export default meta
type S = StoryObj<typeof CrashCourseRail>

export const Default: S = {
  args: { content }
}

export const FewCards: S = {
  args: { content: { ...content, cards: content.cards.slice(0, 3) } }
}
