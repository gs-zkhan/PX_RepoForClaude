import fs from "node:fs"
import path from "node:path"

// Standalone Prism token validator. Deliberately does not import or invoke
// scripts/generate-prism-css.mjs — a successful CSS build is not proof of a
// valid token set (it only proves the specific references it happened to
// touch resolved). This script re-derives source/reference relationships
// directly from the token JSON files so it can check things the generator
// never looks at: count floors, alias-metadata agreement, effective-value
// drift, and every collision regardless of whether anything exercises it.
//
// Light and dark are validated as two separate reference-resolution
// contexts, mirroring how the generator builds them: a dark token's bare or
// qualified reference resolves only against the dark sources (P_Dark,
// S_Dark), never against the light ones, and vice versa. Component,
// Typography, and Effects have no dark variant, so they exist in the light
// context only — this is not "dark mode as a separate design system", it's
// the same p/s/c/t/e source concept with light and dark supplying different
// Primitive/Semantic values.

const root = process.cwd()

const lightSourceDefs = [
  { prefix: "p", label: "Primitive (Light)", file: "tokens/P_Light_Default.tokens.json", floor: 154 },
  { prefix: "s", label: "Semantic (Light)", file: "tokens/S_Light.tokens.json", floor: 136 },
  { prefix: "c", label: "Component", file: "tokens/C_Default.tokens.json", floor: 668 },
  { prefix: "t", label: "Typography", file: "tokens/T_Typography.styles.json", floor: 38 },
  { prefix: "e", label: "Effects", file: "tokens/E_Effects.styles.json", floor: 20 },
]

// Dark floors reuse the same 90%-of-baseline reasoning as light. Baseline
// dark counts are currently identical to their light counterparts (172
// Primitive, 152 Semantic), so the floors are identical too.
const darkSourceDefs = [
  { prefix: "p", label: "Primitive (Dark)", file: "tokens/P_Dark.tokens.json", floor: 154 },
  { prefix: "s", label: "Semantic (Dark)", file: "tokens/S_Dark.tokens.json", floor: 136 },
]
// Floors are 90% of the current baseline count, rounded down. 90% is a
// deliberate compromise: a legitimate content change (adding or removing a
// handful of tokens) never crosses it, but a truncated or partially-failed
// Figma export — which tends to drop a whole page, section, or mode at once
// — almost always does.

const SET_NAME_TO_PREFIX = {
  "⛔ Primitives — Do not use directly": "p",
  "✅ Semantic — Use these": "s",
}

const errors = []
const warnings = []
const notes = []

function fail(message) {
  errors.push(message)
}

function warn(message) {
  warnings.push(message)
}

function note(message) {
  notes.push(message)
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

function valuesEqual(a, b, type) {
  if (type === "color") {
    if (!a || !b) return false
    return a.hex === b.hex && (a.alpha ?? 1) === (b.alpha ?? 1)
  }
  if (type === "number") return a === b
  return JSON.stringify(a) === JSON.stringify(b)
}

const qualifiedRefPattern = /^([a-z])\.(.+)$/

// Builds a self-contained validation context for one mode (light or dark):
// loads + flattens each source, builds a collision-aware flat path index for
// bare references, validates every qualified/bare reference it finds, and
// records single-hop edges for cycle detection / effective-value resolution.
// Errors and warnings are pushed into the shared arrays, tagged with the
// mode so the report stays legible.
function buildAndValidateContext(sourceDefs, modeLabel) {
  const missingFiles = sourceDefs.filter((s) => !fs.existsSync(path.join(root, s.file)))

  if (missingFiles.length > 0) {
    for (const s of missingFiles) fail(`[${modeLabel}] Missing required token file: ${s.file}`)
    return null
  }

  const loaded = sourceDefs.map((s) => {
    const json = JSON.parse(fs.readFileSync(path.join(root, s.file), "utf8"))
    return { ...s, tokens: flattenTokens(json) }
  })
  const byPrefix = new Map(loaded.map((s) => [s.prefix, s]))

  const counts = {}
  for (const s of loaded) {
    const count = Object.keys(s.tokens).length
    counts[s.prefix] = count
    if (count < s.floor) {
      fail(`[${modeLabel}] ${s.label} token count (${count}) is below the minimum floor (${s.floor}) — export looks truncated`)
    }
  }

  const pathIndex = new Map() // path -> [{prefix, label}]
  for (const s of loaded) {
    for (const tokenPath of Object.keys(s.tokens)) {
      const entry = { prefix: s.prefix, label: s.label }
      if (!pathIndex.has(tokenPath)) pathIndex.set(tokenPath, [])
      pathIndex.get(tokenPath).push(entry)
    }
  }

  const collisions = [...pathIndex.entries()].filter(([, candidates]) => candidates.length > 1)

  const edges = new Map() // "prefix:path" -> "prefix:path"
  let qualifiedCount = 0
  let bareCount = 0
  const bareAmbiguousHits = new Set()

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
          fail(`[${modeLabel}] ${nodeKey}: unknown source prefix "${refPrefix}" in qualified reference "${value}"`)
          continue
        }

        if (!targetSource.tokens[remainder]) {
          fail(`[${modeLabel}] ${nodeKey}: qualified reference "${value}" — "${remainder}" does not exist in ${targetSource.label}`)
          continue
        }

        edges.set(nodeKey, `${refPrefix}:${remainder}`)
        continue
      }

      // Bare reference — resolved only within this mode's own path index, so
      // a dark bare reference can never accidentally resolve against light.
      bareCount++
      const candidates = pathIndex.get(reference[1])

      if (!candidates) {
        fail(`[${modeLabel}] ${nodeKey}: unresolved bare reference "${value}"`)
        continue
      }

      if (candidates.length > 1) {
        bareAmbiguousHits.add(reference[1])
        fail(
          `[${modeLabel}] ${nodeKey}: ambiguous bare reference "${value}" — "${reference[1]}" exists in ` +
            `${candidates.length} sources (${candidates.map((c) => c.label).join(", ")}). ` +
            `Use a qualified reference such as ${candidates.map((c) => `"{${c.prefix}.${reference[1]}}"`).join(" or ")}.`,
        )
        continue
      }

      edges.set(nodeKey, `${candidates[0].prefix}:${reference[1]}`)
    }
  }

  // Cycle detection
  const cycles = []
  const reportedCycleNodes = new Set()

  function findCycleFrom(startNode) {
    const chain = [startNode]
    const seen = new Set([startNode])
    let current = startNode

    for (let depth = 0; depth < edges.size + 1; depth++) {
      const next = edges.get(current)
      if (next === undefined) return null

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

  for (const startNode of edges.keys()) {
    if (reportedCycleNodes.has(startNode)) continue

    const cycle = findCycleFrom(startNode)
    if (cycle) {
      const signature = [...new Set(cycle)].sort().join(",")
      if (!cycles.some((c) => c.signature === signature)) {
        cycles.push({ signature, chain: cycle })
        for (const node of cycle) reportedCycleNodes.add(node)
        fail(`[${modeLabel}] Cycle detected: ${cycle.join(" -> ")}`)
      }
    }
  }

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

  // Effective-value resolvability for every token in this mode — every
  // reference (qualified or bare) must eventually terminate in a literal.
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
        fail(`[${modeLabel}] ${nodeKey}: reference chain does not terminate in a literal value (${resolved.error})`)
      }
    }
  }

  // Collision classification: a collision is only an error if a live bare
  // reference actually depends on it; otherwise it's a dormant warning.
  const collisionErrorPaths = new Set()
  for (const [tokenPath, candidates] of collisions) {
    if (bareAmbiguousHits.has(tokenPath)) {
      collisionErrorPaths.add(tokenPath)
    } else {
      warn(`[${modeLabel}] "${tokenPath}" -> ${candidates.map((c) => c.label).join(", ")} (dormant — no bare reference relies on it)`)
    }
  }

  return {
    modeLabel,
    loaded,
    byPrefix,
    counts,
    collisions,
    collisionErrorPaths,
    edges,
    qualifiedCount,
    bareCount,
    cycles,
    totalUnresolvedChains,
    resolveEffectiveValue,
  }
}

const lightContext = buildAndValidateContext(lightSourceDefs, "light")
const darkContext = buildAndValidateContext(darkSourceDefs, "dark")

if (!lightContext || !darkContext) {
  printReportAndExit()
}

// --- F + G. Alias agreement and effective-value drift (component only) ----
// Component tokens have no dark variant — they're validated once, against
// the light context, exactly as before dark mode existed.

let aliasMatchCount = 0
let aliasMismatchCount = 0
let knownAliasWarningCount = 0
let driftCount = 0

const componentSource = lightContext.byPrefix.get("c")

for (const [tokenPath, tok] of Object.entries(componentSource.tokens)) {
  const nodeKey = `c:${tokenPath}`
  const alias = tok.$extensions && tok.$extensions["com.figma.aliasData"]

  if (!alias) continue // no Figma alias metadata — nothing to agree/disagree with

  const expectedPrefix = SET_NAME_TO_PREFIX[alias.targetVariableSetName]

  if (!expectedPrefix) {
    warn(`${nodeKey}: alias target collection "${alias.targetVariableSetName}" is neither Primitive nor Semantic — cannot verify`)
    continue
  }

  const expectedSource = lightContext.byPrefix.get(expectedPrefix)
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

  const expectedTargetKey = `${expectedPrefix}:${expectedKey}`
  const componentResolved = lightContext.resolveEffectiveValue(nodeKey)
  const targetResolved = lightContext.resolveEffectiveValue(expectedTargetKey)

  if (componentResolved.error || targetResolved.error) {
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

// --- Light/dark token-name parity (Primitive + Semantic only) --------------

let parityDifferenceCount = 0
let refLiteralAsymmetryCount = 0

for (const prefix of ["p", "s"]) {
  const light = lightContext.byPrefix.get(prefix)
  const dark = darkContext.byPrefix.get(prefix)
  const lightKeys = new Set(Object.keys(light.tokens))
  const darkKeys = new Set(Object.keys(dark.tokens))

  const onlyLight = [...lightKeys].filter((k) => !darkKeys.has(k))
  const onlyDark = [...darkKeys].filter((k) => !lightKeys.has(k))

  if (onlyLight.length > 0) {
    parityDifferenceCount += onlyLight.length
    fail(`${light.label}/${dark.label}: ${onlyLight.length} token(s) exist in light but not dark: ${onlyLight.join(", ")}`)
  }
  if (onlyDark.length > 0) {
    parityDifferenceCount += onlyDark.length
    fail(`${light.label}/${dark.label}: ${onlyDark.length} token(s) exist in dark but not light: ${onlyDark.join(", ")}`)
  }

  // A token expressed as a reference in one mode and a literal in the other
  // is a legitimate design choice (dark can hardcode a value light aliases,
  // or vice versa) — reported for visibility, not a failure.
  for (const k of lightKeys) {
    if (!darkKeys.has(k)) continue
    const lightIsRef = typeof light.tokens[k].$value === "string" && /^\{.+\}$/.test(light.tokens[k].$value)
    const darkIsRef = typeof dark.tokens[k].$value === "string" && /^\{.+\}$/.test(dark.tokens[k].$value)
    if (lightIsRef !== darkIsRef) {
      refLiteralAsymmetryCount++
      note(`${prefix}:${k} is a ${lightIsRef ? "reference" : "literal"} in light but a ${darkIsRef ? "reference" : "literal"} in dark (legitimate per-mode difference)`)
    }
  }
}

// --- I. Output ---------------------------------------------------------------

function printReportAndExit() {
  const lines = []

  lines.push("Prism token validation")
  lines.push("")

  lines.push("Light:")
  for (const s of lightContext?.loaded ?? lightSourceDefs) {
    const count = lightContext?.counts?.[s.prefix]
    const countText = count === undefined ? "unavailable" : `${count} (floor ${s.floor})`
    lines.push(`  ${s.label.padEnd(16)} ${countText}`)
  }

  lines.push("")
  lines.push("Dark:")
  for (const s of darkContext?.loaded ?? darkSourceDefs) {
    const count = darkContext?.counts?.[s.prefix]
    const countText = count === undefined ? "unavailable" : `${count} (floor ${s.floor})`
    lines.push(`  ${s.label.padEnd(16)} ${countText}`)
  }

  lines.push("")
  lines.push(`Qualified references (light/dark):   ${lightContext?.qualifiedCount ?? 0} / ${darkContext?.qualifiedCount ?? 0}`)
  lines.push(`Bare references (light/dark):        ${lightContext?.bareCount ?? 0} / ${darkContext?.bareCount ?? 0}`)
  lines.push(
    `Cross-source collisions (light/dark): ${lightContext?.collisions.length ?? 0} ` +
      `(${lightContext?.collisionErrorPaths.size ?? 0} ambiguous) / ${darkContext?.collisions.length ?? 0} ` +
      `(${darkContext?.collisionErrorPaths.size ?? 0} ambiguous)`,
  )
  lines.push(`Alias metadata matches:               ${aliasMatchCount}`)
  lines.push(`Alias metadata mismatches:            ${aliasMismatchCount}`)
  lines.push(`Known alias warnings:                 ${knownAliasWarningCount}`)
  lines.push(`Effective-value drift:                ${driftCount}`)
  lines.push(`Unresolved chains (light/dark):        ${lightContext?.totalUnresolvedChains ?? 0} / ${darkContext?.totalUnresolvedChains ?? 0}`)
  lines.push(`Cycles (light/dark):                   ${lightContext?.cycles.length ?? 0} / ${darkContext?.cycles.length ?? 0}`)
  lines.push(`Light/dark token-name parity diffs:    ${parityDifferenceCount}`)
  lines.push(`Light/dark reference-vs-literal notes: ${refLiteralAsymmetryCount}`)
  lines.push("")

  if (warnings.length > 0) {
    lines.push("Known warnings:")
    for (const w of warnings) lines.push(`  - ${w}`)
    lines.push("")
  }

  if (notes.length > 0) {
    lines.push("Notes:")
    for (const n of notes) lines.push(`  - ${n}`)
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
