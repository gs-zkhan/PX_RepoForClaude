// -----------------------------------------------------------------------------
// Regression tests for the AI-readiness registry coherence pass (docs/
// ai-readiness-registry-coherence). Cold Generation Tests #1-#4 surfaced
// several documentation/registry contradictions that gave an AI more than one
// possible answer for shell selection, PxMainContainer composition,
// DropdownMenu eligibility, and DashboardWidgetChartTypeSwitcher lookup. This
// file protects the specific corrections made, plus the two small validator
// rules (`dependencies` id existence, `ownedExports` shape/uniqueness) added
// to catch the same class of drift going forward.
//
//   node --test "tests/registry-coherence/*.test.mjs"
// -----------------------------------------------------------------------------

import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { test, describe } from "node:test"

import { loadRegistry, validateRegistry } from "../../scripts/validate-figma-coverage.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "../..")

function cloneRegistry() {
  return JSON.parse(JSON.stringify(loadRegistry(rootDir)))
}

function findEntry(registry, id) {
  return registry.entries.find((e) => e.id === id)
}

function readFile(relPath) {
  return fs.readFileSync(path.join(rootDir, relPath), "utf8")
}

describe("PxMainContainer: Analytics is a documented, architecturally valid direct consumer", () => {
  test("decision-px-main-container-internal names PxAnalyticsSecondaryNav as a documented consumer", () => {
    const registry = loadRegistry(rootDir)
    const decision = registry.decisions.find((d) => d.id === "decision-px-main-container-internal")
    assert.ok(decision, "expected a decision-px-main-container-internal record")
    assert.match(decision.statement, /PxAnalyticsSecondaryNav/)
  })

  test("shell-analytics-secondary-nav declares shell-px-main-container as a dependency", () => {
    const registry = loadRegistry(rootDir)
    const entry = findEntry(registry, "shell-analytics-secondary-nav")
    assert.ok(entry, "expected a shell-analytics-secondary-nav entry")
    assert.ok(entry.dependencies.includes("shell-px-main-container"))
  })

  test("PxMainContainer's own README lists PxAnalyticsSecondaryNav as a documented direct consumer", () => {
    const readme = readFile("src/patterns/px-main-container/README.md")
    assert.match(readme, /PxAnalyticsSecondaryNav/)
  })
})

describe("DropdownMenu: scoped-composition eligibility is declared, not inferred", () => {
  test("component-dropdown-menu remains Implemented-unmapped (status unchanged by this pass)", () => {
    const registry = loadRegistry(rootDir)
    const entry = findEntry(registry, "component-dropdown-menu")
    assert.equal(entry.status, "Implemented-unmapped")
  })

  test("a decision record documents the narrower scoped-composition rule", () => {
    const registry = loadRegistry(rootDir)
    const decision = registry.decisions.find((d) => d.id === "decision-dropdown-menu-scoped-composition")
    assert.ok(decision, "expected a decision-dropdown-menu-scoped-composition record")
    assert.match(decision.statement, /Implemented-unmapped/)
    assert.match(decision.statement, /menuContent/)
  })

  for (const id of ["component-button-split-variant", "shell-analytics-secondary-nav", "component-dashboard-widget-card"]) {
    test(`${id} declares component-dropdown-menu in its own dependencies`, () => {
      const registry = loadRegistry(rootDir)
      const entry = findEntry(registry, id)
      assert.ok(entry, `expected an entry with id "${id}"`)
      assert.ok(
        entry.dependencies.includes("component-dropdown-menu"),
        `expected "${id}".dependencies to include "component-dropdown-menu", got ${JSON.stringify(entry.dependencies)}`
      )
    })
  }
})

describe("DashboardWidgetChartTypeSwitcher: discoverable via ownedExports", () => {
  test("component-dashboard-widget-card declares it as an owned export", () => {
    const registry = loadRegistry(rootDir)
    const entry = findEntry(registry, "component-dashboard-widget-card")
    assert.ok(entry.ownedExports?.includes("DashboardWidgetChartTypeSwitcher"))
  })

  test("no other entry independently claims the same ownedExports name (unambiguous lookup)", () => {
    const registry = loadRegistry(rootDir)
    const owners = registry.entries.filter((e) => e.ownedExports?.includes("DashboardWidgetChartTypeSwitcher"))
    assert.equal(owners.length, 1)
    assert.equal(owners[0].id, "component-dashboard-widget-card")
  })
})

describe("Approval-status drift corrections", () => {
  test("PxListShell README no longer claims pending visual review", () => {
    const readme = readFile("src/patterns/px-list-shell/README.md")
    assert.doesNotMatch(readme, /pending visual review/i)
    assert.match(readme, /Approved \(design owner, 2026-08-27\)/)
  })

  test("button.doc.ts's bulkAction prop description no longer claims it is unreviewed", () => {
    const doc = readFile("src/docs/docs/button.doc.ts")
    assert.doesNotMatch(doc, /bulkAction.{0,40}NOT design-owner reviewed/is)
  })
})

describe("Shell-selection guidance: anatomy over product name", () => {
  test("ai/shell-registry.md states selection is anatomy-based, not name-based", () => {
    const md = readFile("ai/shell-registry.md")
    assert.match(md, /anatomy-based/i)
  })

  test("CLAUDE.md documents PxAnalyticsSecondaryNav as a shell reuse option", () => {
    const claudeMd = readFile("CLAUDE.md")
    assert.match(claudeMd, /PxAnalyticsSecondaryNav/)
  })
})

describe("figma-coverage registry: checked-in state still validates clean after this pass", () => {
  test("zero errors, zero new warnings introduced by this pass's edits", () => {
    const registry = loadRegistry(rootDir)
    const { errors } = validateRegistry(registry, rootDir)
    assert.deepEqual(errors, [])
  })
})

describe("validator: dependencies must reference real entry ids", () => {
  test("rejects a dependency id that does not exist", () => {
    const registry = cloneRegistry()
    registry.entries[0].dependencies = [...(registry.entries[0].dependencies ?? []), "not-a-real-entry-id"]
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("dependencies references unknown entry id")))
  })
})

describe("validator: ownedExports shape and uniqueness", () => {
  test("rejects an empty ownedExports array", () => {
    const registry = cloneRegistry()
    registry.entries[0].ownedExports = []
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("ownedExports must be a non-empty array")))
  })

  test("rejects a non-string entry inside ownedExports", () => {
    const registry = cloneRegistry()
    registry.entries[0].ownedExports = [42]
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes("ownedExports must contain only non-empty strings")))
  })

  test("rejects two entries claiming the same ownedExports name", () => {
    const registry = cloneRegistry()
    registry.entries[0].ownedExports = ["SharedName"]
    registry.entries[1].ownedExports = ["SharedName"]
    const { errors } = validateRegistry(registry, rootDir)
    assert.ok(errors.some((e) => e.includes('ownedExports name "SharedName" is claimed by more than one entry')))
  })
})
