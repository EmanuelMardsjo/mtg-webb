import type { Preview } from '@storybook/react'
import '../src/system/styles/global.css'
import { withTheme } from './decorators/withTheme'
import { withReducedMotion } from './decorators/withReducedMotion'
import { withProviders } from './decorators/withProviders'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
    layout: 'fullscreen',
    viewport: {
      viewports: {
        sm: { name: 'sm (mobile)',  styles: { width: '375px',  height: '812px' } },
        md: { name: 'md (tablet)',  styles: { width: '900px',  height: '1200px' } },
        lg: { name: 'lg (desktop)', styles: { width: '1440px', height: '1000px' } }
      }
    },
    options: {
      storySort: {
        order: ['Foundations', ['Introduction', 'Brand', 'Image Bank', 'Tokens & Architecture', 'Color', 'Typography', 'Spacing & Sizing', 'Layout & 5-Column Grid', 'Theming', 'Motion', 'Accessibility'], 'Examples', 'Pages']
      }
    }
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Sets data-theme on <html>',
      defaultValue: 'neutral',
      toolbar: {
        icon: 'paintbrush',
        title: 'Theme',
        items: [
          { value: 'neutral',        title: 'Neutral (default)' },
          { value: 'neutral-raised', title: 'Neutral raised' },
          { value: 'neutral-dark',   title: 'Neutral dark' },
          { value: 'blue-soft',      title: 'Blue soft' },
          { value: 'blue',           title: 'Blue' },
          { value: 'blue-deep',      title: 'Blue deep' },
          { value: 'yellow-soft',    title: 'Yellow soft' },
          { value: 'yellow',         title: 'Yellow' },
          { value: 'amber',          title: 'Amber' },
          { value: 'amber-deep',     title: 'Amber deep' },
          { value: 'pink-soft',      title: 'Pink soft' },
          { value: 'pink',           title: 'Pink' },
          { value: 'campaign',       title: 'Campaign (fallback)' }
        ],
        dynamicTitle: true
      }
    },
    reducedMotion: {
      name: 'Reduced motion',
      description: 'Force prefers-reduced-motion behavior',
      defaultValue: 'off',
      toolbar: {
        icon: 'lightning',
        title: 'Reduced motion',
        items: [
          { value: 'off', title: 'Off' },
          { value: 'on',  title: 'On' }
        ]
      }
    }
  },
  decorators: [withProviders, withReducedMotion, withTheme]
}

export default preview
