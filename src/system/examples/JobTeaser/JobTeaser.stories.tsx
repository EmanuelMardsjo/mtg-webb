import type { Meta, StoryObj } from '@storybook/react'
import { JobTeaser } from './JobTeaser'
import { Section, Container, Grid, Col } from '@system/primitives'

const meta: Meta<typeof JobTeaser> = { title: 'Examples/JobTeaser', component: JobTeaser }
export default meta
type S = StoryObj<typeof JobTeaser>

const sample = { tag: 'Engineering', role: 'Senior Software Engineer', location: 'Gothenburg · Hybrid', summary: 'Help build the future of automotive software at a company that takes craft seriously.', meta: { company: 'Volvo Cars', posted: 'Posted 3 days ago' }, cta: { label: 'See role', href: '#' } }

export const Default: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Grid>
          <Col span={{ lg: 2 }}><JobTeaser content={sample} /></Col>
        </Grid>
      </Container>
    </Section>
  )
}

export const Short: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Grid>
          <Col span={{ lg: 2 }}><JobTeaser content={{ role: 'Senior Engineer', location: 'Gothenburg' }} /></Col>
        </Grid>
      </Container>
    </Section>
  )
}

export const ThreeUp: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Grid>
          <Col span={{ lg: 1 }}>{null}</Col>
          <Col span={{ lg: 1 }}><JobTeaser content={sample} /></Col>
          <Col span={{ lg: 1 }}><JobTeaser content={{ ...sample, role: 'UX Researcher', tag: 'Research' }} /></Col>
          <Col span={{ lg: 1 }}><JobTeaser content={{ ...sample, role: 'Battery Engineer', tag: 'Hardware' }} /></Col>
        </Grid>
      </Container>
    </Section>
  )
}
