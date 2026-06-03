import type { ThemeName } from '@tokens/themes'

export type FooterCtaContent = {
  runway: {
    eyebrow: string
    headline: string
    lead: string
    media?: { src: string; alt: string }
  }
  cta: {
    eyebrow: string
    title: string
    lead: string
    action: { label: string; href: string }
  }
  footer: {
    columns: Array<{
      tag: string
      items: Array<{ text: string; href?: string }>
    }>
    legal: string
    coords?: string
  }
  runwayTheme?: ThemeName
  footerTheme?: ThemeName
}
