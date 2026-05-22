import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, Grid, Col } from '@system/primitives'
import type { TextRole } from '@tokens/semantic/type'

const meta: Meta = { title: 'Foundations/Typography' }
export default meta

type S = StoryObj

const roles: TextRole[] = ['display','hero','h1','h2','h3','lead','body','body-sm','caption','meta','tag','quote','button']
const sampleText: Record<TextRole, string> = {
  display:   'Move to Gothenburg.',
  hero:      'A different kind of move.',
  h1:        'Living by the water.',
  h2:        'Family and partner support.',
  h3:        'Industry & careers.',
  lead:      'A practical guide for international professionals, partners, and families.',
  body:      'West Sweden is a region of purposeful work, livability, and quiet ambition. There is room here to do good work, and room to live alongside it.',
  'body-sm': 'Secondary copy reads at smaller size with the same generous leading.',
  caption:   'Photograph by Sara P. — Hisingen, 2025.',
  meta:      'Posted 3 days ago',
  tag:       'Stories',
  quote:     'I came for the job. I stayed for the rhythm of the place.',
  button:    'Read the story'
}

export const Roles: S = {
  render: () => (
    <Section spacing="lg">
      <Container size="prose">
        <Stack gap="xl">
          <Text role="display" as="h1">Typography</Text>
          {roles.map(role => (
            <Stack key={role} gap="snug">
              <Text role="tag" tone="muted">role="{role}"</Text>
              <Text role={role}>{sampleText[role]}</Text>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Section>
  )
}

export const Composition: S = {
  render: () => (
    <Section spacing="xl">
      <Container>
        <Grid>
          <Col span={{ lg: 2 }}>
            <Text role="tag" tone="muted">Edition 01 · Welcome</Text>
          </Col>
          <Col span={{ lg: 3 }}>
            <Stack gap="loose">
              <Text role="display" as="h1">Move to Gothenburg.</Text>
              <Text role="lead">A different kind of move — practical, warm, and built around the real questions people ask before relocating.</Text>
              <Text role="body">This page demonstrates the discipline rule: maximum three distinct text roles in a single viewport.</Text>
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
