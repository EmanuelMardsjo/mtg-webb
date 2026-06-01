import type { Meta, StoryObj } from '@storybook/react'
import { Section, Container, Stack, Text } from '@system/primitives'
import { brandColorSteps, palette } from '@tokens/primitives/color'
import { themes, themeNames, type ThemeName } from '@tokens/themes'
import type { ColorRoleKey } from '@tokens/semantic/color'
import s from './_internal/SemanticColorMatrix.module.css'
import { Swatch, SwatchRow } from './_internal/Swatch'

const meta: Meta = { title: 'Foundations/Color' }
export default meta

type S = StoryObj

const themeGroups = [
  { label: 'Neutral', themes: ['neutral', 'neutral-raised', 'neutral-dark'] },
  { label: 'Soft', themes: ['blue-soft', 'yellow-soft', 'pink-soft'] },
  { label: 'Base', themes: ['blue', 'yellow', 'amber', 'pink'] },
  { label: 'Deep', themes: ['blue-deep', 'amber-deep'] }
] satisfies { label: string; themes: readonly ThemeName[] }[]

const sketchRhythms = [
  { label: 'Soft rhythm', themes: ['neutral', 'pink-soft', 'neutral', 'blue-soft', 'yellow'] },
  { label: 'Bold rhythm', themes: ['neutral', 'amber-deep', 'neutral', 'blue', 'amber'] }
] satisfies { label: string; themes: readonly ThemeName[] }[]

const semanticColorGroups = [
  { label: 'Surface', roles: ['surface-page', 'surface-raised'] },
  { label: 'Text', roles: ['text-default', 'text-muted', 'text-on-dark'] },
  { label: 'Border', roles: ['border-subtle', 'border-strong'] },
  { label: 'Accent / focus', roles: ['focus-ring', 'accent-line'] },
  { label: 'Status', roles: ['status-success', 'status-warning', 'status-danger', 'status-info'] },
  { label: 'Overlay', roles: ['overlay-neutral-dark', 'overlay-scrim', 'overlay-neutral'] }
] satisfies { label: string; roles: readonly ColorRoleKey[] }[]

function isBrandColorStep(family: string, shade: string): boolean {
  return (brandColorSteps[family as keyof typeof brandColorSteps] as readonly number[])
    .map(String)
    .includes(shade)
}

function tokenVar(role: ColorRoleKey): string {
  return `var(--color-${role})`
}

function primitiveSource(value: string): string | null {
  for (const [family, shades] of Object.entries(palette)) {
    for (const [shade, color] of Object.entries(shades)) {
      if (color === value) return `palette.${family}[${shade}]`
    }
  }
  return null
}

function sourceLabel(role: ColorRoleKey, value: string): string {
  if (role.startsWith('status-')) return `status.${role.replace('status-', '')}`
  if (role === 'overlay-neutral-dark') return "overlay['neutral-dark']"
  if (role === 'overlay-scrim') return 'overlay.scrim'
  if (role === 'overlay-neutral') return 'overlay.neutral'
  if (value.startsWith('var(--campaign-')) return value
  return primitiveSource(value) ?? value
}

function markerLabel(role: ColorRoleKey, value: string): 'Theme' | 'Inherited' | 'Runtime fallback' {
  if (value.startsWith('var(--campaign-')) return 'Runtime fallback'
  if (role.startsWith('status-') || role.startsWith('overlay-')) return 'Inherited'
  return 'Theme'
}

function SemanticPreview({ role }: { role: ColorRoleKey }) {
  const value = tokenVar(role)

  if (role.startsWith('surface-')) {
    return (
      <span className={s.surfacePreview} style={{ background: value }}>
        {role.replace('surface-', '')}
      </span>
    )
  }

  if (role.startsWith('text-')) {
    return (
      <span
        className={role === 'text-on-dark' ? s.textOnDarkPreview : s.textPreview}
        style={{ color: value }}
      >
        Text
      </span>
    )
  }

  if (role.startsWith('border-')) {
    return <span className={s.borderPreview} style={{ borderColor: value }}>Border</span>
  }

  if (role === 'focus-ring') {
    return <span className={s.focusPreview} style={{ outlineColor: value }}>Focus</span>
  }

  if (role === 'accent-line') {
    return <span className={s.accentPreview} style={{ borderColor: value }}>Accent</span>
  }

  if (role.startsWith('status-')) {
    return (
      <span className={s.statusPreview}>
        <span className={s.statusDot} style={{ background: value }} />
        {role.replace('status-', '')}
      </span>
    )
  }

  return (
    <span className={s.overlayPreview}>
      <span className={s.overlayFill} style={{ background: value }} />
    </span>
  )
}

export const Primitives: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="xl">
          <Text role="display" as="h1">Color primitives</Text>
          <Text role="lead">Five 11-step primitive scales, with amber bridging the warm deep swatches. Supplied swatches are marked as Brand color anchors.</Text>
          {Object.entries(palette).map(([family, shades]) => (
            <Stack key={family} gap="default">
              <Text role="h3" as="h2">{family}</Text>
              <SwatchRow>
                {Object.entries(shades).map(([shade, value]) => (
                  <Swatch
                    key={shade}
                    name={`--${family}-${shade}`}
                    value={value as string}
                    color={value as string}
                    isBrandColor={isBrandColorStep(family, shade)}
                  />
                ))}
              </SwatchRow>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Section>
  )
}

export const SemanticColors: S = {
  render: () => (
    <Section spacing="lg">
      <Container>
        <Stack gap="loose">
          <Stack gap="snug">
            <Text role="display" as="h1">Semantic colors</Text>
            <Text role="lead">Each column is a live theme. Every row uses the actual semantic CSS variable emitted for that theme.</Text>
          </Stack>
          <div className={s.scroller}>
            <div className={s.matrix}>
              {themeNames.map(theme => (
                <div key={theme} className={s.themeColumn} data-theme={theme}>
                  <div className={s.themeHeader}>
                    <Text role="tag" tone="muted">data-theme="{theme}"</Text>
                    <Text role="h3" as="h2">{theme}</Text>
                  </div>
                  {semanticColorGroups.map(group => (
                    <div key={group.label} className={s.group}>
                      <Text role="tag" tone="muted">{group.label}</Text>
                      {group.roles.map(role => {
                        const value = themes[theme][role]
                        const marker = markerLabel(role, value)

                        return (
                          <div key={role} className={s.row}>
                            <SemanticPreview role={role} />
                            <span className={s.rowContent}>
                              <span className={s.rowTitle}>--color-{role}</span>
                              <span className={s.rowMeta}>{sourceLabel(role, value)}</span>
                              <span className={s.rowMeta}>{value}</span>
                              <span className={s.marker}>{marker}</span>
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Stack>
      </Container>
    </Section>
  )
}

export const ThemeRhythm: S = {
  render: () => (
    <Stack gap="loose">
      {sketchRhythms.map(rhythm => (
        <Stack key={rhythm.label} gap="tight">
          <Section spacing="md">
            <Container>
              <Text role="h3" as="h2">{rhythm.label}</Text>
            </Container>
          </Section>
          {rhythm.themes.map((theme, index) => (
            <Section key={`${rhythm.label}-${theme}-${index}`} theme={theme} spacing="md">
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
      ))}
      {themeGroups.map(group => (
        <Stack key={group.label} gap="tight">
          <Section spacing="md">
            <Container>
              <Text role="h3" as="h2">{group.label}</Text>
            </Container>
          </Section>
          {group.themes.map(theme => (
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
      ))}
    </Stack>
  )
}
