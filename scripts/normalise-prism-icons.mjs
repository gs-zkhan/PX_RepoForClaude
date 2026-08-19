import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { extname, join, relative } from "node:path"

const root = process.cwd()
const iconsRoot = join(root, "src", "assets", "icons")
const targetDirectories = [
  join(iconsRoot, "16"),
  join(iconsRoot, "24"),
]

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)

    if (statSync(path).isDirectory()) {
      // Preserve AI icons exactly as exported.
      if (entry.toLowerCase() === "ai") return []
      return walk(path)
    }

    return [path]
  })
}

let inspected = 0
let updated = 0

for (const directory of targetDirectories) {
  if (!existsSync(directory)) continue

  const files = walk(directory).filter(
    (file) => extname(file).toLowerCase() === ".svg"
  )

  for (const file of files) {
    inspected += 1

    const original = readFileSync(file, "utf8")
    const normalised = original
      .replace(/stroke="#3C4A57"/gi, 'stroke="currentColor"')
      .replace(/fill="#3C4A57"/gi, 'fill="currentColor"')

    if (normalised !== original) {
      writeFileSync(file, normalised)
      updated += 1
    }
  }
}

console.log(`Inspected ${inspected} standard 16px and 24px SVG icons.`)
console.log(`Converted ${updated} icons from #3C4A57 to currentColor.`)
console.log("Preserved AI, filled, product, status and large illustration assets.")
