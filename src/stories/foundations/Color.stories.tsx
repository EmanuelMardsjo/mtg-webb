import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text } from '@system/primitives'
import { palette } from '@tokens/primitives/color'
import { themeNames } from '@tokens/themes'
import { Swatch, SwatchRow } from './_internal/Swatch'

const meta: Meta = { title: 'Foundations/Color' }
export default meta

type S = StoryObj

export const Primitives: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Text role="display" as="h1">Color primitives</Text>
          <Text role="lead">Five families. Reserved tints (600) exist for future deeper themes.</Text>
          {Object.entries(palette).map(([family, shades]) => (
            <Stack key={family} gap="default">
              <Text role="h3" as="h2">{family}</Text>
              <SwatchRow>
                {Object.entries(shades).map(([shade, value]) => (
                  <Swatch key={shade} name={`--${family}-${shade}`} value={value as string} color={value as string} />
                ))}
              </SwatchRow>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Section>
  )
}

export const ThemeRhythm: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map(theme => (
        <Section key={theme} theme={theme} spacing="md">
          <Container>
            <Stack gap="snug">
              <Text role="tag" tone="muted">data-theme="{theme}"</Text>
              <Text role="h2">A warm welcome to a new city.</Text>
              <Text role="body">Strong text sits comfortably on every theme. Borders, focus rings and accents adapt automatically.</Text>
            </Stack>
          </Container>
        </Section>
      ))}
    </Stack>
  )
}
