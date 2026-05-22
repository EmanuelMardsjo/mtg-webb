import { useState, useCallback } from 'react'

/** Tiny hover wrapper. Mostly CSS — useful when a component needs to gate React behavior on cursor hover. */
export function useHover() {
  const [hovered, setHovered] = useState(false)
  const onMouseEnter = useCallback(() => setHovered(true), [])
  const onMouseLeave = useCallback(() => setHovered(false), [])
  return { hovered, bind: { onMouseEnter, onMouseLeave } }
}
