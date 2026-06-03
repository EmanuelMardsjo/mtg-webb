import type { Meta, StoryObj } from '@storybook/react'
import type { ReactNode } from 'react'
import { Section, Container, Stack, Text, Grid, Col } from '@system/primitives'
import { fontFamily, fontSize, fontWeight, lineHeight, tracking } from '@tokens/primitives/type'
import { textRoles, type TextRole } from '@tokens/semantic/type'
import s from './_internal/Typography.module.css'

const meta: Meta = { title: 'Foundations/Typography' }
export default meta

type S = StoryObj

type FontFamilyKey = keyof typeof fontFamily
type FontWeightKey = keyof typeof fontWeight

const roles = Object.keys(textRoles) as TextRole[]
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

const fontSpecimens = [
  {
    key: 'display',
    label: 'Display',
    name: 'PP Telegraf',
    weight: 'display-ultrabold',
    sample: 'Move to Gothenburg ÅÄÖ'
  },
  {
    key: 'body',
    label: 'Body',
    name: 'PP Object Sans',
    weight: 'body-regular',
    sample: 'A practical guide for international professionals. 0123456789'
  }
] satisfies {
  key: FontFamilyKey
  label: string
  name: string
  weight: FontWeightKey
  sample: string
}[]

function cssVar(prefix: string, key: string): string {
  return `var(--${prefix}-${key})`
}

function TokenRow({
  name,
  value,
  children
}: {
  name: string
  value: string | number
  children: ReactNode
}) {
  return (
    <div className={s.tokenRow}>
      <span className={s.tokenName}>{name}</span>
      <span className={s.tokenValue}>{value}</span>
      {children}
    </div>
  )
}

function RoleDetails({ role }: { role: TextRole }) {
  const def = textRoles[role]
  const details = [
    ['Family', `font.${def.family}`],
    ['Size', `fs.${def.size}`],
    ['Leading', def.leading],
    ['Tracking', def.tracking],
    ['Weight', String(def.weight)]
  ]

  if (def.transform) details.push(['Transform', def.transform])
  if (def.style) details.push(['Style', def.style])

  return (
    <dl className={s.roleDetails}>
      {details.map(([term, value]) => (
        <div key={term} className={s.roleDetail}>
          <dt className={s.roleDetailTerm}>{term}</dt>
          <dd className={s.roleDetailValue}>{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export const Primitives: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Stack gap="snug">
            <Text role="display" as="h1">Typography primitives</Text>
            <Text role="lead">The type source of truth currently contains {Object.keys(fontFamily).length} font families, {Object.keys(fontWeight).length} weight tokens, {Object.keys(fontSize).length} fluid size steps, {Object.keys(lineHeight).length} line-height tokens, and {Object.keys(tracking).length} tracking tokens.</Text>
          </Stack>

          <Stack gap="default">
            <Text role="h2">Fonts</Text>
            <div className={s.specimenGrid}>
              {fontSpecimens.map(font => (
                <div key={font.key} className={s.specimen}>
                  <div
                    className={s.specimenSample}
                    style={{
                      fontFamily: cssVar('font', font.key),
                      fontWeight: cssVar('fw', font.weight)
                    }}
                  >
                    {font.sample}
                  </div>
                  <div className={s.specimenMeta}>
                    <Text role="tag" tone="muted">{font.label} font</Text>
                    <Text role="h3" as="h2">{font.name}</Text>
                    <Text role="meta" tone="muted">--font-{font.key}: {fontFamily[font.key]}</Text>
                    <Text role="meta" tone="muted">--fw-{font.weight}: {fontWeight[font.weight]}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Stack>

          <div className={s.tokenGroup}>
            <Text role="h2">Font sizes</Text>
            <div className={s.tokenRows}>
              {Object.entries(fontSize).map(([key, value]) => (
                <TokenRow key={key} name={`--fs-${key}`} value={value}>
                  <span className={s.sizePreview} style={{ fontSize: cssVar('fs', key) }}>Aa</span>
                </TokenRow>
              ))}
            </div>
          </div>

          <div className={s.tokenGroup}>
            <Text role="h2">Line heights</Text>
            <div className={s.tokenRows}>
              {Object.entries(lineHeight).map(([key, value]) => (
                <TokenRow key={key} name={`--lh-${key}`} value={value}>
                  <span className={s.lineHeightPreview} style={{ lineHeight: cssVar('lh', key) }}>
                    First line of text.<br />
                    Second line of text.
                  </span>
                </TokenRow>
              ))}
            </div>
          </div>

          <div className={s.tokenGroup}>
            <Text role="h2">Tracking</Text>
            <div className={s.tokenRows}>
              {Object.entries(tracking).map(([key, value]) => (
                <TokenRow key={key} name={`--tracking-${key}`} value={value}>
                  <span className={s.trackingPreview} style={{ letterSpacing: cssVar('tracking', key) }}>
                    Tracking sample
                  </span>
                </TokenRow>
              ))}
            </div>
          </div>

          <div className={s.tokenGroup}>
            <Text role="h2">Font weights</Text>
            <div className={s.tokenRows}>
              {Object.entries(fontWeight).map(([key, value]) => {
                const family: FontFamilyKey = key.startsWith('display') ? 'display' : 'body'

                return (
                  <TokenRow key={key} name={`--fw-${key}`} value={value}>
                    <span
                      className={s.weightPreview}
                      style={{
                        fontFamily: cssVar('font', family),
                        fontWeight: cssVar('fw', key)
                      }}
                    >
                      {family === 'display' ? 'PP Telegraf' : 'PP Object Sans'}
                    </span>
                  </TokenRow>
                )
              })}
            </div>
          </div>
        </Stack>
      </Container>
    </Section>
  )
}

export const Roles: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Stack gap="snug">
            <Text role="display" as="h1">Text primitive roles</Text>
            <Text role="lead">These are the existing semantic roles accepted by the current Text primitive.</Text>
          </Stack>

          <div className={s.roleRows}>
            {roles.map(role => (
              <div key={role} className={s.roleRow}>
                <div>
                  <Text role="tag" tone="muted">role="{role}"</Text>
                  <RoleDetails role={role} />
                </div>
                <div className={s.roleSample}>
                  <Text role={role}>{sampleText[role]}</Text>
                </div>
              </div>
            ))}
          </div>
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
