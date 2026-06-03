import type { Meta, StoryObj } from '@storybook/react'
import { FeatureSpotlight } from './FeatureSpotlight'
import type { FeatureSpotlightContent } from './types'
import { IMAGES } from '../../../stories/_fixtures/images'

const content: FeatureSpotlightContent = {
  eyebrow: '№ 01 — A life, not just a job',
  headline: "Live the life you've been saving for later.",
  lead: "The slower evenings, the time with the people you love, the work that doesn't swallow the rest — most of us keep meaning to get to all that. Here, it isn't a someday. It's a Tuesday.",
  cta: { label: 'Explore the life', href: '#' },
  image: IMAGES.portrait
}

const meta: Meta<typeof FeatureSpotlight> = {
  title: 'Examples/FeatureSpotlight',
  component: FeatureSpotlight,
  parameters: { layout: 'fullscreen' }
}
export default meta
type S = StoryObj<typeof FeatureSpotlight>

export const Default: S = {
  args: { content }
}

export const BlueSoftTheme: S = {
  args: { content: { ...content, theme: 'blue-soft' } }
}
