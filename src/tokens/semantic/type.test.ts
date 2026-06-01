import { describe, expect, it } from 'vitest'
import { textRoles, type TextRole } from './type'

describe('textRoles', () => {
  it('uses PP Telegraf display treatment from display through h2', () => {
    const roles: TextRole[] = ['display', 'hero', 'h1', 'h2']

    for (const role of roles) {
      expect(textRoles[role].family).toBe('display')
      expect(textRoles[role].weight).toBe(800)
    }
  })

  it('uses PP Object Sans Regular for body and supporting roles', () => {
    const roles: TextRole[] = ['h3', 'lead', 'body', 'body-sm', 'caption', 'meta', 'tag', 'quote']

    for (const role of roles) {
      expect(textRoles[role].family).toBe('body')
      expect(textRoles[role].weight).toBe(400)
    }

    expect(textRoles.quote.style).toBeUndefined()
  })

  it('uses PP Telegraf for the button role', () => {
    expect(textRoles.button.family).toBe('display')
    expect(textRoles.button.size).toBe('md')
    expect(textRoles.button.tracking).toBe('0')
    expect(textRoles.button.weight).toBe(800)
  })
})
