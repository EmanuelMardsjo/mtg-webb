// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, TextLink, Divider } from '@system/primitives'
import type { SignpostContent } from './types'

export type SignpostProps = { content: SignpostContent }

export function Signpost({ content }: SignpostProps) {
  return (
    <Section theme={content.theme} spacing="lg">
      <Container>
        <Grid>
          <Col span={{ sm: 1, md: 2, lg: 2 }}>
            <Stack gap="snug">
              {content.eyebrow && <Text role="tag" tone="muted">{content.eyebrow}</Text>}
              <Text role="h2">{content.heading}</Text>
            </Stack>
          </Col>
          <Col span={{ sm: 1, md: 2, lg: 3 }}>
            <Stack gap="default">
              {content.items.map((item, i) => (
                <Stack key={item.href} gap="snug">
                  {i > 0 && <Divider />}
                  <TextLink href={item.href} arrow>{item.label}</TextLink>
                  {item.description && <Text role="body-sm" tone="muted">{item.description}</Text>}
                </Stack>
              ))}
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
