// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, Icon, Inline } from '@system/primitives'
import type { ChecklistTeaserContent } from './types'

export type ChecklistTeaserProps = { content: ChecklistTeaserContent }

export function ChecklistTeaser({ content }: ChecklistTeaserProps) {
  return (
    <Section theme={content.theme} spacing="lg">
      <Container>
        <Grid>
          <Col span={{ sm: 1, md: 2, lg: 2 }}>
            <Stack gap="snug">
              {content.eyebrow && <Text role="tag" tone="muted">{content.eyebrow}</Text>}
              <Text role="h2">{content.heading}</Text>
              {content.intro && <Text role="body" tone="muted">{content.intro}</Text>}
            </Stack>
          </Col>
          <Col span={{ sm: 1, md: 2, lg: 3 }}>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <Stack gap="loose">
                {content.items.map((item, i) => (
                  <li key={i}>
                    <Inline gap="default" align="start">
                      <Icon name="check" size="md" aria-hidden />
                      <Stack gap="tight">
                        <Text role="body">{item.label}</Text>
                        {item.description && <Text role="body-sm" tone="muted">{item.description}</Text>}
                      </Stack>
                    </Inline>
                  </li>
                ))}
              </Stack>
            </ol>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
