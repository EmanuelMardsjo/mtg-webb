import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/stories/foundations/**/*.mdx',
    '../src/stories/foundations/**/*.stories.@(ts|tsx)',
    '../src/system/examples/**/*.stories.@(ts|tsx)',
    '../src/stories/pages/**/*.stories.@(ts|tsx)'
  ],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: { backgrounds: false } // themes replace backgrounds
    },
    '@storybook/addon-a11y'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  typescript: { reactDocgen: 'react-docgen-typescript' }
}

export default config
