// src/stories/pages/IndustryCareers.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { HeroText } from '@system/examples/HeroText'
import { ImageText } from '@system/examples/ImageText'
import { JobTeaser } from '@system/examples/JobTeaser'
import { StoryTeaser } from '@system/examples/StoryTeaser'
import { Signpost } from '@system/examples/Signpost'
import { Section, Container, Grid, Col, Stack, Text } from '@system/primitives'
import { IMAGES } from '../_fixtures/images'

const meta: Meta = { title: 'Pages/Industry & careers flow' }
export default meta
type S = StoryObj

const jobs = [
  { tag: 'Engineering', role: 'Senior Software Engineer', location: 'Gothenburg · Hybrid', summary: 'Help build the future of automotive software.', meta: { company: 'Volvo Cars', posted: 'Posted 3 days ago' }, cta: { label: 'See role', href: '#' } },
  { tag: 'Research',    role: 'Clinical Data Scientist', location: 'Mölndal · On-site',     summary: 'Translational research at scale.',                  meta: { company: 'AstraZeneca', posted: 'Posted 1 week ago' }, cta: { label: 'See role', href: '#' } },
  { tag: 'Hardware',    role: 'Battery Engineer',         location: 'Lindholmen',            summary: 'Battery pack development for next-gen platforms.',  meta: { company: 'Polestar',    posted: 'Posted today' },     cta: { label: 'See role', href: '#' } }
]

export const Page: S = {
  render: () => (
    <>
      <HeroText content={{ eyebrow: 'Industry & careers', headline: 'Purposeful work in a small, ambitious region.', lead: 'West Sweden punches above its weight in automotive, life sciences, energy, and digital.', cta: { label: 'See open roles', href: '#' }, theme: 'neutral' }} />
      <ImageText content={{ headline: 'Companies that take craft seriously.', body: 'From Volvo to AstraZeneca, from SKF to small studios — the work here matters.', image: IMAGES.industry, theme: 'neutral-dark', bleed: true }} />
      <Section spacing="lg" theme="neutral">
        <Container>
          <Grid>
            <Col span={{ lg: 1 }}>
              <Stack gap="snug">
                <Text role="tag" tone="muted">Sample roles</Text>
                <Text role="h2" as="h2">Open now.</Text>
              </Stack>
            </Col>
            {jobs.map((j, i) => (
              <Col key={i} span={{ lg: 1, md: 1, sm: 1 }} start={i === 0 ? { lg: 2 } : undefined}>
                <JobTeaser content={j} />
              </Col>
            ))}
          </Grid>
        </Container>
      </Section>
      <StoryTeaser content={{ tag: 'Stories', headline: 'A senior engineer\'s first year.', excerpt: 'Marek moved from Warsaw in 2023. He reflects on what he wishes he had known before his first standup.', image: IMAGES.portrait, byline: { name: 'Marek J.', role: 'Senior Engineer' }, cta: { label: 'Read', href: '#' }, theme: 'blue' }} />
      <Signpost content={{ heading: 'Industry hubs', items: [
        { label: 'Automotive', href: '#' },
        { label: 'Life sciences', href: '#' },
        { label: 'Digital & game dev', href: '#' },
        { label: 'Energy & cleantech', href: '#' }
      ], theme: 'neutral' }} />
    </>
  )
}
