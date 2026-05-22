import { useEffect, type ReactElement } from 'react'
import type { Decorator } from '@storybook/react'

function ThemeApplier({ theme, children }: { theme: string; children: ReactElement }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    return () => {
      document.documentElement.setAttribute('data-theme', 'bone')
    }
  }, [theme])
  return children
}

export const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? 'bone'
  return (
    <ThemeApplier theme={theme}>
      <Story />
    </ThemeApplier>
  )
}
