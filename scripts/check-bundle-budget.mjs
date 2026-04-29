/**
 * Loose sanity check after `vite build`: flags unexpected growth in emitted JS.
 * Tune MAX_TOTAL_JS_BYTES when the app legitimately grows.
 */
import fs from 'node:fs'
import path from 'node:path'

const DIST_ASSETS = path.join(process.cwd(), 'dist', 'assets')
/** ~6 MiB uncompressed total JS — adjust upward if deliberate bundle growth */
const MAX_TOTAL_JS_BYTES = 6 * 1024 * 1024

function main() {
  if (!fs.existsSync(DIST_ASSETS)) {
    console.error('Expected dist/assets after npm run build. Run the build first.')
    process.exit(1)
  }
  const files = fs.readdirSync(DIST_ASSETS).filter((f) => f.endsWith('.js'))
  let total = 0
  for (const f of files) {
    total += fs.statSync(path.join(DIST_ASSETS, f)).size
  }
  const kb = (total / 1024).toFixed(1)
  console.log(`Bundle budget: ${files.length} JS file(s), ${kb} KiB total (limit ${MAX_TOTAL_JS_BYTES / 1024 / 1024} MiB).`)
  if (total > MAX_TOTAL_JS_BYTES) {
    console.error(`Total JS (${total} bytes) exceeds budget (${MAX_TOTAL_JS_BYTES}).`)
    process.exit(1)
  }
}

main()
