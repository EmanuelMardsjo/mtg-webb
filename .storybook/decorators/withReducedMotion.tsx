import { useEffect, type ReactElement } from 'react'
import type { Decorator } from '@storybook/react'

function ReducedMotionApplier({ reduced, children }: { reduced: boolean; children: ReactElement }) {
  useEffect(() => {
    if (reduced) document.documentElement.classList.add('force-reduced-motion')
    else document.documentElement.classList.remove('force-reduced-motion')
    return () => {
      document.documentElement.classList.remove('force-reduced-motion')
    }
  }, [reduced])
  return children
}

export const withReducedMotion: Decorator = (Story, context) => {
  const reduced = context.globals.reducedMotion === 'on'
  return (
    <ReducedMotionApplier reduced={reduced}>
      <Story />
    </ReducedMotionApplier>
  )
}
