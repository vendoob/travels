// Resize photos and strip ALL metadata (EXIF/GPS/etc) before they go in the repo.
// Usage: npm run photos -- <source-dir> <dest-dir>
//   e.g. npm run photos -- ~/originals/safari content/trips/2026-east-africa/images
import sharp from "sharp"
import { readdir, mkdir } from "node:fs/promises"
import path from "node:path"

const [src, dest] = process.argv.slice(2)
if (!src || !dest) {
  console.error("Usage: npm run photos -- <source-dir> <dest-dir>")
  console.error("  e.g. npm run photos -- ~/originals/safari content/trips/2026-east-africa/images")
  process.exit(1)
}

const MAX_EDGE = 1600
const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"])

await mkdir(dest, { recursive: true })
let done = 0
for (const file of await readdir(src)) {
  const ext = path.extname(file).toLowerCase()
  if (!EXTS.has(ext)) {
    console.warn(`skip ${file} (unsupported type; convert HEIC to JPG first)`)
    continue
  }
  const name = path
    .parse(file)
    .name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  const out = path.join(dest, `${name}.jpg`)
  // sharp drops all metadata unless asked to keep it; rotate() applies the EXIF
  // orientation first so photos stay upright after the tag is gone.
  await sharp(path.join(src, file))
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out)
  console.log(`${file} -> ${out}`)
  done++
}
console.log(`Processed ${done} photo(s).`)
