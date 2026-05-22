import type { Decorator } from '@storybook/react'
import { ThemeOverrideProvider } from '../../src/system/hooks'

export const withProviders: Decorator = (Story) => (
  <ThemeOverrideProvider>
    <Story />
  </ThemeOverrideProvider>
)
