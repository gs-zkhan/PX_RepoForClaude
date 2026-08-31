import { test, describe } from "node:test"
import assert from "node:assert/strict"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { loadRegistry, loadPageInventory, validateRegistry } from "../../scripts/validate-figma-coverage.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "../..")

// Deep-clones the real registry so each test can mutate its own copy without
// needing a filesystem fixture — the checked-in ai/figma-coverage.json is
// itself the fixture under test everywhere else in this file.
function cloneRegistry() {
  return JSON.parse(JSON.stringify(loadRegistry(rootDir)))
}

describe("figma-coverage registry: checked-in state", () => {
  test("the real, checked-in registry validates with zero errors", () => {
    const registry = loadRegistry(rootDir)
    const { errors } = validateRegistry(registry, rootDir)
    assert.deepEqual(errors, [])
  })

  test("every entry has a unique id", () => {
    const registry = loadRegistry(rootDir)
    const ids = registry.entries.map((e) => e.id)
    assert.equal(new Set(ids).size, ids.length)
  })

  test("summary counts in figma-coverage.md match the registry", () => {
    const registry = loadRegistry(rootDir)
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(!errors.some((e) => e.includes("figma-coverage.md")), `expected no md-mismatch errors, got: ${JSON.stringify(errors)}`)
  })
})

describe("figma-coverage registry: validator catches injected defects", () => {
  test("rejects a duplicate entry id", () => {
    const registry = cloneRegistry()
    registry.entries.push({ ...registry.entries[0] })
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("Duplicate entry id")))
  })

  test("rejects an out-of-vocabulary status value", () => {
    const registry = cloneRegistry()
    registry.entries[0].status = "Totally Fine Probably"
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("invalid status")))
  })

  test("rejects an out-of-vocabulary category value", () => {
    const registry = cloneRegistry()
    registry.entries[0].category = "Vibes"
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("invalid category")))
  })

  test("rejects an undocumented duplicate Figma node mapping", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.id === "component-button")
    target.figmaNodes = [{ nodeId: "20:37", name: "borrowed from Modal", role: "component" }]
    target.figmaMappingStatus = "From-repo-evidence"
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("Undocumented duplicate Figma node mapping") && e.includes("20:37")))
  })

  test("allows a duplicate Figma node mapping that IS documented in sharedNodeIds", () => {
    const registry = cloneRegistry()
    const a = registry.entries.find((e) => e.id === "component-button")
    const b = registry.entries.find((e) => e.id === "component-toggle")
    a.figmaNodes = [{ nodeId: "9999:1", name: "shared test node", role: "component" }]
    a.figmaMappingStatus = "From-repo-evidence"
    b.figmaNodes = [{ nodeId: "9999:1", name: "shared test node", role: "component" }]
    b.figmaMappingStatus = "From-repo-evidence"
    registry.sharedNodeIds.push({ nodeId: "9999:1", name: "shared test node", primaryOwner: "component-button", sharedBy: ["component-button", "component-toggle"], reason: "test fixture" })
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(!errors.some((e) => e.includes("9999:1")))
  })

  test("rejects a mapped entry with no node IDs at all", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.id === "component-checkbox")
    target.figmaMappingStatus = "From-repo-evidence"
    // Force figmaNodes and figmaPages both empty — contradiction, regardless of this entry's real data.
    target.figmaNodes = []
    target.figmaPages = []
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("requires at least one figmaNodes or figmaPages entry")))
  })

  test("rejects a referenced repoPath that does not exist on disk", () => {
    const registry = cloneRegistry()
    registry.entries[0].repoPaths = ["src/components/ui/this-file-does-not-exist.tsx"]
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("does not exist") && e.includes("this-file-does-not-exist.tsx")))
  })

  test("rejects Approved status without designOwnerApproval.approved", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.status === "Approved")
    target.designOwnerApproval = { approved: false, date: "2026-08-27" }
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(target.id) && e.includes("requires designOwnerApproval.approved")))
  })

  test("rejects Approved status without a designOwnerApproval.date", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.status === "Approved")
    target.designOwnerApproval = { approved: true, date: null }
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(target.id) && e.includes("requires a designOwnerApproval.date")))
  })

  // The checked-in registry currently has zero real `Missing` entries (both
  // former `Missing` entries — Notification, RTE Field — were implemented
  // and moved to `Mapped-review-pending` on 2026-08-31), so these two tests
  // synthesize a minimal fixture entry rather than relying on `.find()`
  // locating one in live data — the validator rule being tested applies to
  // the `Missing` status generically, not to any specific real entry.
  function withSyntheticMissingEntry(registry) {
    const entry = {
      id: "fixture-synthetic-missing-entry",
      name: "Fixture Synthetic Missing Entry",
      category: "Component",
      figmaPages: [],
      figmaNodes: [],
      figmaMappingStatus: "Verified-MCP-this-session",
      repoPaths: [],
      docPath: null,
      gallerySection: null,
      examplePaths: [],
      implementationStatus: "Not implemented",
      status: "Missing",
      fidelityReview: "Not applicable",
      visualReview: "Not applicable",
      designOwnerApproval: { approved: false, date: null },
      knownDeviations: [],
      dependencies: [],
      recommendedOrder: null,
      notes: "Synthetic fixture entry for validator unit tests only — not a real catalogue entry.",
    }
    registry.entries.push(entry)
    return entry
  }

  test("rejects a Missing entry that is simultaneously marked design-owner approved", () => {
    const registry = cloneRegistry()
    const target = withSyntheticMissingEntry(registry)
    target.designOwnerApproval = { approved: true, date: "2026-08-28" }
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(target.id) && e.includes('status "Missing" cannot have designOwnerApproval.approved')))
  })

  test("rejects a Missing entry that lists repoPaths as if it were implemented", () => {
    const registry = cloneRegistry()
    const target = withSyntheticMissingEntry(registry)
    target.repoPaths = ["src/components/ui/button.tsx"]
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(target.id) && e.includes("should not list repoPaths")))
  })

  test("rejects an Internal foundation entry that is simultaneously marked design-owner approved", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.status === "Internal foundation")
    target.designOwnerApproval = { approved: true, date: "2026-08-28" }
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(target.id) && e.includes('"Internal foundation" entries must not carry designOwnerApproval.approved')))
  })

  test("rejects a registry pointed at a non-approved Figma file key", () => {
    const registry = cloneRegistry()
    registry.figmaFileKey = "Wh9XaMTl94yKMa0bYCQbrM"
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("approved source file key")))
  })

  test("rejects an entry that references a forbidden Figma file key", () => {
    const registry = cloneRegistry()
    registry.entries[0].figmaFileKey = "9ynHgauCIjtayjS92xHLrk"
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(registry.entries[0].id) && e.includes("forbidden Figma file key")))
  })

  test("rejects a sharedNodeIds entry missing a reason", () => {
    const registry = cloneRegistry()
    delete registry.sharedNodeIds[0].reason
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(registry.sharedNodeIds[0].nodeId) && e.includes("missing a reason")))
  })

  test("rejects a sharedNodeIds entry missing a primaryOwner", () => {
    const registry = cloneRegistry()
    delete registry.sharedNodeIds[0].primaryOwner
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(registry.sharedNodeIds[0].nodeId) && e.includes("missing a primaryOwner")))
  })

  test("rejects a sharedNodeIds entry whose primaryOwner is not in its own sharedBy array", () => {
    const registry = cloneRegistry()
    registry.sharedNodeIds[0].primaryOwner = "component-checkbox"
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(registry.sharedNodeIds[0].nodeId) && e.includes("is not present in its own sharedBy array")))
  })

  test("rejects a sharedNodeIds entry whose primaryOwner is not a real entry id", () => {
    const registry = cloneRegistry()
    const shared = registry.sharedNodeIds[0]
    shared.primaryOwner = "not-a-real-entry-id"
    shared.sharedBy.push("not-a-real-entry-id")
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("is not a real entry id")))
  })

  test("rejects a sharedNodeIds entry whose sharedBy array omits an actual owner of that node", () => {
    const registry = cloneRegistry()
    // shell-px-list-shell and shell-px-main-container both actually cite 3792:8575 —
    // drop one from the declared sharedBy without removing its real reference.
    const shared = registry.sharedNodeIds.find((s) => s.nodeId === "3792:8575")
    shared.sharedBy = shared.sharedBy.filter((id) => id !== "shell-px-list-shell")
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("3792:8575") && e.includes("does not list actual owner") && e.includes("shell-px-list-shell")))
  })

  test("warns (does not error) when sharedBy names an owner that no longer actually references the node", () => {
    const registry = cloneRegistry()
    const shared = registry.sharedNodeIds.find((s) => s.nodeId === "3792:8575")
    shared.sharedBy.push("component-checkbox")
    const { errors, warnings } = validateRegistry(registry, rootDir)
    assert.ok(!errors.some((e) => e.includes("3792:8575")))
    assert.ok(warnings.some((w) => w.includes("3792:8575") && w.includes("component-checkbox")))
  })

  test("rejects an invalid node-level verification tier", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.id === "component-link")
    target.figmaPages[0].verified = "trust-me-bro"
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("component-link") && e.includes("invalid verification tier")))
  })

  test("rejects category \"Out of scope\" paired with a non-Out-of-scope status", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.category === "Out of scope")
    target.status = "Missing"
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(target.id) && e.includes("must agree")))
  })

  test("rejects status \"Out of scope\" paired with a non-Out-of-scope category", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.status === "Out of scope")
    target.category = "Component"
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(target.id) && e.includes("must agree")))
  })

  test("rejects an Out of scope entry marked design-owner approved", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.status === "Out of scope")
    target.designOwnerApproval = { approved: true, date: "2026-08-28" }
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(target.id) && e.includes("scope marker is never approval evidence")))
  })

  test("rejects a category-count mismatch between the registry and figma-coverage.md", () => {
    const registry = cloneRegistry()
    registry.entries.push({ ...registry.entries.find((e) => e.category === "Shell") })
    registry.entries[registry.entries.length - 1].id = "shell-duplicate-for-count-test"
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("category count for \"Shell\"")))
  })

  test("rejects a Reference-category entry marked Approved", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.category === "Reference")
    target.status = "Approved"
    target.designOwnerApproval = { approved: true, date: "2026-08-28" }
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(target.id) && e.includes("must not carry an Approved-like status")))
  })

  test("rejects a Reference-category entry with designOwnerApproval.approved true even under a non-Approved status", () => {
    const registry = cloneRegistry()
    const target = registry.entries.find((e) => e.category === "Reference")
    target.designOwnerApproval = { approved: true, date: "2026-08-28" }
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes(target.id) && e.includes("must not carry designOwnerApproval.approved")))
  })
})

describe("figma-coverage registry: page-inventory completeness", () => {
  test("the real, checked-in page inventory validates against the real registry with zero errors", () => {
    const registry = loadRegistry(rootDir)
    const inventory = loadPageInventory(rootDir)
    const { errors } = validateRegistry(registry, rootDir, inventory)
    assert.deepEqual(errors.filter((e) => e.includes("figma-page-inventory")), [])
  })

  test("rejects a content-kind inventory page that no registry entry cites", () => {
    const registry = cloneRegistry()
    const inventory = { pages: [{ nodeId: "9999:9999", name: "A page nobody cites", kind: "content" }] }
    const { errors } = validateRegistry(registry, rootDir, inventory)
    assert.ok(errors.some((e) => e.includes("9999:9999") && e.includes("is not cited by any registry entry")))
  })

  test("allows a separator-kind inventory page with no registry citation", () => {
    const registry = cloneRegistry()
    const inventory = { pages: [{ nodeId: "9999:9999", name: "── Deliberately Excluded ──", kind: "separator" }] }
    const { errors } = validateRegistry(registry, rootDir, inventory)
    assert.ok(!errors.some((e) => e.includes("9999:9999")))
  })

  test("warns (does not error) when the registry cites a page absent from the inventory", () => {
    const registry = cloneRegistry()
    registry.entries[0].figmaPages = [{ nodeId: "8888:8888", name: "Not yet in the inventory" }]
    const inventory = { pages: [] }
    const { errors, warnings } = validateRegistry(registry, rootDir, inventory)
    assert.ok(!errors.some((e) => e.includes("8888:8888")))
    assert.ok(warnings.some((w) => w.includes("8888:8888") && w.includes("not recorded in ai/figma-page-inventory.json")))
  })

  test("rejects a malformed inventory page entry missing nodeId or name", () => {
    const registry = cloneRegistry()
    const inventory = { pages: [{ kind: "separator", name: "malformed, no nodeId" }] }
    const { errors } = validateRegistry(registry, rootDir, inventory)
    assert.ok(errors.some((e) => e.includes("missing nodeId or name")))
  })

  test("rejects an inventory page with an invalid kind", () => {
    const registry = cloneRegistry()
    const inventory = { pages: [{ nodeId: "9999:9999", name: "── Something ──", kind: "excluded" }] }
    const { errors } = validateRegistry(registry, rootDir, inventory)
    assert.ok(errors.some((e) => e.includes("9999:9999") && e.includes('invalid kind "excluded"')))
  })

  test("rejects a separator page whose name does not match the controlled naming convention", () => {
    const registry = cloneRegistry()
    const inventory = { pages: [{ nodeId: "9999:9999", name: "Not A Separator Name", kind: "separator" }] }
    const { errors } = validateRegistry(registry, rootDir, inventory)
    assert.ok(errors.some((e) => e.includes("9999:9999") && e.includes("naming convention")))
  })

  test("rejects a separator page cited as an owning page by a registry entry", () => {
    const registry = cloneRegistry()
    registry.entries[0].figmaPages = [{ nodeId: "9999:9999", name: "── Some Separator ──" }]
    const inventory = { pages: [{ nodeId: "9999:9999", name: "── Some Separator ──", kind: "separator" }] }
    const { errors } = validateRegistry(registry, rootDir, inventory)
    assert.ok(errors.some((e) => e.includes("9999:9999") && e.includes("separator pages must never own registry entries")))
  })

  test("rejects a duplicate nodeId across inventory pages", () => {
    const registry = cloneRegistry()
    const inventory = {
      pages: [
        { nodeId: "9999:9999", name: "── One ──", kind: "separator" },
        { nodeId: "9999:9999", name: "── One Again ──", kind: "separator" },
      ],
    }
    const { errors } = validateRegistry(registry, rootDir, inventory)
    assert.ok(errors.some((e) => e.includes("duplicate page nodeId") && e.includes("9999:9999")))
  })

  test("rejects content/separator/total counts that drift from the declared expected counts", () => {
    const registry = cloneRegistry()
    const inventory = {
      expectedContentPageCount: 5,
      expectedSeparatorPageCount: 5,
      expectedTotalPageCount: 10,
      pages: [{ nodeId: "9999:9999", name: "── Only One ──", kind: "separator" }],
    }
    const { errors } = validateRegistry(registry, rootDir, inventory)
    assert.ok(errors.some((e) => e.includes("expectedSeparatorPageCount is 5 but 1 separator pages are present")))
    assert.ok(errors.some((e) => e.includes("expectedTotalPageCount is 10 but 1 pages are present")))
  })

  test("the real, checked-in inventory has exactly 75 content + 12 separator = 87 pages", () => {
    const inventory = loadPageInventory(rootDir)
    const contentPages = inventory.pages.filter((p) => p.kind === "content")
    const separatorPages = inventory.pages.filter((p) => p.kind === "separator")
    assert.equal(contentPages.length, 75)
    assert.equal(separatorPages.length, 12)
    assert.equal(inventory.pages.length, 87)
  })
})
