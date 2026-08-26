import fs from "node:fs"
import path from "node:path"

// Step 4B: compares a Figma Plugin API snapshot (produced by
// figma-plugin/code.js's "Export Prism snapshot" action) against the
// repo's current Primitive/Semantic/Component token sources, and — only
// with --apply — writes back the subset of changes that are deterministic
// and unambiguous.
//
// Never reads or writes anything over the network. Never mutates the
// snapshot file itself (read-only). In dry-run (the default), never writes
// any repo file either — it only reports.
//
// Usage:
//   node scripts/figma-snapshot-import.mjs [--snapshot=<path>] [--apply]
//
// --snapshot defaults to "prism-figma-snapshot.json" at the repo root.
// --apply switches from dry-run/report-only to write mode (see "APPLY
// MODE" below). Omitting it is always safe to run.

const root = process.cwd()

const args = process.argv.slice(2)
const applyMode = args.includes("--apply")
const snapshotArg = args.find((a) => a.startsWith("--snapshot="))
const snapshotPath = snapshotArg
  ? snapshotArg.slice("--snapshot=".length)
  : path.join(root, "prism-figma-snapshot.json")

// --- Identity strategy ------------------------------------------------------
//
// Every token in tokens/*.json carries $extensions["com.figma.variableId"],
// recorded at the time it was last extracted from Figma. This is the exact
// same identifier the Plugin API returns as a variable's own `id` — so it
// is the PRIMARY identity used here, not name matching. Verified against a
// real snapshot before writing this: repo "button.radius"'s
// com.figma.variableId ("VariableID:196:3") is exactly the Figma snapshot
// variable with id "VariableID:196:3" (name "button/radius").
//
// For alias targets, this script resolves what a repo token's $value
// currently points at (see parseValueReference/resolveReferenceTargetVariableId
// below) down to that target's own com.figma.variableId, and compares it
// directly against Figma's current alias.targetVariableId for the matching
// mode — both already in the same local-id form, so no key/id conversion
// is needed for the comparison itself.
//
// ($extensions["com.figma.aliasData"].targetVariableId, when present, is
// recorded in a different form — "VariableID:<key>/-1:-1", the variable's
// stable publish key rather than its local id. Verified against the real
// snapshot: the Primitive collection's own `key` field is exactly the hash
// seen in every Component alias's targetVariableSetId. That field is only
// used here as a diagnostic label, not for the core comparison — see the
// note below on why aliasData can't be relied on structurally.)
//
// Names are used only as a diagnostic label in reports — never to decide
// whether two things are "the same token".

// Whether/what a repo token's $value currently points at is determined
// from $value itself, not from $extensions["com.figma.aliasData"] — that
// metadata block turns out to only be reliably present on Component
// tokens. Semantic/Primitive tokens can be genuine aliases (their $value
// is a bare "{other.path}" reference) with no aliasData at all, confirmed
// against the real repo (e.g. S_Light's color.link.default). Deriving
// alias-ness from $value's shape works uniformly across all three layers.
const qualifiedRefPattern = /^([a-z])\.(.+)$/

function parseValueReference(value) {
  if (typeof value !== "string") return null
  const m = value.match(/^\{(.+)\}$/)
  if (!m) return null
  const qualified = m[1].match(qualifiedRefPattern)
  return qualified ? { prefix: qualified[1], remainder: qualified[2] } : { prefix: null, remainder: m[1] }
}

const PREFIX_TO_LAYER = { p: "primitive", s: "semantic", c: "component" }

// Resolves a parsed reference to the Figma variableId of the repo token it
// points to. Qualified references ("{p.path}", "{s.path}") always target
// the Light-mode source file for that layer, matching the generator's own
// convention (Dark is applied via CSS cascade, not a second qualified
// reference — a Primitive/Semantic variable's *identity* is the same
// across its modes regardless). Bare references are intra-file (verified:
// every bare reference in the repo resolves within its own source file).
function resolveReferenceTargetVariableId(reference, currentSource, allSources) {
  if (reference.prefix) {
    const targetLayer = PREFIX_TO_LAYER[reference.prefix]
    const targetSource = allSources.find(
      (s) => s.layer === targetLayer && (s.figmaModeName === "Default" || s.figmaModeName === "Light"),
    )
    if (!targetSource) return { variableId: null, reason: `Unknown qualifier prefix "${reference.prefix}"` }
    const targetToken = targetSource.tokens[reference.remainder]
    if (!targetToken) return { variableId: null, reason: `"${reference.remainder}" not found in ${targetSource.file}` }
    return { variableId: targetToken.$extensions?.["com.figma.variableId"] ?? null, reason: null }
  }

  const targetToken = currentSource.tokens[reference.remainder]
  if (!targetToken) return { variableId: null, reason: `"${reference.remainder}" not found in ${currentSource.file}` }
  return { variableId: targetToken.$extensions?.["com.figma.variableId"] ?? null, reason: null }
}

// --- Repo source config -----------------------------------------------------
// Primitive/Semantic have two files (light/dark), each holding one Figma
// mode's value of the *same* variable (verified: the same variableId
// appears in both P_Light_Default.tokens.json and P_Dark.tokens.json for a
// given token). Component has one file/one mode.

const REPO_SOURCES = [
  { file: "tokens/P_Light_Default.tokens.json", layer: "primitive", figmaModeName: "Default" },
  { file: "tokens/P_Dark.tokens.json", layer: "primitive", figmaModeName: "Dark" },
  { file: "tokens/S_Light.tokens.json", layer: "semantic", figmaModeName: "Light" },
  { file: "tokens/S_Dark.tokens.json", layer: "semantic", figmaModeName: "Dark" },
  { file: "tokens/C_Default.tokens.json", layer: "component", figmaModeName: "Default" },
]

function layerForCollectionName(name) {
  if (/primitive/i.test(name)) return "primitive"
  if (/semantic/i.test(name)) return "semantic"
  if (/component/i.test(name)) return "component"
  return "other"
}

function flattenTokens(node, currentPath = [], output = {}) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return output

  if (Object.prototype.hasOwnProperty.call(node, "$value") && currentPath.length > 0) {
    output[currentPath.join(".")] = node
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$") && key !== "$root") continue
    flattenTokens(value, [...currentPath, key], output)
  }

  return output
}

function literalsEqual(repoType, repoValue, figmaRawValue) {
  if (repoType === "color") {
    if (!repoValue || !figmaRawValue || !figmaRawValue.normalized) return false
    return (
      repoValue.hex === figmaRawValue.normalized.hex &&
      (repoValue.alpha ?? 1) === (figmaRawValue.normalized.alpha ?? 1)
    )
  }
  return repoValue === figmaRawValue
}

// Reconstructs a repo-shaped literal $value from a snapshot mode entry, for
// --apply. Never invents a value the snapshot didn't already provide.
function repoLiteralFromFigma(repoType, figmaRawValue) {
  if (repoType === "color") {
    const { raw, normalized } = figmaRawValue
    return {
      colorSpace: "srgb",
      components: [raw.r, raw.g, raw.b],
      alpha: raw.a,
      hex: normalized.hex,
    }
  }
  return figmaRawValue
}

// --- Load snapshot -----------------------------------------------------------

if (!fs.existsSync(snapshotPath)) {
  console.error(`Snapshot file not found: ${snapshotPath}`)
  console.error(`Pass --snapshot=/path/to/prism-figma-snapshot.json to point at it.`)
  process.exit(1)
}

let snapshot
try {
  snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"))
} catch (error) {
  console.error(`Failed to parse snapshot JSON: ${error.message}`)
  process.exit(1)
}

if (!Array.isArray(snapshot.variables) || !Array.isArray(snapshot.collections)) {
  console.error("Snapshot is missing required top-level 'variables'/'collections' arrays.")
  process.exit(1)
}

const snapshotVariablesById = new Map(snapshot.variables.map((v) => [v.id, v]))

// --- Load repo sources -------------------------------------------------------

const missingRepoFiles = REPO_SOURCES.filter((s) => !fs.existsSync(path.join(root, s.file)))
if (missingRepoFiles.length > 0) {
  for (const s of missingRepoFiles) console.error(`Missing required repo token file: ${s.file}`)
  process.exit(1)
}

const repoSources = REPO_SOURCES.map((source) => {
  const absolutePath = path.join(root, source.file)
  const json = JSON.parse(fs.readFileSync(absolutePath, "utf8"))
  return { ...source, json, tokens: flattenTokens(json) }
})

// --- Build comparison records ------------------------------------------------

const records = []
const referencedFigmaIds = new Set()
const seenIdentityPerFile = new Map() // file -> Map(variableId -> tokenPath), to catch repo-side duplicate identity

for (const source of repoSources) {
  const seen = new Map()
  seenIdentityPerFile.set(source.file, seen)

  for (const [tokenPath, token] of Object.entries(source.tokens)) {
    const variableId = token.$extensions?.["com.figma.variableId"] ?? null
    const aliasData = token.$extensions?.["com.figma.aliasData"] ?? null
    const reference = parseValueReference(token.$value)

    let repoAliasTargetVariableId = null
    let repoAliasResolutionError = null
    if (reference) {
      const resolved = resolveReferenceTargetVariableId(reference, source, repoSources)
      repoAliasTargetVariableId = resolved.variableId
      repoAliasResolutionError = resolved.reason
    }

    const record = {
      layer: source.layer,
      file: source.file,
      figmaModeName: source.figmaModeName,
      tokenPath,
      variableId,
      repoType: token.$type,
      repoValue: token.$value,
      repoIsAliasStructurally: !!reference,
      repoAliasTargetVariableId,
      // Diagnostic label only: prefer aliasData's recorded name (present
      // for Component tokens), else fall back to the resolved repo path.
      repoAliasTargetName: aliasData ? aliasData.targetVariableName : reference ? reference.remainder : null,
      category: null,
      detail: null,
    }

    if (reference && !repoAliasTargetVariableId) {
      record.category = "repoAliasUnresolvedLocally"
      record.detail = repoAliasResolutionError
      records.push(record)
      continue
    }

    if (!variableId) {
      record.category = "repoNoIdentity"
      records.push(record)
      continue
    }

    if (seen.has(variableId)) {
      record.category = "ambiguous"
      record.detail = `Duplicate com.figma.variableId within ${source.file}: also used by "${seen.get(variableId)}"`
      records.push(record)
      continue
    }
    seen.set(variableId, tokenPath)

    const figmaVariable = snapshotVariablesById.get(variableId)

    if (!figmaVariable) {
      record.category = "unmatchedRepo"
      records.push(record)
      continue
    }

    referencedFigmaIds.add(variableId)

    const figmaLayer = layerForCollectionName(figmaVariable.collectionName)
    if (figmaLayer !== source.layer) {
      record.category = "ambiguous"
      record.detail = `Expected layer "${source.layer}" but Figma variable now lives in "${figmaVariable.collectionName}"`
      record.figmaVariable = { id: figmaVariable.id, name: figmaVariable.name, collectionName: figmaVariable.collectionName }
      records.push(record)
      continue
    }

    const figmaModeEntry = figmaVariable.valuesByMode.find((m) => m.modeName === source.figmaModeName)
    if (!figmaModeEntry) {
      record.category = "modeMismatch"
      record.detail = `Figma variable has no "${source.figmaModeName}" mode (modes present: ${figmaVariable.valuesByMode.map((m) => m.modeName).join(", ")})`
      record.figmaVariable = { id: figmaVariable.id, name: figmaVariable.name, collectionName: figmaVariable.collectionName }
      records.push(record)
      continue
    }

    record.figmaVariable = {
      id: figmaVariable.id,
      key: figmaVariable.key,
      name: figmaVariable.name,
      collectionName: figmaVariable.collectionName,
    }
    record.figmaModeEntry = figmaModeEntry

    const figmaIsAlias = figmaModeEntry.isAlias
    const figmaAliasTargetVariableId = figmaModeEntry.alias?.targetVariableId ?? null

    if (record.repoIsAliasStructurally !== figmaIsAlias) {
      record.category = "changedAliasStructure"
      record.detail = record.repoIsAliasStructurally
        ? `Repo has this as an alias to "${record.repoAliasTargetName}"; Figma now has it as a literal value`
        : `Repo has this as a literal value; Figma now has it as an alias to "${figmaModeEntry.alias?.targetVariableName}"`
      records.push(record)
      continue
    }

    if (record.repoIsAliasStructurally && figmaIsAlias) {
      if (record.repoAliasTargetVariableId !== figmaAliasTargetVariableId) {
        record.category = "changedAliasTarget"
        record.detail = `Alias target changed: repo -> "${record.repoAliasTargetName}", Figma -> "${figmaModeEntry.alias?.targetVariableName}"`
      } else {
        record.category = "matched"
      }
      records.push(record)
      continue
    }

    // Both literal.
    const equal = literalsEqual(record.repoType, record.repoValue, figmaModeEntry.rawValue)
    record.category = equal ? "matched" : "changedLiteral"
    if (!equal) {
      record.detail = `Literal value changed`
    }
    records.push(record)
  }
}

const unmatchedFigmaVariables = snapshot.variables.filter((v) => {
  const layer = layerForCollectionName(v.collectionName)
  return (layer === "primitive" || layer === "semantic" || layer === "component") && !referencedFigmaIds.has(v.id)
})

// --- Report -------------------------------------------------------------------

function countBy(category) {
  return records.filter((r) => r.category === category).length
}

const summary = {
  totalFigmaVariables: snapshot.totalVariables,
  totalRepoRecords: records.length,
  matched: countBy("matched"),
  changedLiteral: countBy("changedLiteral"),
  changedAliasTarget: countBy("changedAliasTarget"),
  changedAliasStructure: countBy("changedAliasStructure"),
  unmatchedRepo: countBy("unmatchedRepo"),
  unmatchedFigma: unmatchedFigmaVariables.length,
  ambiguous: countBy("ambiguous"),
  modeMismatch: countBy("modeMismatch"),
  repoNoIdentity: countBy("repoNoIdentity"),
  repoAliasUnresolvedLocally: countBy("repoAliasUnresolvedLocally"),
}

console.log("Figma snapshot import — dry run report")
console.log("")
console.log(`Snapshot: ${snapshot.figmaFileName} (exported ${snapshot.exportedAt})`)
console.log(`Figma variables (Primitive+Semantic+Component): ${summary.totalFigmaVariables}`)
console.log(`Repo comparison records: ${summary.totalRepoRecords}`)
console.log("")
console.log(`Matched (no change):        ${summary.matched}`)
console.log(`Changed literal values:     ${summary.changedLiteral}`)
console.log(`Changed alias targets:      ${summary.changedAliasTarget}`)
console.log(`Changed literal<->alias:    ${summary.changedAliasStructure}`)
console.log(`Unmatched repo tokens:      ${summary.unmatchedRepo}`)
console.log(`Unmatched Figma variables:  ${summary.unmatchedFigma}`)
console.log(`Ambiguous:                  ${summary.ambiguous}`)
console.log(`Mode mismatches:            ${summary.modeMismatch}`)
console.log(`Repo tokens with no id:     ${summary.repoNoIdentity}`)
console.log(`Repo alias unresolvable:    ${summary.repoAliasUnresolvedLocally}`)
console.log("")

function printRecord(r) {
  console.log(`  [${r.layer}] ${r.file} :: ${r.tokenPath}`)
  if (r.detail) console.log(`    ${r.detail}`)
  if (r.figmaVariable) console.log(`    figma: ${r.figmaVariable.name} (${r.figmaVariable.id})`)
}

for (const category of ["changedLiteral", "changedAliasTarget", "changedAliasStructure", "ambiguous", "modeMismatch", "unmatchedRepo", "repoNoIdentity", "repoAliasUnresolvedLocally"]) {
  const matching = records.filter((r) => r.category === category)
  if (matching.length === 0) continue
  console.log(`--- ${category} (${matching.length}) ---`)
  for (const r of matching) printRecord(r)
  console.log("")
}

if (unmatchedFigmaVariables.length > 0) {
  console.log(`--- unmatchedFigma (${unmatchedFigmaVariables.length}) ---`)
  for (const v of unmatchedFigmaVariables) {
    console.log(`  ${v.name} (${v.id}) in ${v.collectionName}`)
  }
  console.log("")
}

// Controlled test token: always surfaced explicitly, regardless of the
// filters above, and never auto-corrected.
const controlledTestRecords = records.filter((r) => r.tokenPath === "color.royalBlue.700" || r.repoAliasTargetName === "color/royalBlue/700")
console.log("--- controlled test token: color/royalBlue/700 ---")
const primitiveTestRecords = records.filter(
  (r) => r.layer === "primitive" && r.figmaVariable?.name === "color/royalBlue/700",
)
if (primitiveTestRecords.length === 0) {
  console.log("  Not found among comparison records (unexpected).")
} else {
  for (const r of primitiveTestRecords) {
    console.log(`  [${r.figmaModeName}] repo=${JSON.stringify(r.repoValue?.hex)} figma=${JSON.stringify(r.figmaModeEntry?.rawValue?.normalized?.hex)} -> ${r.category}`)
  }
}
console.log("")

console.log(applyMode ? "Mode: APPLY" : "Mode: DRY RUN (no files written)")

// --- Apply mode ---------------------------------------------------------------
//
// Only ever applies to `changedLiteral` (deterministic: same identity, same
// structural kind, just a different literal) and `changedAliasTarget` where
// the NEW target itself maps unambiguously to an existing repo token path
// (so a qualified reference can be constructed the same way POC 1B did).
// Everything else — ambiguous, mode mismatches, unmatched, structural
// literal<->alias flips, or an alias retarget whose new target isn't a
// known repo token — is left untouched and reported as needing manual
// review. Aliases are never resolved to literals here.

if (applyMode) {
  // Reverse index: Figma variable id -> the repo (layer, tokenPath) that
  // represents it, used only to safely retarget an alias.
  const repoPathByFigmaId = new Map()
  for (const r of records) {
    if (r.figmaVariable) repoPathByFigmaId.set(r.figmaVariable.id, r)
  }

  const applied = []
  const skipped = []
  const fileEdits = new Map() // file -> parsed json (mutated in place)

  function getFileJson(file) {
    if (!fileEdits.has(file)) {
      const source = repoSources.find((s) => s.file === file)
      fileEdits.set(file, source.json)
    }
    return fileEdits.get(file)
  }

  function getTokenNode(json, tokenPath) {
    const parts = tokenPath.split(".")
    let node = json
    for (const part of parts) {
      node = node[part]
      if (!node) return null
    }
    return node
  }

  for (const r of records) {
    if (r.category === "changedLiteral") {
      const json = getFileJson(r.file)
      const node = getTokenNode(json, r.tokenPath)
      if (node) {
        node.$value = repoLiteralFromFigma(r.repoType, r.figmaModeEntry.rawValue)
        applied.push(r)
      }
      continue
    }

    if (r.category === "changedAliasTarget") {
      // The new alias target, by its Figma variableId — may be a remote/
      // library variable with no local repo representation at all.
      const targetVariableId = r.figmaModeEntry.alias?.targetVariableId ?? null
      const targetRecord = targetVariableId ? repoPathByFigmaId.get(targetVariableId) : null

      if (!targetRecord) {
        skipped.push({ ...r, reason: "New alias target does not map to a known repo token — refusing to guess" })
        continue
      }

      const prefix = targetRecord.layer === "primitive" ? "p" : targetRecord.layer === "semantic" ? "s" : "c"
      const json = getFileJson(r.file)
      const node = getTokenNode(json, r.tokenPath)
      if (node) {
        node.$value = `{${prefix}.${targetRecord.tokenPath}}`
        applied.push(r)
      }
      continue
    }

    if (r.category === "changedAliasStructure" || r.category === "ambiguous" || r.category === "modeMismatch") {
      skipped.push({ ...r, reason: "Requires manual review — not applied" })
    }
  }

  for (const [file, json] of fileEdits.entries()) {
    fs.writeFileSync(path.join(root, file), JSON.stringify(json, null, 2), "utf8")
  }

  console.log("")
  console.log(`Applied ${applied.length} change(s) across ${fileEdits.size} file(s).`)
  console.log(`Skipped ${skipped.length} change(s) that require manual review.`)
  for (const s of skipped) {
    console.log(`  SKIPPED [${s.layer}] ${s.file} :: ${s.tokenPath} — ${s.reason}`)
  }
}

// Exit non-zero only for genuine structural/import errors (handled via
// early process.exit(1) calls above for missing/unparseable files) — the
// presence of differences, ambiguity, or mismatches is expected dry-run
// output, not a script failure.
process.exit(0)
