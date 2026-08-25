import fs from "node:fs"
import path from "node:path"

// Standalone Prism token validator. Deliberately does not import or invoke
// scripts/generate-prism-css.mjs — a successful CSS build is not proof of a
// valid token set (it only proves the specific references it happened to
// touch resolved). This script re-derives source/reference relationships
// directly from the token JSON files so it can check things the generator
// never looks at: count floors, alias-metadata agreement, effective-value
// drift, and every collision regardless of whether anything exercises it.

const root = process.cwd()

const sources = [
  { prefix: "p", label: "Primitive", file: "tokens/P_Light_Default.tokens.json", floor: 154 },
  { prefix: "s", label: "Semantic", file: "tokens/S_Light.tokens.json", floor: 136 },
  { prefix: "c", label: "Component", file: "tokens/C_Default.tokens.json", floor: 668 },
  { prefix: "t", label: "Typography", file: "tokens/T_Typography.styles.json", floor: 38 },
  { prefix: "e", label: "Effects", file: "tokens/E_Effects.styles.json", floor: 20 },
]
// Floors are 90% of the current baseline count (172/152/743/43/23), rounded
// down. 90% is a deliberate compromise: a legitimate content change (adding
// or removing a handful of tokens) never crosses it, but a truncated or
// partially-failed Figma export — which tends to drop a whole page, section,
// or mode at once — almost always does.

const SET_NAME_TO_PREFIX = {
  "⛔ Primitives — Do not use directly": "p",
  "✅ Semantic — Use these": "s",
}

const errors = []
const warnings = []

function fail(message) {
  errors.push(message)
}

function warn(message) {
  warnings.push(message)
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

// --- A. File availability -------------------------------------------------

const missingFiles = sources.filter((s) => !fs.existsSync(path.join(root, s.file)))

if (missingFiles.length > 0) {
  for (const s of missingFiles) fail(`Missing required token file: ${s.file}`)
  printReportAndExit()
}

const loaded = sources.map((s) => {
  const json = JSON.parse(fs.readFileSync(path.join(root, s.file), "utf8"))
  return { ...s, tokens: flattenTokens(json) }
})
const byPrefix = new Map(loaded.map((s) => [s.prefix, s]))

// --- B. Token counts + floors ----------------------------------------------

const counts = {}

for (const s of loaded) {
  const count = Object.keys(s.tokens).length
  counts[s.prefix] = count

  if (count < s.floor) {
    fail(`${s.label} token count (${count}) is below the minimum floor (${s.floor}) — export looks truncated`)
  }
}

// --- Global path index (for bare references + collision detection) --------

const pathIndex = new Map() // path -> [{prefix, label}]

for (const s of loaded) {
  for (const tokenPath of Object.keys(s.tokens)) {
    const entry = { prefix: s.prefix, label: s.label }
    if (!pathIndex.has(tokenPath)) pathIndex.set(tokenPath, [])
    pathIndex.get(tokenPath).push(entry)
  }
}

const collisions = [...pathIndex.entries()].filter(([, candidates]) => candidates.length > 1)

// --- C + D. Reference validation (qualified + bare) ------------------------
// Every valid single-hop reference is recorded as a graph edge, keyed by
// "prefix:path", for cycle detection (E) and effective-value resolution (G).

const qualifiedRefPattern = /^([a-z])\.(.+)$/
const edges = new Map() // "prefix:path" -> "prefix:path"

let qualifiedCount = 0
let bareCount = 0
const bareAmbiguousHits = new Set() // colliding paths actually exercised by a bare ref

for (const s of loaded) {
  for (const [tokenPath, tok] of Object.entries(s.tokens)) {
    const value = tok.$value
    if (typeof value !== "string") continue

    const reference = value.match(/^\{(.+)\}$/)
    if (!reference) continue

    const nodeKey = `${s.prefix}:${tokenPath}`
    const qualified = reference[1].match(qualifiedRefPattern)

    if (qualified) {
      const [, refPrefix, remainder] = qualified
      qualifiedCount++

      const targetSource = byPrefix.get(refPrefix)
      if (!targetSource) {
        fail(`${nodeKey}: unknown source prefix "${refPrefix}" in qualified reference "${value}"`)
        continue
      }

      if (!targetSource.tokens[remainder]) {
        fail(`${nodeKey}: qualified reference "${value}" — "${remainder}" does not exist in ${targetSource.label}`)
        continue
      }

      edges.set(nodeKey, `${refPrefix}:${remainder}`)
      continue
    }

    // Bare reference
    bareCount++
    const candidates = pathIndex.get(reference[1])

    if (!candidates) {
      fail(`${nodeKey}: unresolved bare reference "${value}"`)
      continue
    }

    if (candidates.length > 1) {
      bareAmbiguousHits.add(reference[1])
      fail(
        `${nodeKey}: ambiguous bare reference "${value}" — "${reference[1]}" exists in ` +
          `${candidates.length} sources (${candidates.map((c) => c.label).join(", ")}). ` +
          `Use a qualified reference such as ${candidates.map((c) => `"{${c.prefix}.${reference[1]}}"`).join(" or ")}.`,
      )
      continue
    }

    edges.set(nodeKey, `${candidates[0].prefix}:${reference[1]}`)
  }
}

// --- E. Cycle detection ------------------------------------------------------

const cycles = []

function findCycleFrom(startNode) {
  const chain = [startNode]
  const seen = new Set([startNode])
  let current = startNode

  for (let depth = 0; depth < edges.size + 1; depth++) {
    const next = edges.get(current)
    if (next === undefined) return null // terminates in a non-reference value

    if (seen.has(next)) {
      const cycleStart = chain.indexOf(next)
      return [...chain.slice(cycleStart), next]
    }

    chain.push(next)
    seen.add(next)
    current = next
  }

  return null
}

const reportedCycleNodes = new Set()

for (const startNode of edges.keys()) {
  if (reportedCycleNodes.has(startNode)) continue

  const cycle = findCycleFrom(startNode)
  if (cycle) {
    const signature = [...new Set(cycle)].sort().join(",")
    if (!cycles.some((c) => c.signature === signature)) {
      cycles.push({ signature, chain: cycle })
      for (const node of cycle) reportedCycleNodes.add(node)
      fail(`Cycle detected: ${cycle.join(" -> ")}`)
    }
  }
}

// --- Effective-value resolution (used by E's guard and by G) ---------------

function resolveEffectiveValue(nodeKey, depth = 0) {
  if (depth > edges.size + 1) return { error: "cycle" }

  const [prefix, tokenPath] = [nodeKey.slice(0, nodeKey.indexOf(":")), nodeKey.slice(nodeKey.indexOf(":") + 1)]
  const source = byPrefix.get(prefix)
  const token = source && source.tokens[tokenPath]

  if (!token) return { error: "missing-node" }

  if (typeof token.$value === "string" && /^\{(.+)\}$/.test(token.$value)) {
    const next = edges.get(nodeKey)
    if (next === undefined) return { error: "unresolved" }
    return resolveEffectiveValue(next, depth + 1)
  }

  return { value: token.$value, type: token.$type }
}

function valuesEqual(a, b, type) {
  if (type === "color") {
    if (!a || !b) return false
    return a.hex === b.hex && (a.alpha ?? 1) === (b.alpha ?? 1)
  }
  if (type === "number") return a === b
  return JSON.stringify(a) === JSON.stringify(b)
}

// --- F + G. Alias agreement and effective-value drift (component only) ----

let aliasMatchCount = 0
let aliasMismatchCount = 0
let knownAliasWarningCount = 0
let driftCount = 0
let unresolvedChainCount = 0

const componentSource = byPrefix.get("c")

for (const [tokenPath, tok] of Object.entries(componentSource.tokens)) {
  const nodeKey = `c:${tokenPath}`
  const alias = tok.$extensions && tok.$extensions["com.figma.aliasData"]

  if (!alias) continue // no Figma alias metadata — nothing to agree/disagree with

  const expectedPrefix = SET_NAME_TO_PREFIX[alias.targetVariableSetName]

  if (!expectedPrefix) {
    warn(`${nodeKey}: alias target collection "${alias.targetVariableSetName}" is neither Primitive nor Semantic — cannot verify`)
    continue
  }

  const expectedSource = byPrefix.get(expectedPrefix)
  const candidatePath = alias.targetVariableName.split("/").join(".")
  const expectedKey = expectedSource.tokens[candidatePath]
    ? candidatePath
    : expectedSource.tokens[`${candidatePath}.$root`]
      ? `${candidatePath}.$root`
      : null

  if (!expectedKey) {
    // Derived exception: the declared alias target genuinely does not exist
    // in the named source (e.g. color/focus/ring). Not fixable here, so it's
    // a known warning rather than a failure.
    knownAliasWarningCount++
    warn(`${nodeKey}: Figma alias target "${alias.targetVariableName}" not found in ${expectedSource.label} — token remains literal (known gap)`)
    continue
  }

  const expectedRef = `{${expectedPrefix}.${expectedKey}}`
  const actualValue = tok.$value

  if (actualValue === expectedRef) {
    aliasMatchCount++
  } else {
    aliasMismatchCount++
    fail(`${nodeKey}: $value is ${JSON.stringify(actualValue)} but Figma alias metadata expects "${expectedRef}"`)
    continue
  }

  // Effective-value drift: does the component token actually resolve to the
  // same literal as its declared Figma alias target?
  const expectedTargetKey = `${expectedPrefix}:${expectedKey}`
  const componentResolved = resolveEffectiveValue(nodeKey)
  const targetResolved = resolveEffectiveValue(expectedTargetKey)

  if (componentResolved.error || targetResolved.error) {
    unresolvedChainCount++
    fail(`${nodeKey}: could not resolve effective value (component: ${componentResolved.error ?? "ok"}, target: ${targetResolved.error ?? "ok"})`)
    continue
  }

  if (!valuesEqual(componentResolved.value, targetResolved.value, tok.$type)) {
    driftCount++
    fail(
      `${nodeKey}: effective-value drift — resolves to ${JSON.stringify(componentResolved.value)} ` +
        `but its declared Figma alias target resolves to ${JSON.stringify(targetResolved.value)}`,
    )
  }
}

// Effective-value resolvability for every token in every source, not just
// component aliases — every reference (qualified or bare) must eventually
// terminate in a literal.
let totalUnresolvedChains = 0

for (const s of loaded) {
  for (const tokenPath of Object.keys(s.tokens)) {
    const nodeKey = `${s.prefix}:${tokenPath}`
    const token = s.tokens[tokenPath]

    if (typeof token.$value !== "string" || !/^\{(.+)\}$/.test(token.$value)) continue
    if (!edges.has(nodeKey)) continue // already reported as missing/ambiguous/unknown-prefix above

    const resolved = resolveEffectiveValue(nodeKey)
    if (resolved.error) {
      totalUnresolvedChains++
      fail(`${nodeKey}: reference chain does not terminate in a literal value (${resolved.error})`)
    }
  }
}

// --- H. Collision classification -------------------------------------------

const collisionWarnings = []
const collisionErrorPaths = new Set()

for (const [tokenPath, candidates] of collisions) {
  if (bareAmbiguousHits.has(tokenPath)) {
    collisionErrorPaths.add(tokenPath)
  } else {
    collisionWarnings.push(`"${tokenPath}" -> ${candidates.map((c) => c.label).join(", ")} (dormant — no bare reference relies on it)`)
  }
}

for (const w of collisionWarnings) warn(w)

// --- I. Output ---------------------------------------------------------------

function printReportAndExit() {
  const lines = []

  lines.push("Prism token validation")
  lines.push("")

  for (const s of sources) {
    const count = counts[s.prefix]
    const countText = count === undefined ? "unavailable" : `${count} (floor ${s.floor})`
    lines.push(`${s.label.padEnd(12)} ${countText}`)
  }

  lines.push("")
  lines.push(`Qualified references:     ${qualifiedCount}`)
  lines.push(`Bare references:          ${bareCount}`)
  lines.push(`Cross-source collisions:  ${collisions.length} (${collisionErrorPaths.size} ambiguous, ${collisions.length - collisionErrorPaths.size} dormant)`)
  lines.push(`Alias metadata matches:   ${aliasMatchCount}`)
  lines.push(`Alias metadata mismatches: ${aliasMismatchCount}`)
  lines.push(`Known alias warnings:     ${knownAliasWarningCount}`)
  lines.push(`Effective-value drift:    ${driftCount}`)
  lines.push(`Unresolved chains:        ${totalUnresolvedChains}`)
  lines.push(`Cycles:                   ${cycles.length}`)
  lines.push("")

  if (warnings.length > 0) {
    lines.push("Known warnings:")
    for (const w of warnings) lines.push(`  - ${w}`)
    lines.push("")
  }

  if (errors.length > 0) {
    lines.push(`FAIL — ${errors.length} problem(s):`)
    for (const e of errors) lines.push(`  - ${e}`)
    console.log(lines.join("\n"))
    process.exit(1)
  }

  lines.push("PASS")
  console.log(lines.join("\n"))
  process.exit(0)
}

printReportAndExit()
