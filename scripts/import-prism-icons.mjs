import { execFileSync } from "node:child_process"
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs"
import { basename, dirname, extname, join, relative } from "node:path"

const root = process.cwd()
const zipPath = join(root, "prism-icons-source.zip")
const tempDir = join(root, ".tmp-prism-icons")
const outputDir = join(root, "src", "assets", "icons")

if (!existsSync(zipPath)) {
  console.error("Missing prism-icons-source.zip in the project root.")
  process.exit(1)
}

function normaliseName(filename) {
  const extension = extname(filename).toLowerCase()
  const name = basename(filename, extension)
    .replace(/&/g, "-and-")
    .replace(/\+/g, "-plus-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .toLowerCase()

  return `${name}${extension}`
}

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

rmSync(tempDir, { recursive: true, force: true })
rmSync(outputDir, { recursive: true, force: true })

mkdirSync(tempDir, { recursive: true })
mkdirSync(outputDir, { recursive: true })

execFileSync("unzip", ["-q", zipPath, "-d", tempDir])

const files = walk(tempDir).filter(
  (file) =>
    extname(file).toLowerCase() === ".svg" &&
    !file.includes(`${join(tempDir, "__MACOSX")}`)
)

const sourceRoot = files
  .map((file) => dirname(file))
  .find((directory) => directory.includes("Prism Icons"))

if (!sourceRoot) {
  console.error("Could not locate the Prism Icons directory.")
  process.exit(1)
}

let imported = 0
const usedPaths = new Set()

for (const sourceFile of files) {
  const sourceRelative = relative(tempDir, sourceFile)
  const parts = sourceRelative.split("/")

  const prismIndex = parts.findIndex((part) =>
    part.trim().toLowerCase().startsWith("prism icons")
  )

  if (prismIndex === -1) continue

  const prismParts = parts.slice(prismIndex + 1)
  const iconsIndex = prismParts.indexOf("icons")

  let destinationParts

  if (iconsIndex >= 0) {
    destinationParts = prismParts.slice(iconsIndex + 1)
  } else {
    destinationParts = ["product", ...prismParts]
  }

  const filename = normaliseName(destinationParts.pop())
  const destinationDirectory = join(outputDir, ...destinationParts)
  mkdirSync(destinationDirectory, { recursive: true })

  let destinationFile = join(destinationDirectory, filename)
  let counter = 2

  while (usedPaths.has(destinationFile) || existsSync(destinationFile)) {
    const extension = extname(filename)
    const name = basename(filename, extension)
    destinationFile = join(
      destinationDirectory,
      `${name}-${counter}${extension}`
    )
    counter += 1
  }

  cpSync(sourceFile, destinationFile)
  usedPaths.add(destinationFile)
  imported += 1
}

rmSync(tempDir, { recursive: true, force: true })

console.log(`Imported ${imported} Prism SVG icons into:`)
console.log(relative(root, outputDir))
