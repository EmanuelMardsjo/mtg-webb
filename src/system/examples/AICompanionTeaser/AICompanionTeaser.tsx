// EXAMPLE — demonstrates foundations only.
// Replace before production with a CMS-wired block.

import { Section, Container, Grid, Col, Stack, Text, TextLink } from '@system/primitives'
import type { AICompanionTeaserContent } from './types'

export type AICompanionTeaserProps = { content: AICompanionTeaserContent }

export function AICompanionTeaser({ content }: AICompanionTeaserProps) {
  return (
    <Section theme={content.theme ?? 'ink'} spacing="xl">
      <Container>
        <Grid>
          <Col span={{ sm: 1, md: 2, lg: 5 }}>
            <Stack gap="loose" align="start">
              {content.eyebrow && <Text role="tag">{content.eyebrow}</Text>}
              <Text role="hero" as="h2">{content.headline}</Text>
              {content.body && <Text role="lead">{content.body}</Text>}
              <Text role="quote">"{content.prompt}"</Text>
              <TextLink href={content.cta.href} arrow>{content.cta.label}</TextLink>
            </Stack>
          </Col>
        </Grid>
      </Container>
    </Section>
  )
}
