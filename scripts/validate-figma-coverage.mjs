import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// -----------------------------------------------------------------------------
// Validates ai/figma-coverage.json deterministically against the checked-in
// repo state — no network or Figma access. This is what keeps the registry
// from silently rotting: every path it claims must exist, every status value
// must come from the controlled vocabulary, "Approved" must carry evidence,
// and duplicate Figma node mappings must be explicitly documented rather than
// accidental. See ai/figma-coverage.md for the human-readable summary this
// validates against.
// -----------------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

export function loadRegistry(root = rootDir) {
  const jsonPath = path.join(root, "ai/figma-coverage.json")
  const raw = fs.readFileSync(jsonPath, "utf8")
  return JSON.parse(raw)
}

export function loadPageInventory(root = rootDir) {
  const jsonPath = path.join(root, "ai/figma-page-inventory.json")
  const raw = fs.readFileSync(jsonPath, "utf8")
  return JSON.parse(raw)
}

export function validateRegistry(registry, root = rootDir, pageInventoryOverride = undefined) {
  const errors = []
  const warnings = []

  const { controlledValues, entries, sharedNodeIds, decisions, figmaFileKey, forbiddenFigmaFileKeys } = registry

  if (!controlledValues) errors.push("Missing controlledValues block")
  if (!Array.isArray(entries)) errors.push("Missing entries array")
  if (!Array.isArray(decisions) || decisions.length === 0) errors.push("Missing or empty decisions array")

  const allowedCategory = new Set(controlledValues?.category ?? [])
  const allowedStatus = new Set(controlledValues?.status ?? [])
  const allowedMapping = new Set(controlledValues?.figmaMappingStatus ?? [])
  const allowedFidelity = new Set(controlledValues?.fidelityReview ?? [])
  const allowedVisual = new Set(controlledValues?.visualReview ?? [])
  const allowedVerificationTier = new Set(controlledValues?.nodeVerificationTier ?? [])

  // 1. Unique IDs
  const seenIds = new Map()
  for (const entry of entries) {
    if (!entry.id) {
      errors.push(`Entry missing id: ${JSON.stringify(entry).slice(0, 80)}`)
      continue
    }
    if (seenIds.has(entry.id)) {
      errors.push(`Duplicate entry id: "${entry.id}"`)
    }
    seenIds.set(entry.id, entry)
  }

  // 2. Allowed enum values only
  for (const entry of entries) {
    if (!allowedCategory.has(entry.category)) errors.push(`${entry.id}: invalid category "${entry.category}"`)
    if (!allowedStatus.has(entry.status)) errors.push(`${entry.id}: invalid status "${entry.status}"`)
    if (!allowedMapping.has(entry.figmaMappingStatus)) errors.push(`${entry.id}: invalid figmaMappingStatus "${entry.figmaMappingStatus}"`)
    if (entry.fidelityReview !== undefined && !allowedFidelity.has(entry.fidelityReview)) errors.push(`${entry.id}: invalid fidelityReview "${entry.fidelityReview}"`)
    if (entry.visualReview !== undefined && !allowedVisual.has(entry.visualReview)) errors.push(`${entry.id}: invalid visualReview "${entry.visualReview}"`)
  }

  // 3. No undocumented duplicate Figma node mappings across entries. Every
  //    shared-node exception must name a reason, a primary owner, and cover
  //    the *exact* set of actual owners — not just be present for the nodeId.
  const sharedById = new Map((sharedNodeIds ?? []).map((s) => [s.nodeId, s]))
  const nodeIdOwners = new Map() // nodeId -> [entryId]
  for (const entry of entries) {
    for (const node of [...(entry.figmaNodes ?? []), ...(entry.figmaPages ?? [])]) {
      if (node.verified !== undefined && !allowedVerificationTier.has(node.verified)) {
        errors.push(`${entry.id}: node "${node.nodeId}" has invalid verification tier "${node.verified}"`)
      }
      if (!nodeIdOwners.has(node.nodeId)) nodeIdOwners.set(node.nodeId, [])
      nodeIdOwners.get(node.nodeId).push(entry.id)
    }
  }
  for (const [nodeId, owners] of nodeIdOwners) {
    const uniqueOwners = [...new Set(owners)]
    if (uniqueOwners.length <= 1) continue
    const shared = sharedById.get(nodeId)
    if (!shared) {
      errors.push(`Undocumented duplicate Figma node mapping: "${nodeId}" is claimed by [${uniqueOwners.join(", ")}] without a sharedNodeIds entry`)
      continue
    }
    const declaredOwners = new Set(shared.sharedBy ?? [])
    const missingFromDeclaration = uniqueOwners.filter((o) => !declaredOwners.has(o))
    if (missingFromDeclaration.length > 0) {
      errors.push(`sharedNodeIds entry for "${nodeId}" does not list actual owner(s) [${missingFromDeclaration.join(", ")}] in its sharedBy array`)
    }
    const declaredButAbsent = [...declaredOwners].filter((o) => !uniqueOwners.includes(o))
    if (declaredButAbsent.length > 0) {
      warnings.push(`sharedNodeIds entry for "${nodeId}" claims owner(s) [${declaredButAbsent.join(", ")}] that do not actually reference this node`)
    }
  }
  for (const shared of sharedNodeIds ?? []) {
    if (!shared.reason) errors.push(`sharedNodeIds entry for "${shared.nodeId}" is missing a reason`)
    if (!shared.primaryOwner) errors.push(`sharedNodeIds entry for "${shared.nodeId}" is missing a primaryOwner`)
    if (shared.primaryOwner && !(shared.sharedBy ?? []).includes(shared.primaryOwner)) {
      errors.push(`sharedNodeIds entry for "${shared.nodeId}": primaryOwner "${shared.primaryOwner}" is not present in its own sharedBy array`)
    }
    if (shared.primaryOwner && !seenIds.has(shared.primaryOwner)) {
      errors.push(`sharedNodeIds entry for "${shared.nodeId}": primaryOwner "${shared.primaryOwner}" is not a real entry id`)
    }
  }

  // 4. Mapped entries must carry at least one real node ID.
  for (const entry of entries) {
    if (entry.figmaMappingStatus === "Verified-MCP-this-session" || entry.figmaMappingStatus === "From-repo-evidence") {
      const hasNodes = (entry.figmaNodes?.length ?? 0) > 0 || (entry.figmaPages?.length ?? 0) > 0
      if (!hasNodes) errors.push(`${entry.id}: figmaMappingStatus "${entry.figmaMappingStatus}" requires at least one figmaNodes or figmaPages entry`)
    }
    if (entry.figmaMappingStatus === "Unmapped" || entry.figmaMappingStatus === "Not-applicable") {
      if ((entry.figmaNodes?.length ?? 0) > 0) errors.push(`${entry.id}: figmaMappingStatus "${entry.figmaMappingStatus}" should not carry figmaNodes`)
      if ((entry.figmaPages?.length ?? 0) > 0) errors.push(`${entry.id}: figmaMappingStatus "${entry.figmaMappingStatus}" should not carry figmaPages`)
    }
  }

  // 5. Referenced repository paths must exist.
  for (const entry of entries) {
    for (const p of [...(entry.repoPaths ?? []), ...(entry.examplePaths ?? []), entry.docPath].filter(Boolean)) {
      const abs = path.join(root, p)
      if (!fs.existsSync(abs)) errors.push(`${entry.id}: referenced path does not exist: ${p}`)
    }
  }

  // 6. Approval requires evidence + date; Missing cannot be Approved.
  for (const entry of entries) {
    const approvedLike = entry.status === "Approved" || entry.status === "Approved-with-documented-exception"
    if (approvedLike) {
      if (!entry.designOwnerApproval?.approved) errors.push(`${entry.id}: status "${entry.status}" requires designOwnerApproval.approved === true`)
      if (!entry.designOwnerApproval?.date) errors.push(`${entry.id}: status "${entry.status}" requires a designOwnerApproval.date`)
    }
    if (entry.status === "Missing" && entry.designOwnerApproval?.approved) {
      errors.push(`${entry.id}: status "Missing" cannot have designOwnerApproval.approved === true`)
    }
    if (entry.status === "Missing" && (entry.repoPaths?.length ?? 0) > 0) {
      errors.push(`${entry.id}: status "Missing" should not list repoPaths (nothing is implemented yet)`)
    }
  }

  // 7. Internal foundations must never be simultaneously marked design-owner approved
  //    as if they were an independently-approved shell/component.
  for (const entry of entries) {
    if (entry.status === "Internal foundation" && entry.designOwnerApproval?.approved) {
      errors.push(`${entry.id}: "Internal foundation" entries must not carry designOwnerApproval.approved === true — approval is inherited from consumers, never tracked independently`)
    }
  }

  // 7b. Category "Out of scope" and status "Out of scope" must agree — an
  //     item explicitly out of scope shouldn't be miscategorized as a normal
  //     Component/Shell/Pattern still pending work, and vice versa.
  for (const entry of entries) {
    if (entry.category === "Out of scope" && entry.status !== "Out of scope") {
      errors.push(`${entry.id}: category "Out of scope" but status is "${entry.status}" — they must agree`)
    }
    if (entry.status === "Out of scope" && entry.category !== "Out of scope") {
      errors.push(`${entry.id}: status "Out of scope" but category is "${entry.category}" — they must agree`)
    }
    if (entry.status === "Out of scope" && entry.designOwnerApproval?.approved) {
      errors.push(`${entry.id}: status "Out of scope" must not carry designOwnerApproval.approved === true — a scope marker is never approval evidence`)
    }
  }

  // 7c. Category "Reference" pages (pure Figma-authoring tooling — e.g.
  //     Template, _Icons Source) must never be treated as approved product
  //     components, per explicit instruction.
  for (const entry of entries) {
    if (entry.category === "Reference") {
      if (entry.status === "Approved" || entry.status === "Approved-with-documented-exception") {
        errors.push(`${entry.id}: category "Reference" must not carry an Approved-like status — reference pages are never approved product components`)
      }
      if (entry.designOwnerApproval?.approved) {
        errors.push(`${entry.id}: category "Reference" must not carry designOwnerApproval.approved === true`)
      }
    }
  }

  // 8. Gallery-presence / docs-stable / green-marker must never be the sole
  //    justification for Approved status. We cannot inspect *why* a human set
  //    a status, but we CAN enforce the structural rule: Approved requires an
  //    explicit designOwnerApproval date (checked in #6), and separately, an
  //    entry must not claim Approved purely because it has a gallerySection —
  //    i.e. every Approved entry's notes/knownDeviations must not be empty
  //    (approval must be traceable to something beyond just "it's implemented").
  for (const entry of entries) {
    const approvedLike = entry.status === "Approved" || entry.status === "Approved-with-documented-exception"
    if (approvedLike && !entry.notes) {
      warnings.push(`${entry.id}: Approved entry has no notes — approval should be traceable to specific evidence, not just gallery presence`)
    }
  }

  // 9. Figma file key sanity.
  if (registry.figmaFileKey !== "U3D8WMBVFl9LvAZyLHhm24") {
    errors.push(`Registry figmaFileKey must be the approved source file key, got "${registry.figmaFileKey}"`)
  }
  for (const entry of entries) {
    if (forbiddenFigmaFileKeys?.includes(entry.figmaFileKey)) {
      errors.push(`${entry.id}: references a forbidden Figma file key`)
    }
  }

  // 10. Cross-check summary counts in ai/figma-coverage.md match the registry.
  const mdPath = path.join(root, "ai/figma-coverage.md")
  if (fs.existsSync(mdPath)) {
    const md = fs.readFileSync(mdPath, "utf8")
    const totalMatch = md.match(/Total entries:\s*(\d+)/)
    if (totalMatch) {
      const mdTotal = Number(totalMatch[1])
      if (mdTotal !== entries.length) {
        errors.push(`ai/figma-coverage.md "Total entries: ${mdTotal}" does not match registry entry count ${entries.length}`)
      }
    } else {
      warnings.push(`ai/figma-coverage.md has no "Total entries: N" line to cross-check against the registry`)
    }

    const statusCounts = {}
    for (const entry of entries) statusCounts[entry.status] = (statusCounts[entry.status] ?? 0) + 1
    const categoryCounts = {}
    for (const entry of entries) categoryCounts[entry.category] = (categoryCounts[entry.category] ?? 0) + 1

    const countRowPattern = /\|\s*`?([A-Za-z0-9 /\-]+)`?\s*\|\s*(\d+)\s*\|/g
    let match
    const mdCounts = {}
    while ((match = countRowPattern.exec(md)) !== null) {
      const label = match[1].trim()
      if (allowedStatus.has(label) || allowedCategory.has(label)) mdCounts[label] = Number(match[2])
    }
    for (const [status, count] of Object.entries(statusCounts)) {
      if (mdCounts[status] !== undefined && mdCounts[status] !== count) {
        errors.push(`ai/figma-coverage.md status count for "${status}" is ${mdCounts[status]}, registry has ${count}`)
      }
    }
    for (const [category, count] of Object.entries(categoryCounts)) {
      if (mdCounts[category] !== undefined && mdCounts[category] !== count) {
        errors.push(`ai/figma-coverage.md category count for "${category}" is ${mdCounts[category]}, registry has ${count}`)
      }
    }
    // Every status/category that exists in the registry must appear
    // *somewhere* in the md count tables — a status with real entries but no
    // md row at all would silently hide it from the human-readable summary.
    for (const status of Object.keys(statusCounts)) {
      if (mdCounts[status] === undefined) warnings.push(`ai/figma-coverage.md has no count row for status "${status}", which has ${statusCounts[status]} entries in the registry`)
    }
    for (const category of Object.keys(categoryCounts)) {
      if (mdCounts[category] === undefined) warnings.push(`ai/figma-coverage.md has no count row for category "${category}", which has ${categoryCounts[category]} entries in the registry`)
    }
  } else {
    warnings.push("ai/figma-coverage.md does not exist — cannot cross-check summary counts")
  }

  // 11. Page-inventory completeness. CI cannot query Figma, so
  //     ai/figma-page-inventory.json is the checked-in, deterministic record
  //     of every top-level page this process has ever directly observed — both
  //     "content" pages (which must be cited by at least one registry entry's
  //     figmaPages) and "separator" pages (pure category dividers, which must
  //     NEVER be cited as an owning page by any registry entry). A page's kind
  //     is the sole basis for this distinction — never proximity, naming
  //     guesswork, or an ad hoc exclusion reason. Expected page counts are
  //     carried in the inventory file itself, so silently deleting a page (of
  //     either kind) desyncs the counts and fails validation.
  const registryPageIds = new Set()
  for (const entry of entries) {
    for (const p of entry.figmaPages ?? []) registryPageIds.add(p.nodeId)
  }
  const inventoryPath = path.join(root, "ai/figma-page-inventory.json")
  const inventory = pageInventoryOverride ?? (fs.existsSync(inventoryPath) ? JSON.parse(fs.readFileSync(inventoryPath, "utf8")) : null)
  if (inventory) {
    const separatorPattern = inventory.separatorNamingPattern ? new RegExp(inventory.separatorNamingPattern) : /^──.*──+$/
    const inventoryPageIds = new Set()
    let contentCount = 0
    let separatorCount = 0
    for (const page of inventory.pages ?? []) {
      if (!page.nodeId || !page.name) {
        errors.push(`ai/figma-page-inventory.json: page entry missing nodeId or name: ${JSON.stringify(page).slice(0, 80)}`)
        continue
      }
      if (inventoryPageIds.has(page.nodeId)) {
        errors.push(`ai/figma-page-inventory.json: duplicate page nodeId "${page.nodeId}"`)
      }
      inventoryPageIds.add(page.nodeId)

      if (page.kind !== "content" && page.kind !== "separator") {
        errors.push(`ai/figma-page-inventory.json: page "${page.nodeId}" ("${page.name}") has invalid kind "${page.kind}" — must be "content" or "separator"`)
        continue
      }

      if (page.kind === "separator") {
        separatorCount++
        if (!separatorPattern.test(page.name)) {
          errors.push(`ai/figma-page-inventory.json: separator page "${page.nodeId}" name "${page.name}" does not match the controlled separator naming convention (${separatorPattern})`)
        }
        if (registryPageIds.has(page.nodeId)) {
          errors.push(`ai/figma-page-inventory.json: separator page "${page.nodeId}" ("${page.name}") is cited as an owning page by a registry entry — separator pages must never own registry entries`)
        }
      }

      if (page.kind === "content") {
        contentCount++
        if (!registryPageIds.has(page.nodeId)) {
          errors.push(`ai/figma-page-inventory.json: content page "${page.nodeId}" ("${page.name}") is not cited by any registry entry's figmaPages — either restore its registry citation or reclassify it`)
        }
      }
    }

    if (inventory.expectedContentPageCount !== undefined && contentCount !== inventory.expectedContentPageCount) {
      errors.push(`ai/figma-page-inventory.json: expectedContentPageCount is ${inventory.expectedContentPageCount} but ${contentCount} content pages are present`)
    }
    if (inventory.expectedSeparatorPageCount !== undefined && separatorCount !== inventory.expectedSeparatorPageCount) {
      errors.push(`ai/figma-page-inventory.json: expectedSeparatorPageCount is ${inventory.expectedSeparatorPageCount} but ${separatorCount} separator pages are present`)
    }
    if (inventory.expectedTotalPageCount !== undefined && inventoryPageIds.size !== inventory.expectedTotalPageCount) {
      errors.push(`ai/figma-page-inventory.json: expectedTotalPageCount is ${inventory.expectedTotalPageCount} but ${inventoryPageIds.size} pages are present`)
    }

    // Drift the other way: a page cited in the registry but absent from the
    // checked-in inventory means the inventory itself has gone stale.
    for (const nodeId of registryPageIds) {
      if (!inventoryPageIds.has(nodeId)) {
        warnings.push(`Registry cites Figma page "${nodeId}" that is not recorded in ai/figma-page-inventory.json — add it to keep the inventory in sync`)
      }
    }
  } else {
    warnings.push("No page inventory available (file missing and no override supplied) — cannot run the page-inventory completeness check")
  }

  return { errors, warnings }
}

function main() {
  const registry = loadRegistry()
  const { errors, warnings } = validateRegistry(registry)

  for (const w of warnings) console.warn(`WARNING: ${w}`)
  for (const e of errors) console.error(`ERROR: ${e}`)

  console.log(`\nFigma coverage registry: ${registry.entries.length} entries, ${errors.length} errors, ${warnings.length} warnings.`)

  if (errors.length > 0) {
    process.exitCode = 1
  }
}

if (path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1] ?? "")) {
  main()
}
