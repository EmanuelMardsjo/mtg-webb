#!/usr/bin/env tsx
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { emitTokensCss } from './build/emit'
import { emitTokensTypes } from './build/emit-types'
import { verifyThemeContrast } from './build/verify'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = join(here, 'generated')

const errors = verifyThemeContrast()
if (errors.length) {
  console.error('Token build failed: theme contrast below AA (4.5:1)')
  for (const e of errors) {
    console.error(`  theme=${e.theme}  text=${e.text}  surface=${e.surface}  ratio=${e.ratio.toFixed(2)}`)
  }
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'tokens.css'), emitTokensCss())
writeFileSync(join(outDir, 'tokens.types.ts'), emitTokensTypes())
console.log('Tokens built: src/tokens/generated/tokens.css + tokens.types.ts')
