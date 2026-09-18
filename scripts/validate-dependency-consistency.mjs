import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { loadRegistry } from "./validate-figma-coverage.mjs"

// -----------------------------------------------------------------------------
// Detects undeclared dependencies on restricted-status shared components —
// the class of gap found three times during the v1.1 hardening pass
// (component-popover via color-picker/notification/rte-field/dashboard-
// widget-chart-type-switcher, before decision-popover-scoped-composition;
// component-input via PxHeader's inline title-edit, before decision-input-
// scoped-composition; and direct screen-level DropdownMenu construction in
// user-explorer.tsx/engagements-list-example.tsx, before the
// TableRowActionsMenu/FilterCriterionMenu/StatusSelect refactor). Each of
// those was found by a one-off manual audit — this is the deterministic,
// automated version of that same audit, wired into CI so a future variant
// doesn't require a fourth manual pass to catch.
//
// Two coordinated checks:
//
//   1. checkApprovedDependencyConsistency — for every registry entry whose
//      status is Approved or Approved-with-documented-exception, scans its
//      own repoPaths' imports, resolves each imported shared-component file
//      back to the registry entry that owns it, and fails when that owner's
//      status is restricted (Implemented-unmapped / Legacy / Out of scope /
//      Missing / Figma correction required) AND its id is not present in the
//      consuming entry's own `dependencies` array. Declaring the dependency
//      is used as the deterministic, operational proxy for "covered by an
//      explicit scoped-composition decision" — by this repo's own
//      established convention (decision-dropdown-menu-scoped-composition,
//      decision-popover-scoped-composition, decision-input-scoped-
//      composition), writing one of these decisions has always been paired
//      with recording the dependency, never one without the other.
//
//      Deliberately NOT checked (to avoid noise, per the same repo
//      convention already visible in 20+ existing, harmless undeclared
//      dependencies on foundational primitives like PrismIcon/IconButton/
//      Button/Tabs/Tooltip): any dependency whose own status is NOT in the
//      restricted set. Mapped-review-pending, Approved, Approved-with-
//      documented-exception, and Internal foundation dependencies are all
//      directly or provisionally usable per the Component Eligibility
//      Policy — leaving them undeclared is harmless bookkeeping laxness,
//      not an eligibility contradiction, and is not this check's concern.
//
//      Also deliberately scoped to Approved/Approved-with-documented-
//      exception CONSUMERS only, matching the Component Eligibility
//      Policy's own framing ("an approved composed surface may internally
//      depend on...") — Mapped-review-pending components are themselves
//      still under review, so an undeclared restricted dependency inside
//      one is a lower-priority finding than inside something already
//      shipped as Approved. (component-status-select's own gap, found in
//      this same pass, was fixed manually rather than being enforced here,
//      for exactly this reason — see ai/figma-coverage.json.)
//
//   2. checkCanonicalScreenDropdownMenu — a small, separate, deterministic
//      check specific to the screen-level DropdownMenu contradiction: a
//      named list of canonical/reference page files (the ones CLAUDE.md's
//      "Canonical application references" section and ai/shell-registry.md's
//      "Example" column point a fresh Claude at) must never import
//      DropdownMenu/DropdownMenuTrigger/DropdownMenuContent directly — the
//      overlay-construction exports — even though these same files may
//      legitimately import DropdownMenuItem/DropdownMenuSeparator/
//      DropdownMenuLabel to pass as children into an already-sanctioned
//      wrapper (TableRowActionsMenu, FilterCriterionMenu, StatusSelect),
//      mirroring SplitButton's own menuContent-slot precedent. This isn't
//      derivable from registry status alone (these files aren't tracked as
//      Approved-tier registry entries), so it's a separate, explicit check
//      rather than a special case of #1.
// -----------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

const RESTRICTED_STATUSES = new Set([
  "Implemented-unmapped",
  "Legacy",
  "Out of scope",
  "Missing",
  "Figma correction required",
])

const CHECKED_CONSUMER_STATUSES = new Set(["Approved", "Approved-with-documented-exception"])

// Canonical/reference example files a fresh Claude is directed to study —
// CLAUDE.md's "Canonical application references" section and
// ai/shell-registry.md's "Example" column. Update this list when a new
// canonical example is added; it is intentionally explicit, not derived,
// since "canonical enough to teach the rule" is itself a documentation
// decision, not something inferable from registry status.
const CANONICAL_SCREEN_FILES = [
  "src/pages/user-explorer.tsx",
  "src/pages/engagements-list-example.tsx",
  "src/pages/detail-drilldown-shell-example.tsx",
  "src/pages/create-edit-shell-example.tsx",
]

const DROPDOWN_MENU_OVERLAY_EXPORTS = new Set(["DropdownMenu", "DropdownMenuTrigger", "DropdownMenuContent"])

const IMPORT_PATTERN = /from\s+["'](@\/(?:components\/ui|patterns|components)\/[^"']+)["']/g

function resolveImportToPath(importPath, root) {
  const rel = importPath.replace(/^@\//, "src/")
  const candidates = [`${rel}.tsx`, `${rel}.ts`, `${rel}/index.tsx`, `${rel}/index.ts`]
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(root, candidate))) return candidate
  }
  return null
}

export function buildPathToIdMap(registry) {
  const map = new Map()
  for (const entry of registry.entries) {
    for (const repoPath of entry.repoPaths ?? []) {
      map.set(repoPath, entry.id)
    }
  }
  return map
}

export function checkApprovedDependencyConsistency(registry, root = rootDir) {
  const errors = []
  const byId = new Map(registry.entries.map((e) => [e.id, e]))
  const pathToId = buildPathToIdMap(registry)

  for (const entry of registry.entries) {
    if (!CHECKED_CONSUMER_STATUSES.has(entry.status)) continue

    const declaredDeps = new Set(entry.dependencies ?? [])
    const flaggedForThisEntry = new Set()

    for (const repoPath of entry.repoPaths ?? []) {
      const abs = path.join(root, repoPath)
      if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) continue

      const text = fs.readFileSync(abs, "utf8")
      for (const match of text.matchAll(IMPORT_PATTERN)) {
        const importPath = match[1]
        const resolved = resolveImportToPath(importPath, root)
        if (!resolved) continue

        const ownerId = pathToId.get(resolved)
        if (!ownerId || ownerId === entry.id) continue

        const owner = byId.get(ownerId)
        if (!owner || !RESTRICTED_STATUSES.has(owner.status)) continue

        if (!declaredDeps.has(ownerId) && !flaggedForThisEntry.has(ownerId)) {
          flaggedForThisEntry.add(ownerId)
          errors.push(
            `${entry.id} (${entry.status}) imports ${ownerId} (${owner.status}) via ${repoPath} but does not declare it in its own dependencies[] — add "${ownerId}" to ${entry.id}.dependencies, or write/extend a scoped-composition decision covering this exact usage.`,
          )
        }
      }
    }
  }

  return { errors }
}

/**
 * Pure, fs-free — accepts file contents directly so tests can supply
 * fixtures without touching disk. `main()` below wires this to the real
 * files on disk for the real CI/CLI run.
 */
export function checkCanonicalScreenDropdownMenu(fileContentsByPath) {
  const errors = []
  for (const [filePath, text] of Object.entries(fileContentsByPath)) {
    const importBlockMatch = text.match(/import\s*\{([^}]*)\}\s*from\s*["']@\/components\/ui\/dropdown-menu["']/)
    if (!importBlockMatch) continue

    const importedNames = importBlockMatch[1]
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)

    const overlayImports = importedNames.filter((n) => DROPDOWN_MENU_OVERLAY_EXPORTS.has(n))
    if (overlayImports.length > 0) {
      errors.push(
        `${filePath} imports ${overlayImports.join(", ")} directly from @/components/ui/dropdown-menu — this canonical/reference file may not construct the DropdownMenu overlay itself. Compose an already-sanctioned wrapper (TableRowActionsMenu, FilterCriterionMenu, StatusSelect, or a new one added to decision-dropdown-menu-scoped-composition) instead; DropdownMenuItem/DropdownMenuSeparator/DropdownMenuLabel may still be imported to pass as that wrapper's children.`,
      )
    }
  }
  return { errors }
}

function readCanonicalScreenFiles(root) {
  const contents = {}
  for (const relPath of CANONICAL_SCREEN_FILES) {
    const abs = path.join(root, relPath)
    if (fs.existsSync(abs)) contents[relPath] = fs.readFileSync(abs, "utf8")
  }
  return contents
}

export function validateDependencyConsistency(registry, root = rootDir) {
  const approvedResult = checkApprovedDependencyConsistency(registry, root)
  const canonicalResult = checkCanonicalScreenDropdownMenu(readCanonicalScreenFiles(root))
  return { errors: [...approvedResult.errors, ...canonicalResult.errors] }
}

function main() {
  const registry = loadRegistry(rootDir)
  const { errors } = validateDependencyConsistency(registry)

  for (const e of errors) console.error(`ERROR: ${e}`)

  console.log(`\nDependency consistency: ${registry.entries.length} entries checked, ${CANONICAL_SCREEN_FILES.length} canonical screens checked, ${errors.length} errors.`)

  if (errors.length > 0) {
    process.exitCode = 1
  }
}

if (path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1] ?? "")) {
  main()
}
