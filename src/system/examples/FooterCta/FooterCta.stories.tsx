import type { Meta, StoryObj } from '@storybook/react'
import { FooterCta } from './FooterCta'
import type { FooterCtaContent } from './types'
import { IMAGES } from '../../../stories/_fixtures/images'

const content: FooterCtaContent = {
  runway: {
    eyebrow: '№ 09 — Before you go',
    headline: "You've read the stories.\nThe last step is the easy one.",
    lead: "No forms to wrestle, no account to make. One honest sentence about the life you're after — and we start building the move around it.",
    media: IMAGES.mtgHeroCouch
  },
  cta: {
    eyebrow: "№ 10 — When you're ready",
    title: 'What kind of life\nare you looking for?',
    lead: "Start with one honest sentence. We'll quietly build the rest of your move around it.",
    action: { label: 'Begin with one line', href: '#' }
  },
  footer: {
    columns: [
      {
        tag: 'An initiative of',
        items: [
          { text: 'City of Gothenburg' },
          { text: 'Region Västra Götaland' },
          { text: '+ 142 ecosystem partners' }
        ]
      },
      {
        tag: 'Built openly',
        items: [
          { text: 'Privacy first', href: '#' },
          { text: 'No tracking pixels', href: '#' }
        ]
      },
      {
        tag: 'Read in',
        items: [
          { text: 'EN · SV · DE · FR · ES' },
          { text: 'UK · PL · AR · ZH · HI' }
        ]
      },
      {
        tag: 'Contact',
        items: [
          { text: '+46 31 — reply within 4 h', href: '#' },
          { text: 'Lindholmen 2, Gothenburg' }
        ]
      }
    ],
    legal: '© Move to Gothenburg · 2026 · A non-profit relocation companion',
    coords: '57.7089°N · 11.9746°E'
  }
}

const meta: Meta<typeof FooterCta> = {
  title: 'Examples/FooterCta',
  component: FooterCta,
  parameters: { layout: 'fullscreen' }
}
export default meta
type S = StoryObj<typeof FooterCta>

export const Default: S = {
  args: { content }
}

export const AmberDeep: S = {
  args: { content: { ...content, footerTheme: 'amber-deep' } }
}
