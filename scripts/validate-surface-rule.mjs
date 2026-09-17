import fs from "node:fs"
import path from "node:path"

// -----------------------------------------------------------------------------
// Product Surface Rule guard (CLAUDE.md): a container directly on the
// product/page background uses shadow-100 and no visible border; a container
// nested on another surface uses a border and no shadow — never both. This
// script exists because every instance found and fixed during the v1.1
// audit (user-explorer.tsx, engagements-list-example.tsx,
// detail-drilldown-shell-example.tsx, account-explorer.tsx,
// analytics-example.tsx, create-edit-shell-example.tsx, work-in-progress.tsx)
// was found by a human manually clicking through the app, one at a time —
// nothing in CI would have caught a regression or a new instance.
//
// Detection: for every `className={cn(...)}` block (matched by paren
// balancing, so it's tolerant of the block spanning many lines) and every
// single-line `className="..."` string in a .tsx file, flag it if it
// contains both a `border` utility and `shadow-[var(--e-shadow-100)]`.
//
// This deliberately does NOT distinguish "page container" from "control
// handle" (e.g. a slider thumb or color-picker swatch legitimately combines
// a border ring with a shadow for depth — that's a different, accepted UI
// convention, not a Product Surface Rule violation). Baseline model, same as
// tokens/alias-debt-baseline.json: fingerprints already known and accepted
// live in surface-rule-baseline.json and never fail the check. A fingerprint
// that appears now but isn't in the baseline is a NEW instance and fails —
// either it's a genuine new violation (fix it) or a legitimate new handle-
// style use (add it to the baseline with a reason, don't silently pass).
// -----------------------------------------------------------------------------

const ROOT = path.resolve(import.meta.dirname, "..")
const SRC_DIR = path.join(ROOT, "src")
const BASELINE_PATH = path.join(ROOT, "ai", "surface-rule-baseline.json")

function findTsxFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      findTsxFiles(full, out)
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      out.push(full)
    }
  }
  return out
}

function isViolation(block) {
  return block.includes("border") && block.includes("shadow-[var(--e-shadow-100)]")
}

/** Finds every `className={cn(` ... balanced `)}` block's start line and content. */
function findCnBlocks(content) {
  const blocks = []
  const marker = "className={cn("
  let searchFrom = 0
  while (true) {
    const idx = content.indexOf(marker, searchFrom)
    if (idx === -1) break
    const openParenIdx = idx + marker.length - 1
    let depth = 1
    let i = openParenIdx + 1
    while (i < content.length && depth > 0) {
      if (content[i] === "(") depth++
      else if (content[i] === ")") depth--
      i++
    }
    const block = content.slice(idx, i)
    const line = content.slice(0, idx).split("\n").length
    blocks.push({ line, block })
    searchFrom = i
  }
  return blocks
}

/** Finds every single-line `className="..."` (not the cn() form). */
function findPlainClassNames(content) {
  const results = []
  const lines = content.split("\n")
  const re = /className="([^"]*)"/g
  lines.forEach((lineText, idx) => {
    let m
    re.lastIndex = 0
    while ((m = re.exec(lineText))) {
      results.push({ line: idx + 1, block: m[1] })
    }
  })
  return results
}

/**
 * Baseline entries are "path:line — human-readable reason" — only the
 * "path:line" prefix (before the em dash) is the actual matchable
 * fingerprint; the rest documents why it's accepted.
 */
function loadBaseline() {
  if (!fs.existsSync(BASELINE_PATH)) return new Set()
  const parsed = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8"))
  const keys = (parsed.fingerprints ?? []).map((fp) => fp.split(" — ")[0].trim())
  return new Set(keys)
}

function main() {
  const baseline = loadBaseline()
  const files = findTsxFiles(SRC_DIR)
  const found = []

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8")
    const relPath = path.relative(ROOT, file)
    const candidates = [...findCnBlocks(content), ...findPlainClassNames(content)]
    for (const { line, block } of candidates) {
      if (isViolation(block)) {
        found.push(`${relPath}:${line}`)
      }
    }
  }

  const newViolations = found.filter((fp) => !baseline.has(fp))
  const staleBaseline = [...baseline].filter((fp) => !found.includes(fp))

  if (newViolations.length > 0) {
    console.error("Product Surface Rule violation(s) — border and shadow-100 combined on the same element:")
    for (const fp of newViolations) console.error(`  ${fp}`)
    console.error(
      "\nEither fix it (see CLAUDE.md's Product Surface Rule) or, if this is a legitimate control-handle-style" +
        " use (not a page-level container), add its fingerprint to ai/surface-rule-baseline.json with a reason.",
    )
    process.exitCode = 1
    return
  }

  if (staleBaseline.length > 0) {
    console.log("Note: these baseline fingerprints no longer match anything (safe to remove from the baseline):")
    for (const fp of staleBaseline) console.log(`  ${fp}`)
  }

  console.log(`Product Surface Rule: ${files.length} files scanned, 0 new violations.`)
}

main()
