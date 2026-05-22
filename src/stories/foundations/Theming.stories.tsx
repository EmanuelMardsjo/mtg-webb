import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text, TextLink } from '@system/primitives'
import { useThemeOverride } from '@system/hooks'
import { themeNames, type ThemeName } from '@tokens/themes'

const meta: Meta = { title: 'Foundations/Theming' }
export default meta

type S = StoryObj

function ThemedRow({ theme }: { theme: ThemeName }) {
  return (
    <Section theme={theme} spacing="md">
      <Container>
        <Stack gap="snug">
          <Text role="tag" tone="muted">data-theme="{theme}"</Text>
          <Text role="h2">Move to Gothenburg.</Text>
          <Text role="body">All theme switching happens on a single attribute. Components don't know which theme they're in.</Text>
          <TextLink href="#" arrow>Read more</TextLink>
        </Stack>
      </Container>
    </Section>
  )
}

export const AllThemes: S = {
  render: () => (
    <Stack gap="tight">
      {themeNames.filter(n => n !== 'campaign').map(t => <ThemedRow key={t} theme={t} />)}
    </Stack>
  )
}

function Demo({ active }: { active: ThemeName | null }) {
  useThemeOverride(active)
  return null
}

export const InteractiveOverride: S = {
  render: () => {
    const [active, setActive] = useState<ThemeName | null>(null)
    return (
      <Section spacing="lg">
        <Container>
          <Stack gap="loose">
            <Text role="display" as="h1">Interactive override</Text>
            <Text role="lead">Toggle a theme below. The entire page re-skins via <code>useThemeOverride</code>. Toggle off to revert.</Text>
            <Stack gap="default" align="start">
              {(['sky','clay','sage','ink'] as ThemeName[]).map(t => (
                <TextLink key={t} href="#" onClick={(e) => { e.preventDefault(); setActive(active === t ? null : t) }}>
                  {active === t ? `Clear ${t}` : `Apply ${t}`}
                </TextLink>
              ))}
            </Stack>
          </Stack>
        </Container>
        <Demo active={active} />
      </Section>
    )
  }
}
