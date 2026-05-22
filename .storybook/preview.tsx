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
        order: ['Foundations', ['Introduction', 'Tokens & Architecture', 'Color', 'Typography', 'Spacing & Sizing', 'Layout & 5-Column Grid', 'Theming', 'Motion', 'Accessibility'], 'Examples', 'Pages']
      }
    }
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Sets data-theme on <html>',
      defaultValue: 'bone',
      toolbar: {
        icon: 'paintbrush',
        title: 'Theme',
        items: [
          { value: 'bone',        title: 'Bone (default)' },
          { value: 'bone-raised', title: 'Bone raised' },
          { value: 'sky',         title: 'Sky' },
          { value: 'clay',        title: 'Clay' },
          { value: 'sage',        title: 'Sage' },
          { value: 'ink',         title: 'Ink' },
          { value: 'campaign',    title: 'Campaign (fallback)' }
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
