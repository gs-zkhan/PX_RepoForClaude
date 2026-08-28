import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { pathToFileURL } from "node:url"

import { buildGeneratedCss } from "./generate-prism-css.mjs"

// -----------------------------------------------------------------------------
// Alias-regression detector.
//
// scripts/validate-prism-tokens.mjs already finds two categories of
// pre-existing alias debt (dormant cross-source collisions, and Component
// tokens whose Figma alias target doesn't exist in Semantic) but treats
// them as permanent, unconditional warnings — there is no way for it to
// tell "this debt already existed" apart from "this debt was just
// introduced by this change". This script adds that distinction, plus two
// categories validate-prism-tokens.mjs doesn't look at at all:
//
//   - Semantic-to-primitive description drift: Semantic colour tokens are
//     exported from Figma as baked literals with a *prose* provenance note
//     ("Aliases color/royalBlue/700") rather than a live {p....} reference
//     (verified: every Semantic colour token in S_Light/S_Dark is a
//     literal). Nothing currently checks that the baked literal still
//     matches the primitive its own description says it aliases — this is
//     exactly the mechanism that would silently decouple a semantic token
//     from a primitive fix (see ai/token-guardrails.md, root cause #5).
//   - Emitted-but-unused primitives: a primitive can be correctly present
//     in generated CSS with zero var() consumers (color.royalBlue.700 was
//     found in this state) — reported separately from broken aliases,
//     never as a failure, since "unused" is not itself wrong.
//
// Baseline model: tokens/alias-debt-baseline.json lists every debt
// fingerprint already known to exist. A fingerprint present now but absent
// from the baseline is newly introduced debt and fails the check. A
// baseline fingerprint no longer present just means that debt was fixed —
// not a failure. Nothing here requires fixing pre-existing debt.
// -----------------------------------------------------------------------------

function runValidateTokens(rootDir) {
  const scriptPath = path.join(rootDir, "scripts/validate-prism-tokens.mjs")
  const result = spawnSync(process.execPath, [scriptPath], { cwd: rootDir, encoding: "utf8" })
  return { status: result.status, stdout: result.stdout ?? "", stderr: result.stderr ?? "" }
}

// Extracts the "Known warnings:" block (dormant collisions + Component
// alias-target-not-found gaps) as a flat list of trimmed fingerprint
// strings — the exact same lines a human reviewer sees printed by
// validate-prism-tokens.mjs itself.
function extractKnownWarningFingerprints(stdout) {
  const match = stdout.match(/Known warnings:\n([\s\S]*?)\n\n/)
  if (!match) return []
  return match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean)
}

// Any line under "FAIL — N problem(s):" is a hard validator error, not
// pre-existing debt by definition (validate-prism-tokens.mjs currently
// passes clean) — surfaced as its own, always-new category so a future
// regression there is never silently absorbed into the debt baseline.
function extractHardErrors(stdout) {
  const match = stdout.match(/FAIL — \d+ problem\(s\):\n([\s\S]*)$/)
  if (!match) return []
  return match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean)
}

function loadJson(absPath) {
  return JSON.parse(fs.readFileSync(absPath, "utf8"))
}

function flattenColorTokens(node, currentPath = [], out = {}) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return out
  if (Object.prototype.hasOwnProperty.call(node, "$value") && node.$value && typeof node.$value === "object" && node.$value.hex) {
    out[currentPath.join(".")] = node
  }
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$") && key !== "$root") continue
    flattenColorTokens(value, [...currentPath, key], out)
  }
  return out
}

// "Aliases color/royalBlue/700 (Light), color/royalBlue/600 (Dark)." ->
// [{ ref: "royalBlue/700", mode: "Light" }, { ref: "royalBlue/600", mode: "Dark" }]
// A bare "Aliases color/neutral/0." with no mode qualifier applies to both.
function parseAliasClaims(description) {
  if (typeof description !== "string") return []
  const match = description.match(/Aliases ([^.]+)\./)
  if (!match) return []

  const claims = []
  for (const part of match[1].split(",")) {
    const trimmed = part.trim()
    const withMode = trimmed.match(/^color\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\s*\((Light|Dark)\)$/)
    const bare = trimmed.match(/^color\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)$/)
    if (withMode) {
      claims.push({ group: withMode[1], key: withMode[2], mode: withMode[3] })
    } else if (bare) {
      claims.push({ group: bare[1], key: bare[2], mode: null })
    }
  }
  return claims
}

// Semantic-to-primitive description drift: for every Semantic colour token
// whose $description makes an "Aliases color/X/Y" claim, resolve X/Y
// against the matching-mode Primitive file and compare hex values.
function checkSemanticPrimitiveDrift(rootDir) {
  const files = [
    { semanticFile: "tokens/S_Light.tokens.json", primitiveFile: "tokens/P_Light_Default.tokens.json", mode: "Light" },
    { semanticFile: "tokens/S_Dark.tokens.json", primitiveFile: "tokens/P_Dark.tokens.json", mode: "Dark" },
  ]

  const findings = []

  for (const { semanticFile, primitiveFile, mode } of files) {
    const semanticAbs = path.join(rootDir, semanticFile)
    const primitiveAbs = path.join(rootDir, primitiveFile)
    if (!fs.existsSync(semanticAbs) || !fs.existsSync(primitiveAbs)) continue

    const semanticTokens = flattenColorTokens(loadJson(semanticAbs))
    const primitiveJson = loadJson(primitiveAbs)

    for (const [tokenPath, tok] of Object.entries(semanticTokens)) {
      const claims = parseAliasClaims(tok.$description).filter((c) => c.mode === null || c.mode === mode)
      if (claims.length === 0) continue

      // A token's description can list Light-only and Dark-only claims
      // together ("Aliases X (Light), Y (Dark)") — only the claim for
      // THIS file's own mode is checked against THIS file's own value.
      const claim = claims[0]
      const primitiveNode = primitiveJson?.color?.[claim.group]?.[claim.key]
      const primitiveHex = primitiveNode?.$value?.hex

      if (!primitiveHex) {
        findings.push({
          fingerprint: `semantic-drift:${semanticFile}:${tokenPath}:unresolvable`,
          status: "info",
          message: `${semanticFile} :: ${tokenPath} — description claims to alias "color/${claim.group}/${claim.key}" (${mode}), which does not exist in ${primitiveFile} (known gap, e.g. color/focus/ring).`,
        })
        continue
      }

      if (tok.$value.hex.toUpperCase() !== primitiveHex.toUpperCase()) {
        findings.push({
          fingerprint: `semantic-drift:${semanticFile}:${tokenPath}`,
          status: "fail",
          message: `${semanticFile} :: ${tokenPath} (${tok.$value.hex}) has drifted from color.${claim.group}.${claim.key} in ${primitiveFile} (${primitiveHex}), which its own description claims to alias.`,
        })
      }
    }
  }

  return findings
}

// Emitted-but-unused primitives: a --p-* variable defined at :root with no
// var(--p-...) consumer anywhere else in the generated CSS. Never a
// failure — reported for visibility only, separately from broken aliases.
function checkEmittedButUnusedPrimitives(rootDir) {
  const { css } = buildGeneratedCss(rootDir)
  const rootBlockMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/)
  const rootBlock = rootBlockMatch ? rootBlockMatch[1] : ""

  const definitions = [...rootBlock.matchAll(/^\s*(--p-[a-z0-9-]+):/gm)].map((m) => m[1])
  const unused = []

  for (const varName of definitions) {
    const escaped = varName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const consumerPattern = new RegExp(`var\\(${escaped}\\)`, "g")
    const consumerCount = (css.match(consumerPattern) ?? []).length
    if (consumerCount === 0) unused.push(varName)
  }

  return unused
}

// Pure: given "what alias-debt fingerprints exist right now" and "what the
// checked-in baseline already knows about", decides which are new
// (blocking), which are pre-existing (informational), and which baselined
// entries no longer reproduce (also informational — debt was fixed).
// Extracted specifically so this decision can be tested directly, without
// needing a full, floor-satisfying token corpus to exercise it.
function diffAgainstBaseline(candidateFingerprints, baselineFingerprints) {
  const baselineSet = new Set(baselineFingerprints)
  return {
    newDebt: candidateFingerprints.filter((fp) => !baselineSet.has(fp)),
    resolvedDebt: baselineFingerprints.filter((fp) => !candidateFingerprints.includes(fp)),
    existingDebt: candidateFingerprints.filter((fp) => baselineSet.has(fp)),
  }
}

function runAliasDebtChecks(rootDir) {
  const baselinePath = path.join(rootDir, "tokens/alias-debt-baseline.json")
  const baseline = fs.existsSync(baselinePath) ? loadJson(baselinePath) : { fingerprints: [] }

  const validateResult = runValidateTokens(rootDir)
  const knownWarningFingerprints = extractKnownWarningFingerprints(validateResult.stdout)
  const hardErrors = extractHardErrors(validateResult.stdout)
  const semanticDrift = checkSemanticPrimitiveDrift(rootDir)
  const unusedPrimitives = checkEmittedButUnusedPrimitives(rootDir)

  const candidateFingerprints = [
    ...knownWarningFingerprints,
    ...semanticDrift.filter((f) => f.status === "fail").map((f) => f.fingerprint),
  ]

  const { newDebt, resolvedDebt, existingDebt } = diffAgainstBaseline(candidateFingerprints, baseline.fingerprints)

  const ok = validateResult.status === 0 && hardErrors.length === 0 && newDebt.length === 0

  return {
    ok,
    validatorExitCode: validateResult.status,
    hardErrors,
    existingDebt,
    newDebt,
    resolvedDebt,
    semanticDriftInfo: semanticDrift.filter((f) => f.status === "info"),
    unusedPrimitives,
  }
}

function formatReport(result) {
  const lines = []
  lines.push("Alias-regression detection")
  lines.push("")
  lines.push(`validate-prism-tokens.mjs exit code: ${result.validatorExitCode}`)

  if (result.hardErrors.length > 0) {
    lines.push(`Hard validator errors (${result.hardErrors.length}) — always a failure, never baselined:`)
    for (const e of result.hardErrors) lines.push(`  FAIL  ${e}`)
  }

  lines.push("")
  lines.push(`Existing, baselined alias debt (${result.existingDebt.length}) — not blocking:`)
  for (const fp of result.existingDebt) lines.push(`  KNOWN  ${fp}`)

  lines.push("")
  lines.push(`Newly introduced alias debt (${result.newDebt.length}):`)
  for (const fp of result.newDebt) lines.push(`  FAIL  ${fp}`)

  if (result.resolvedDebt.length > 0) {
    lines.push("")
    lines.push(`Baselined debt no longer present (${result.resolvedDebt.length}) — nothing to do, informational only:`)
    for (const fp of result.resolvedDebt) lines.push(`  RESOLVED  ${fp}`)
  }

  if (result.semanticDriftInfo.length > 0) {
    lines.push("")
    lines.push(`Semantic alias targets with no matching primitive (${result.semanticDriftInfo.length}) — known gap, informational:`)
    for (const f of result.semanticDriftInfo) lines.push(`  INFO  ${f.message}`)
  }

  lines.push("")
  lines.push(`Emitted-but-unused primitives (${result.unusedPrimitives.length}) — informational, not a defect:`)
  for (const v of result.unusedPrimitives) lines.push(`  UNUSED  ${v}`)

  lines.push("")
  lines.push(result.ok ? "PASS" : "FAIL")

  return lines.join("\n")
}

export { runAliasDebtChecks, formatReport, checkSemanticPrimitiveDrift, checkEmittedButUnusedPrimitives, extractKnownWarningFingerprints, diffAgainstBaseline }

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rootDir = process.cwd()
  const result = runAliasDebtChecks(rootDir)
  console.log(formatReport(result))

  const dumpArg = process.argv.find((a) => a.startsWith("--dump-baseline="))
  if (dumpArg) {
    const dumpPath = dumpArg.slice("--dump-baseline=".length)
    const allCurrentFingerprints = [...result.existingDebt, ...result.newDebt].sort()
    fs.writeFileSync(
      path.resolve(rootDir, dumpPath),
      JSON.stringify(
        {
          $description:
            "Baseline of pre-existing Prism token alias debt, as of the token-pipeline-hardening guardrail work (2026-08-28). Fingerprints here are known, accepted debt and do NOT block scripts/validate-alias-debt.mjs. A fingerprint appearing in a future run that is NOT in this list is newly introduced debt and WILL fail the check. Removing a fingerprint from this list (because the underlying debt was fixed) is always safe.",
          fingerprints: allCurrentFingerprints,
        },
        null,
        2,
      ),
      "utf8",
    )
    console.log(`\nWrote ${allCurrentFingerprints.length} fingerprint(s) to ${dumpPath}`)
  }

  process.exit(result.ok ? 0 : 1)
}
