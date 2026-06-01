import type { Meta, StoryObj } from '@storybook/react'
import { AICompanionTeaser } from './AICompanionTeaser'

const meta: Meta<typeof AICompanionTeaser> = { title: 'Examples/AICompanionTeaser', component: AICompanionTeaser }
export default meta
type S = StoryObj<typeof AICompanionTeaser>

export const Default: S = { args: { content: { eyebrow: 'Guide', headline: 'Ask the guide anything.', body: 'A quiet, AI-assisted companion for the real questions about your move.', prompt: 'How much does childcare cost in Gothenburg for a 3-year-old?', cta: { label: 'Open the guide', href: '#' } } } }
export const Short: S = { args: { content: { headline: 'Ask anything.', prompt: 'Where should I live?', cta: { label: 'Open', href: '#' } } } }
export const Long: S  = { args: { content: { eyebrow: 'AI moving companion', headline: 'A practical, patient guide built for relocation.', body: 'It draws on the rest of this platform — moving guides, stories, job data — so you get answers grounded in what real people have done.', prompt: 'My partner has a Swedish job offer. I work remotely for a UK firm. What does this look like tax-wise in our first year?', cta: { label: 'Open the guide', href: '#' } } } }
export const OnBlue: S = { args: { content: { headline: 'On blue.', prompt: 'Try a different theme.', cta: { label: 'Open', href: '#' }, theme: 'blue' } } }
