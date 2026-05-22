import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { Section, Container, Grid, Col, Stack, Text } from '@system/primitives'
import { Block } from './_internal/GridOverlay'

const meta: Meta = { title: 'Foundations/Layout & 5-Column Grid' }
export default meta

type S = StoryObj

function Composition({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stack gap="snug">
      <Text role="tag" tone="muted">{title}</Text>
      <Grid>{children}</Grid>
    </Stack>
  )
}

export const Compositions: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Text role="display" as="h1">5-column compositions</Text>

          <Composition title="Full · span 5">
            <Col span={{ lg: 5 }}><Block label="5" /></Col>
          </Composition>

          <Composition title="Asym left · 2 + 3">
            <Col span={{ lg: 2 }}><Block label="2" /></Col>
            <Col span={{ lg: 3 }}><Block label="3" /></Col>
          </Composition>

          <Composition title="Asym right · 3 + 2">
            <Col span={{ lg: 3 }}><Block label="3" /></Col>
            <Col span={{ lg: 2 }}><Block label="2" /></Col>
          </Composition>

          <Composition title="Lead column · 1 + 3 (start col 2)">
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 3 }} start={{ lg: 2 }}><Block label="3 @ col 2" /></Col>
          </Composition>

          <Composition title="Wide single · 3 starting col 2">
            <Col span={{ lg: 3 }} start={{ lg: 2 }}><Block label="3 @ col 2 (col 1 + 5 = air)" /></Col>
          </Composition>

          <Composition title="Sidekick · 1 + 4">
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 4 }}><Block label="4" /></Col>
          </Composition>

          <Composition title="Even pair · 2 + 2 (col 5 air)">
            <Col span={{ lg: 2 }}><Block label="2" /></Col>
            <Col span={{ lg: 2 }}><Block label="2" /></Col>
          </Composition>

          <Composition title="Five-up · 1+1+1+1+1 (use rarely)">
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
            <Col span={{ lg: 1 }}><Block label="1" /></Col>
          </Composition>
        </Stack>
      </Container>
    </Section>
  )
}
