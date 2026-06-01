import type { Meta, StoryObj } from '@storybook/react'
import { Container, Section, Stack, Text } from '@system/primitives'
import s from './_internal/BrandAssets.module.css'

const meta: Meta = { title: 'Foundations/Brand' }
export default meta

type S = StoryObj

const logoPath = '/brand/mtg-logo.svg'

const details = [
  { label: 'Asset', value: logoPath },
  { label: 'Source', value: 'Figma node 74:31' },
  { label: 'Format', value: 'SVG lockup with icon and wordmark paths' }
]

export const Logo: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Stack gap="snug">
            <Text role="display" as="h1">Brand</Text>
            <Text role="lead">Primary Move to Gothenburg logo imported from the Figma concept file.</Text>
          </Stack>

          <div className={s.logoPanel}>
            <img className={s.logo} src={logoPath} alt="Move to Gothenburg" />
          </div>

          <Stack gap="default">
            <Text role="h2">Logo sizes</Text>
            <div className={s.sizeGrid}>
              <div className={s.sizePanel}>
                <img className={`${s.logo} ${s.logoLarge}`} src={logoPath} alt="Move to Gothenburg" />
              </div>
              <div className={s.sizePanel}>
                <img className={`${s.logo} ${s.logoMedium}`} src={logoPath} alt="Move to Gothenburg" />
              </div>
              <div className={s.sizePanel}>
                <img className={`${s.logo} ${s.logoSmall}`} src={logoPath} alt="Move to Gothenburg" />
              </div>
            </div>
          </Stack>

          <div className={s.details}>
            {details.map(item => (
              <div key={item.label} className={s.detailRow}>
                <Text role="tag" tone="muted">{item.label}</Text>
                <Text role="body" className={s.detailValue}>{item.value}</Text>
              </div>
            ))}
          </div>
        </Stack>
      </Container>
    </Section>
  )
}
