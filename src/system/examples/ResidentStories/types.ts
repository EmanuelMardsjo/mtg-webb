import type { ThemeName } from '@tokens/themes'

export type ResidentStory = {
  eyebrow: string                  // origin → destination, e.g. "Bangalore → Lindholmen"
  headline: string                 // the pulled quote (renders as the story heading; supports \n)
  attribution: string              // "Aditi Menon — Staff engineer, Volvo Cars · arrived 2022 with partner & daughter"
  attributionName?: string         // OPTIONAL bold lead of the attribution (D-9 — kept body-400, no 700)
  image: { src: string; alt: string }   // alt required by the Image primitive
  side?: 'left' | 'right'          // OPTIONAL media side; default alternates by index
  href?: string                    // OPTIONAL (D-7). With href → navigating <a>; without → non-interactive <article>
}

export type ResidentStoriesContent = {
  eyebrow?: string                 // OPTIONAL intro eyebrow for the whole block (source has none — D-8)
  heading?: string                 // OPTIONAL intro heading (the Section aria-label carries the title by default — D-8)
  stories: ResidentStory[]         // source ships 3 (Aditi, Tomás, Maya)
  theme?: ThemeName                // default 'pink-soft' is applied in the component, not here
}
