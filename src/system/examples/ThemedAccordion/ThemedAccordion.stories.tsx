import type { Meta, StoryObj } from '@storybook/react'
import { ThemedAccordion } from './ThemedAccordion'
import { Section, Container, Stack, Text } from '@system/primitives'

const meta: Meta<typeof ThemedAccordion> = { title: 'Examples/ThemedAccordion', component: ThemedAccordion }
export default meta
type S = StoryObj<typeof ThemedAccordion>

export const Default: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="loose">
          <Text role="display" as="h1">Themed accordions</Text>
          <Text role="lead">Open one. The page reskins for as long as it is open.</Text>
          <ThemedAccordion content={{ summary: 'Family & partner support', theme: 'pink' }}>
            <Text role="body">Childcare, school options, partner work support, and community.</Text>
          </ThemedAccordion>
          <ThemedAccordion content={{ summary: 'Industry & careers', theme: 'blue' }}>
            <Text role="body">Volvo, Astra Zeneca, SKF, and the small studios doing quietly excellent work.</Text>
          </ThemedAccordion>
          <ThemedAccordion content={{ summary: 'Livability', theme: 'yellow' }}>
            <Text role="body">The shape of a week. Light and dark seasons. Saturday saunas.</Text>
          </ThemedAccordion>
          <ThemedAccordion content={{ summary: 'AI moving guide', theme: 'neutral-dark' }}>
            <Text role="body">A patient companion for the real questions.</Text>
          </ThemedAccordion>
        </Stack>
      </Container>
    </Section>
  )
}
