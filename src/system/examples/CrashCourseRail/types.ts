import type { ThemeName } from '@tokens/themes'

export type CrashCourseRailCard = {
  title: string
  description: string
  image: { src: string; alt: string }
  href?: string
}

export type CrashCourseRailContent = {
  eyebrow?: string
  heading: string
  lead?: string
  cards: CrashCourseRailCard[]
  theme?: ThemeName
}
