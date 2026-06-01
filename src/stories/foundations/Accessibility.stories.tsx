import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, TextLink, Inline, Icon } from '@system/primitives'

const meta: Meta = { title: 'Foundations/Accessibility' }
export default meta

type S = StoryObj

export const FocusStates: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="loose">
          <Text role="display" as="h1">Focus states</Text>
          <Text role="lead">Tab through the controls below. The focus ring is theme-defined; switch themes in the toolbar.</Text>
          <Inline gap="loose" wrap>
            <button>Button</button>
            <a href="#">Native link</a>
            <TextLink href="#" arrow>System TextLink</TextLink>
            <input type="text" placeholder="Input" />
          </Inline>
        </Stack>
      </Container>
    </Section>
  )
}

export const SkipLink: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <a className="sr-only" href="#main-content">Skip to main content</a>
        <Stack gap="loose">
          <Text role="display" as="h1">Skip link</Text>
          <Text role="lead">Tab into this story — the first focusable is a visually-hidden "Skip to main content" link.</Text>
          <div id="main-content">
            <Text role="body">This is the main content target.</Text>
          </div>
        </Stack>
      </Container>
    </Section>
  )
}

export const StatusSignaling: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="loose">
          <Text role="display" as="h1">Status signaling</Text>
          <Text role="lead">Color is paired with an icon + text — never the sole signal.</Text>
          <Stack gap="default">
            <Inline gap="default"><Icon name="check" size="md" aria-hidden /><Text role="body" tone="strong">Approved</Text></Inline>
            <Inline gap="default"><Icon name="arrow-right" size="md" aria-hidden /><Text role="body" tone="muted">In progress</Text></Inline>
          </Stack>
        </Stack>
      </Container>
    </Section>
  )
}
