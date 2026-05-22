import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, Grid, Col } from '@system/primitives'
import { space } from '@tokens/primitives/space'

const meta: Meta = { title: 'Foundations/Spacing & Sizing' }
export default meta

type S = StoryObj

export const Scale: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Text role="display" as="h1">Spacing scale</Text>
          <Text role="lead">Twelve steps from 0 to 256. Consumed only via semantic roles in components.</Text>
          <Stack gap="default">
            {Object.entries(space).map(([k, v]) => (
              <Grid key={k}>
                <Col span={{ lg: 1 }}><Text role="meta">space[{k}]</Text></Col>
                <Col span={{ lg: 1 }}><Text role="meta" tone="muted">{v as string}</Text></Col>
                <Col span={{ lg: 3 }}>
                  <div style={{ height: '16px', width: v as string, background: 'var(--color-accent-line)' }} />
                </Col>
              </Grid>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Section>
  )
}

export const SectionRhythm: S = {
  render: () => (
    <>
      {(['sm','md','lg','xl'] as const).map(s => (
        <Section key={s} spacing={s}>
          <Container>
            <Stack gap="snug">
              <Text role="tag" tone="muted">spacing="{s}"</Text>
              <Text role="h2">A section with {s} vertical rhythm.</Text>
            </Stack>
          </Container>
        </Section>
      ))}
    </>
  )
}
