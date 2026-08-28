import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { buildGeneratedCss } from "./generate-prism-css.mjs"

// -----------------------------------------------------------------------------
// Protected-token + value-integrity guardrail.
//
// Root cause this exists to close (see ai/token-guardrails.md for the full
// trace): scripts/figma-snapshot-import.mjs classifies any literal value
// change as "changedLiteral" purely because it's deterministic and
// unambiguous (same token identity, same structural kind, just a different
// literal) — and scripts/figma-sync.mjs then treats every "changedLiteral"
// as blanket-safe to auto-apply. Neither script has ever distinguished a
// brand-critical token from a decorative one; "deterministic" and "safe to
// auto-apply without human sign-off" were silently treated as the same
// thing. That is exactly how a controlled-test red value
// (color.royalBlue.700 -> #E90303, commit 2dcb46f) and a controlled-test
// green value (color.neutral.800 -> #34A73A, commit 4e82f66) both landed
// as real, automatically-applied commits.
//
// This script adds four independent checks, run together because they all
// answer the same question — "is the current token source trustworthy" —
// from different angles:
//
//   1. Protected-token gate: a token listed in tokens/protected-tokens.json
//      may only take a new value if that exact value is also the file's
//      own recorded `approvedValue` — i.e. the approval is edited into the
//      SAME reviewable file, in the SAME commit/PR, as the token change.
//      There is deliberately no env-var or CLI-flag bypass.
//   2. Description/value consistency: many token `$description` fields
//      state their own expected hex ("Royal blue 700 — #0369E9. ...") —
//      when present, the literal $value.hex must match it exactly.
//   3. Generated-output consistency: src/styles/prism-generated.css must be
//      byte-identical to what scripts/generate-prism-css.mjs would produce
//      right now from the current token sources.
//   4. Rendered-token smoke checks: a small set of critical, user-visible
//      CSS outcomes (nav background, primary action colour, primary text
//      colour) must resolve to the values tokens/protected-tokens.json
//      currently approves — derived from that one policy file, not
//      duplicated as separate raw constants here.
// -----------------------------------------------------------------------------

const HEX_IN_DESCRIPTION = /#[0-9A-Fa-f]{6}\b/

function loadJson(absPath) {
  return JSON.parse(fs.readFileSync(absPath, "utf8"))
}

// Exported so callers that need policy metadata (reason, visibleSurfaces,
// figmaReference — not just pass/fail) can read it directly, rather than
// picking through checkProtectedTokens' pass/fail findings, which only
// carry those fields on a "fail" entry.
function loadPolicy(rootDir) {
  return loadJson(path.join(rootDir, "tokens/protected-tokens.json"))
}

function getNode(json, dottedPath) {
  const parts = dottedPath.split(".")
  let node = json
  for (const part of parts) {
    if (node == null) return null
    node = node[part]
  }
  return node
}

function cssNameFromPath(prefix, tokenPath) {
  const safePath = tokenPath
    .replace(/\.\$root$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
  return `--${prefix}-${safePath}`
}

// "color.royalBlue.700" -> "royalBlue/700", matching the exact vocabulary
// token $description fields already use ("Aliases color/royalBlue/700").
function figmaStyleName(tokenPath) {
  const parts = tokenPath.split(".")
  return parts.slice(1).join("/") // drop the leading "color" group
}

// Finds every Semantic/Component token that names a given primitive as
// something it aliases — via Component's own `$extensions.com.figma.aliasData.targetVariableName`
// (structured metadata) or Semantic's descriptive "Aliases color/X/Y" prose
// (Semantic tokens are baked literals with no live reference — see
// ai/token-guardrails.md root cause #5). Used only for reporting ("what
// else names this token as its source") — not a correctness check; that's
// validate-alias-debt.mjs's checkSemanticPrimitiveDrift.
function findKnownConsumers(rootDir, tokenPath) {
  const styleName = figmaStyleName(tokenPath) // e.g. "royalBlue/700"
  const consumers = []

  const semanticFiles = ["tokens/S_Light.tokens.json", "tokens/S_Dark.tokens.json"]
  for (const file of semanticFiles) {
    const absPath = path.join(rootDir, file)
    if (!fs.existsSync(absPath)) continue
    const json = loadJson(absPath)

    function walkSemantic(node, currentPath) {
      if (!node || typeof node !== "object" || Array.isArray(node)) return
      if (Object.prototype.hasOwnProperty.call(node, "$value") && typeof node.$description === "string" && node.$description.includes(`color/${styleName}`)) {
        consumers.push({ file, tokenPath: currentPath, layer: "semantic" })
      }
      for (const [key, value] of Object.entries(node)) {
        if (key.startsWith("$") && key !== "$root") continue
        walkSemantic(value, currentPath ? `${currentPath}.${key}` : key)
      }
    }
    walkSemantic(json, "")
  }

  const componentPath = path.join(rootDir, "tokens/C_Default.tokens.json")
  if (fs.existsSync(componentPath)) {
    const json = loadJson(componentPath)

    function walkComponent(node, currentPath) {
      if (!node || typeof node !== "object" || Array.isArray(node)) return
      const aliasTarget = node.$extensions?.["com.figma.aliasData"]?.targetVariableName
      if (Object.prototype.hasOwnProperty.call(node, "$value") && aliasTarget === `color/${styleName}`) {
        consumers.push({ file: "tokens/C_Default.tokens.json", tokenPath: currentPath, layer: "component" })
      }
      for (const [key, value] of Object.entries(node)) {
        if (key.startsWith("$") && key !== "$root") continue
        walkComponent(value, currentPath ? `${currentPath}.${key}` : key)
      }
    }
    walkComponent(json, "")
  }

  return consumers
}

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

// Validates that every protected-policy entry actually carries a complete,
// human-authored approval record — not just an approvedValue. There is no
// time-based "staleness" here: tokens/protected-tokens.json is a persistent
// baseline with no expiry, so "approvedAt" being an old date is never
// itself a failure. What IS validated is completeness and well-formedness:
// a real approver name, a real (ISO-formatted) date, a real reason, a
// well-formed files list, and a well-formed hex value — an entry missing
// or malformed on any of these fields fails, regardless of whether the
// value itself would otherwise match.
function validatePolicySchema(policy) {
  const findings = []

  if (!Array.isArray(policy.protected)) {
    return [{ id: "policy-schema", status: "fail", message: `tokens/protected-tokens.json's "protected" field must be an array.` }]
  }

  for (const entry of policy.protected) {
    const path_ = entry.path
    const label = typeof path_ === "string" && path_.length > 0 ? path_ : "(entry with no path)"

    if (typeof path_ !== "string" || path_.length === 0) {
      findings.push({ id: "policy-schema", status: "fail", path: label, message: `Protected-policy entry "${label}" is missing a valid "path".` })
    }
    if (!Array.isArray(entry.files) || entry.files.length === 0) {
      findings.push({ id: "policy-schema", status: "fail", path: label, message: `Protected-policy entry "${label}" is missing a non-empty "files" array.` })
    }
    if (!entry.approvedValue || typeof entry.approvedValue.hex !== "string" || !HEX_COLOR.test(entry.approvedValue.hex)) {
      findings.push({ id: "policy-schema", status: "fail", path: label, message: `Protected-policy entry "${label}" is missing a valid "approvedValue.hex" (expected a 6-digit hex colour).` })
    }
    if (typeof entry.approvedBy !== "string" || entry.approvedBy.trim().length === 0) {
      findings.push({ id: "policy-schema", status: "fail", path: label, message: `Protected-policy entry "${label}" is missing a valid "approvedBy" (the design owner/approver's name).` })
    }
    if (typeof entry.approvedAt !== "string" || !ISO_DATE.test(entry.approvedAt)) {
      findings.push({ id: "policy-schema", status: "fail", path: label, message: `Protected-policy entry "${label}" is missing a valid "approvedAt" (expected an ISO date, YYYY-MM-DD).` })
    }
    if (typeof entry.reason !== "string" || entry.reason.trim().length === 0) {
      findings.push({ id: "policy-schema", status: "fail", path: label, message: `Protected-policy entry "${label}" is missing a valid "reason".` })
    }
    // figmaReference is optional by design — not validated for presence,
    // only for shape when it IS present, so a partially-filled-in
    // reference doesn't silently pass as if it were absent.
    if (entry.figmaReference !== undefined && (typeof entry.figmaReference !== "object" || typeof entry.figmaReference.variableId !== "string")) {
      findings.push({ id: "policy-schema", status: "fail", path: label, message: `Protected-policy entry "${label}" has a "figmaReference" but it's missing a valid "variableId".` })
    }
  }

  return findings
}

// --- 1 + 2: protected-token gate + description/value consistency -----------

function checkProtectedTokens(rootDir, policy) {
  const findings = []

  for (const entry of policy.protected) {
    for (const file of entry.files) {
      const absPath = path.join(rootDir, file)
      if (!fs.existsSync(absPath)) {
        findings.push({ id: "protected-token", status: "fail", path: entry.path, file, message: `Protected token file does not exist: ${file}` })
        continue
      }

      const json = loadJson(absPath)
      const node = getNode(json, entry.path)

      if (!node || typeof node.$value !== "object" || !node.$value.hex) {
        findings.push({ id: "protected-token", status: "fail", path: entry.path, file, message: `Token "${entry.path}" not found or is not a literal colour in ${file}` })
        continue
      }

      const currentHex = node.$value.hex
      const approvedHex = entry.approvedValue.hex

      if (currentHex.toUpperCase() === approvedHex.toUpperCase()) {
        findings.push({ id: "protected-token", status: "pass", path: entry.path, file, currentHex, approvedHex })
      } else {
        findings.push({
          id: "protected-token",
          status: "fail",
          path: entry.path,
          file,
          previousApprovedValue: approvedHex,
          proposedValue: currentHex,
          description: node.$description ?? null,
          reason: entry.reason,
          visibleSurfaces: entry.visibleSurfaces ?? [],
          message:
            `Protected token "${entry.path}" in ${file} is ${currentHex} but the only approved value on record is ${approvedHex}. ` +
            `This is a protected token (${entry.reason}) — a value change here requires an explicit, reviewable design-owner ` +
            `approval. The design owner must deliberately update tokens/protected-tokens.json's "approvedValue" for this entry to ` +
            `${currentHex} in its OWN, separate, human-authored commit, made BEFORE this token-source change is committed — never ` +
            `in the same automated run/commit that proposes the value, and never by an environment variable or CLI flag. ` +
            `tokens/protected-tokens.json is never written by scripts/figma-sync.mjs, scripts/figma-snapshot-import.mjs, or the ` +
            `Figma plugin/bridge — only a human editing it directly can unblock this check.`,
        })
      }
    }
  }

  return findings
}

// Pre-apply gate for scripts/figma-sync.mjs: given the PROPOSED changes a
// Figma snapshot would make (not what's currently on disk — dry-run only,
// nothing has been written yet), decides whether any protected token's
// incoming value is something a human already, separately approved.
//
// Deliberately reads only tokens/protected-tokens.json — never writes to
// it, never reads or writes any token-source file, never touches the
// working tree. `changedTokenDetails` is data already computed by the
// dry-run comparison (figma-snapshot-import.mjs without --apply); this
// function performs no I/O beyond loading the policy.
function checkProposedProtectedChanges(rootDir, changedTokenDetails) {
  const policyPath = path.join(rootDir, "tokens/protected-tokens.json")
  const policy = loadJson(policyPath)
  const policyByPath = new Map(policy.protected.map((entry) => [entry.path, entry]))
  const schemaFindings = validatePolicySchema(policy)
  const schemaFailurePaths = new Set(schemaFindings.map((f) => f.path))

  const blocked = []
  const preApproved = []

  for (const change of changedTokenDetails) {
    const entry = policyByPath.get(change.tokenPath)
    if (!entry) continue // not a protected token — out of scope for this gate

    if (schemaFailurePaths.has(change.tokenPath)) {
      // An incomplete/malformed approval record can't be verified as a
      // real approval, regardless of what the value happens to say — this
      // is not the same thing as a value mismatch, but is treated the same
      // way here: block, don't guess.
      const entrySchemaFindings = schemaFindings.filter((f) => f.path === change.tokenPath)
      blocked.push({
        ...change,
        approvedHex: entry.approvedValue?.hex ?? "(none)",
        reason: entry.reason ?? "(missing)",
        visibleSurfaces: entry.visibleSurfaces ?? [],
        message: `Protected token "${change.tokenPath}" has an incomplete or malformed approval record in tokens/protected-tokens.json: ${entrySchemaFindings.map((f) => f.message).join(" ")}`,
      })
      continue
    }

    const proposedHex = String(change.newValue).trim()
    const approvedHex = entry.approvedValue.hex

    if (proposedHex.toUpperCase() === approvedHex.toUpperCase()) {
      // The design owner already, separately, deliberately recorded this
      // exact value as approved BEFORE this sync ran — proceed.
      preApproved.push({ ...change, approvedBy: entry.approvedBy, approvedAt: entry.approvedAt })
    } else {
      blocked.push({
        ...change,
        approvedHex,
        reason: entry.reason,
        visibleSurfaces: entry.visibleSurfaces ?? [],
        message:
          `Protected token "${change.tokenPath}" — Figma proposes ${change.newValue}, but the only approved value on record ` +
          `in tokens/protected-tokens.json is ${approvedHex}. This sync will not proceed. ${entry.reason} ` +
          `To unblock: the design owner must deliberately edit tokens/protected-tokens.json's "approvedValue" for ` +
          `"${change.tokenPath}" to ${change.newValue}, in its own separate, human-authored commit, BEFORE rerunning this sync. ` +
          `This sync process itself will never make that edit — there is no environment variable, CLI flag, or automatically ` +
          `generated approval record that can substitute for it.`,
      })
    }
  }

  return { ok: blocked.length === 0, blocked, preApproved }
}

function checkDescriptionValueConsistency(rootDir, tokenFiles) {
  const findings = []

  for (const file of tokenFiles) {
    const absPath = path.join(rootDir, file)
    if (!fs.existsSync(absPath)) continue
    const json = loadJson(absPath)

    function walk(node, tokenPath) {
      if (!node || typeof node !== "object" || Array.isArray(node)) return

      if (Object.prototype.hasOwnProperty.call(node, "$value") && node.$value && typeof node.$value === "object" && node.$value.hex) {
        const description = node.$description
        if (typeof description === "string") {
          const match = description.match(HEX_IN_DESCRIPTION)
          if (match) {
            const describedHex = match[0]
            const actualHex = node.$value.hex
            if (describedHex.toUpperCase() === actualHex.toUpperCase()) {
              findings.push({ id: "description-value", status: "pass", path: tokenPath, file })
            } else {
              findings.push({
                id: "description-value",
                status: "fail",
                path: tokenPath,
                file,
                describedHex,
                actualHex,
                description,
                message: `${file} :: ${tokenPath} — description states "${describedHex}" but $value.hex is "${actualHex}".`,
              })
            }
          }
        }
      }

      for (const [key, value] of Object.entries(node)) {
        if (key.startsWith("$") && key !== "$root") continue
        walk(value, tokenPath ? `${tokenPath}.${key}` : key)
      }
    }

    walk(json, "")
  }

  return findings.map((f) => (f.path.startsWith(".") ? { ...f, path: f.path.slice(1) } : f))
}

// --- 3: generated-output consistency ----------------------------------------

function checkGeneratedOutputFresh(rootDir) {
  const outputPath = path.join(rootDir, "src/styles/prism-generated.css")
  const onDisk = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : null
  const { css: expected } = buildGeneratedCss(rootDir)

  if (onDisk === expected) {
    return [{ id: "generated-output", status: "pass" }]
  }

  return [
    {
      id: "generated-output",
      status: "fail",
      message:
        onDisk === null
          ? `src/styles/prism-generated.css does not exist — run "npm run tokens:generate".`
          : `src/styles/prism-generated.css is stale relative to the current token sources — run "npm run tokens:generate" and commit the result.`,
    },
  ]
}

// --- 4: rendered-token smoke checks ------------------------------------------

function resolveCssVar(css, varName, seen = new Set()) {
  if (seen.has(varName)) return { error: `cycle resolving ${varName}` }
  seen.add(varName)

  const pattern = new RegExp(`(^|\\n)\\s*${varName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:\\s*([^;]+);`)
  const match = css.match(pattern)
  if (!match) return { error: `${varName} not found in generated CSS` }

  const rawValue = match[2].trim()
  const varRef = rawValue.match(/^var\((--[a-z0-9-]+)\)$/)
  if (varRef) return resolveCssVar(css, varRef[1], seen)

  return { value: rawValue }
}

// Only resolves within the :root (light) block — the smoke checks below are
// explicitly light-mode. `css` must be sliced to that block by the caller.
function checkRenderedTokenSmoke(rootDir, policy) {
  const { css } = buildGeneratedCss(rootDir)
  const rootBlockMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/)
  const lightCss = rootBlockMatch ? rootBlockMatch[1] : css

  const byPath = new Map(policy.protected.map((e) => [e.path, e]))

  const checks = [
    { label: "Navigation background", cssVar: "--c-nav-background", protectedPath: "color.neutral.800" },
    { label: "Primary action colour", cssVar: "--s-color-action-primary-default", protectedPath: "color.royalBlue.700" },
    { label: "Primary text colour", cssVar: "--s-color-text-default", protectedPath: "color.neutral.900" },
  ]

  return checks.map(({ label, cssVar, protectedPath }) => {
    const policyEntry = byPath.get(protectedPath)
    const expectedHex = policyEntry?.approvedValue?.hex

    if (!expectedHex) {
      return { id: "rendered-smoke", status: "fail", label, message: `No approved baseline found for "${protectedPath}" in tokens/protected-tokens.json.` }
    }

    const resolved = resolveCssVar(lightCss, cssVar)
    if (resolved.error) {
      return { id: "rendered-smoke", status: "fail", label, cssVar, message: `${label} (${cssVar}): ${resolved.error}` }
    }

    const actual = resolved.value.toUpperCase()
    const expected = expectedHex.toUpperCase()

    if (actual === expected) {
      return { id: "rendered-smoke", status: "pass", label, cssVar, value: resolved.value }
    }

    return {
      id: "rendered-smoke",
      status: "fail",
      label,
      cssVar,
      expected: expectedHex,
      actual: resolved.value,
      message: `${label} (${cssVar}) resolves to ${resolved.value}, expected ${expectedHex} per the approved baseline for "${protectedPath}".`,
    }
  })
}

// --- Orchestration -----------------------------------------------------------

const ALL_TOKEN_FILES = [
  "tokens/P_Light_Default.tokens.json",
  "tokens/P_Dark.tokens.json",
  "tokens/S_Light.tokens.json",
  "tokens/S_Dark.tokens.json",
  "tokens/C_Default.tokens.json",
]

function runProtectedTokenChecks(rootDir) {
  const policyPath = path.join(rootDir, "tokens/protected-tokens.json")
  const policy = loadJson(policyPath)

  const schemaFindings = validatePolicySchema(policy)
  const protectedFindings = checkProtectedTokens(rootDir, policy)
  const descriptionFindings = checkDescriptionValueConsistency(rootDir, ALL_TOKEN_FILES)
  const generatedFindings = checkGeneratedOutputFresh(rootDir)
  const smokeFindings = checkRenderedTokenSmoke(rootDir, policy)

  const all = [...schemaFindings, ...protectedFindings, ...descriptionFindings, ...generatedFindings, ...smokeFindings]
  const failures = all.filter((f) => f.status === "fail")

  return {
    ok: failures.length === 0,
    findings: all,
    failures,
    sections: {
      policySchema: schemaFindings,
      protectedTokens: protectedFindings,
      descriptionValueConsistency: descriptionFindings,
      generatedOutput: generatedFindings,
      renderedSmoke: smokeFindings,
    },
  }
}

function formatReport(result) {
  const lines = []
  lines.push("Protected-token & value-integrity validation")
  lines.push("")

  if (result.sections.policySchema.length > 0) {
    lines.push("Protected-policy schema:")
    for (const f of result.sections.policySchema) lines.push(`  FAIL  ${f.message}`)
    lines.push("")
  }

  lines.push("Protected tokens:")
  for (const f of result.sections.protectedTokens) {
    if (f.status === "pass") {
      lines.push(`  PASS  ${f.path} (${f.file}) = ${f.currentHex}`)
    } else {
      lines.push(`  FAIL  ${f.message}`)
    }
  }

  lines.push("")
  lines.push(`Description/value consistency: ${result.sections.descriptionValueConsistency.filter((f) => f.status === "pass").length} pass, ${result.sections.descriptionValueConsistency.filter((f) => f.status === "fail").length} fail`)
  for (const f of result.sections.descriptionValueConsistency) {
    if (f.status === "fail") lines.push(`  FAIL  ${f.message}`)
  }

  lines.push("")
  lines.push("Generated output:")
  for (const f of result.sections.generatedOutput) {
    lines.push(`  ${f.status === "pass" ? "PASS" : "FAIL"}  ${f.message ?? "src/styles/prism-generated.css matches the current token sources."}`)
  }

  lines.push("")
  lines.push("Rendered-token smoke checks (light mode):")
  for (const f of result.sections.renderedSmoke) {
    if (f.status === "pass") {
      lines.push(`  PASS  ${f.label} (${f.cssVar}) = ${f.value}`)
    } else {
      lines.push(`  FAIL  ${f.message}`)
    }
  }

  lines.push("")
  lines.push(result.ok ? "PASS" : `FAIL — ${result.failures.length} problem(s)`)

  return lines.join("\n")
}

export { runProtectedTokenChecks, checkProposedProtectedChanges, validatePolicySchema, findKnownConsumers, loadPolicy, formatReport, figmaStyleName, cssNameFromPath }

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rootDir = process.cwd()
  const result = runProtectedTokenChecks(rootDir)
  console.log(formatReport(result))

  const jsonArg = process.argv.find((a) => a.startsWith("--json="))
  if (jsonArg) {
    const jsonPath = jsonArg.slice("--json=".length)
    fs.writeFileSync(path.resolve(rootDir, jsonPath), JSON.stringify(result, null, 2), "utf8")
  }

  process.exit(result.ok ? 0 : 1)
}
