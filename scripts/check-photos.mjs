// Fails if any image under content/ still has metadata (EXIF/XMP/IPTC, which can hold GPS)
// or is larger than 3 MB. Runs as a git pre-commit hook and in the deploy workflow.
import sharp from "sharp"
import { readdir, stat } from "node:fs/promises"
import path from "node:path"

const root = process.argv[2] ?? "content"
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"])
const MAX_BYTES = 3 * 1024 * 1024

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p)
    else yield p
  }
}

let bad = 0
for await (const file of walk(root)) {
  if (!EXTS.has(path.extname(file).toLowerCase())) continue
  const meta = await sharp(file).metadata()
  if (meta.exif || meta.xmp || meta.iptc) {
    console.error(`METADATA  ${file} has EXIF/XMP/IPTC data (may include GPS location)`)
    bad++
  }
  if ((await stat(file)).size > MAX_BYTES) {
    console.error(`TOO LARGE ${file} is over 3 MB`)
    bad++
  }
}
if (bad) {
  console.error(`\n${bad} photo problem(s). Fix with: npm run photos -- <source-dir> <dest-dir>`)
  process.exit(1)
}
console.log("Photo check passed.")
