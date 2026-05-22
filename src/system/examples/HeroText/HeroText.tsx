// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, TextLink } from '@system/primitives'
import type { HeroTextContent } from './types'

export type HeroTextProps = { content: HeroTextContent }

export function HeroText({ content }: HeroTextProps) {
  return (
    <Section theme={content.theme} spacing="xl">
      <Container>
        <Grid>
          <Col span={{ sm: 1, md: 2, lg: 2 }}>
            {content.eyebrow && (
              <Text role="tag" tone="muted">{content.eyebrow}</Text>
            )}
          </Col>
          <Col span={{ sm: 1, md: 2, lg: 3 }}>
            <Stack gap="loose">
              <Text role="display" as="h1" tone="strong">{content.headline}</Text>
              {content.lead && <Text role="lead">{content.lead}</Text>}
              {content.cta && <TextLink href={content.cta.href} arrow>{content.cta.label}</TextLink>}
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
