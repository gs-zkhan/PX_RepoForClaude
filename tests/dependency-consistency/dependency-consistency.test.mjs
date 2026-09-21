import { test, describe } from "node:test"
import assert from "node:assert/strict"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { loadRegistry } from "../../scripts/validate-figma-coverage.mjs"
import {
  checkApprovedDependencyConsistency,
  checkCanonicalScreenDropdownMenu,
  validateDependencyConsistency,
} from "../../scripts/validate-dependency-consistency.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "../..")

function cloneRegistry() {
  return JSON.parse(JSON.stringify(loadRegistry(rootDir)))
}

describe("dependency consistency: checked-in state", () => {
  test("the real, checked-in repo has zero undeclared restricted dependencies", () => {
    const registry = loadRegistry(rootDir)
    const { errors } = validateDependencyConsistency(registry, rootDir)
    assert.deepEqual(errors, [])
  })
})

describe("dependency consistency: would have caught the three real findings", () => {
  test("catches the Popover inconsistency (component-color-picker before decision-popover-scoped-composition)", () => {
    const registry = cloneRegistry()
    const colorPicker = registry.entries.find((e) => e.id === "component-color-picker")
    assert.ok(colorPicker, "fixture assumption: component-color-picker exists")
    // Simulate the pre-fix state: strip the declared dependency this PR's
    // predecessor (PR #25) added, while leaving the real file (which really
    // does import Popover) untouched on disk.
    colorPicker.dependencies = colorPicker.dependencies.filter((d) => d !== "component-popover")

    const { errors } = checkApprovedDependencyConsistency(registry, rootDir)
    assert.ok(
      errors.some((e) => e.includes("component-color-picker") && e.includes("component-popover")),
      `expected a component-color-picker/component-popover error, got: ${JSON.stringify(errors)}`,
    )
  })

  test("catches the PxHeader -> component-input inconsistency (shell-px-list-shell before decision-input-scoped-composition)", () => {
    const registry = cloneRegistry()
    const listShell = registry.entries.find((e) => e.id === "shell-px-list-shell")
    assert.ok(listShell, "fixture assumption: shell-px-list-shell exists")
    // Simulate the pre-fix state: strip the declared dependency this PR
    // added, while leaving the real PxHeader.tsx (which really does import
    // Input) untouched on disk.
    listShell.dependencies = listShell.dependencies.filter((d) => d !== "component-input")

    const { errors } = checkApprovedDependencyConsistency(registry, rootDir)
    assert.ok(
      errors.some((e) => e.includes("shell-px-list-shell") && e.includes("component-input")),
      `expected a shell-px-list-shell/component-input error, got: ${JSON.stringify(errors)}`,
    )
  })

  test("catches direct screen-level DropdownMenu construction where disallowed", () => {
    const fixtureBefore = {
      "src/pages/fixture-example.tsx": `
        import {
          DropdownMenu,
          DropdownMenuTrigger,
          DropdownMenuContent,
          DropdownMenuItem,
        } from "@/components/ui/dropdown-menu"

        function FixtureScreen() {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger>Open</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Do a thing</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      `,
    }
    const { errors } = checkCanonicalScreenDropdownMenu(fixtureBefore)
    assert.ok(
      errors.some((e) => e.includes("fixture-example.tsx") && e.includes("DropdownMenu")),
      `expected a fixture-example.tsx DropdownMenu error, got: ${JSON.stringify(errors)}`,
    )
  })

  test("does NOT flag the sanctioned pass-through pattern (DropdownMenuItem/DropdownMenuSeparator only, no overlay exports)", () => {
    const fixtureAfter = {
      "src/pages/fixture-example.tsx": `
        import {
          DropdownMenuItem,
          DropdownMenuSeparator,
        } from "@/components/ui/dropdown-menu"
        import { TableRowActionsMenu } from "@/components/ui/table-row-actions-menu"

        function FixtureScreen() {
          return (
            <TableRowActionsMenu label="Actions">
              <DropdownMenuItem>Do a thing</DropdownMenuItem>
              <DropdownMenuSeparator />
            </TableRowActionsMenu>
          )
        }
      `,
    }
    const { errors } = checkCanonicalScreenDropdownMenu(fixtureAfter)
    assert.deepEqual(errors, [])
  })
})

describe("dependency consistency: avoids noisy false positives", () => {
  test("does not flag Mapped-review-pending dependencies left undeclared", () => {
    const registry = cloneRegistry()
    // component-table-customization-menu (Mapped-review-pending) is a real,
    // undeclared-by-convention dependency of several Approved consumers via
    // component-table-frame's own composition — this must never hard-fail,
    // since Mapped-review-pending is directly/provisionally usable per the
    // Component Eligibility Policy.
    const { errors } = checkApprovedDependencyConsistency(registry, rootDir)
    assert.ok(
      !errors.some((e) => e.includes("component-table-customization-menu")),
      `did not expect a Mapped-review-pending dependency to be flagged, got: ${JSON.stringify(errors)}`,
    )
  })

  test("does not flag a foundational-primitive dependency left undeclared on an Approved entry", () => {
    const registry = cloneRegistry()
    const link = registry.entries.find((e) => e.id === "component-link")
    assert.ok(link, "fixture assumption: component-link exists")
    // component-link (Approved) imports PrismIcon (foundation-prism-icon,
    // Mapped-review-pending) without declaring it — this is real, existing,
    // harmless bookkeeping laxness this check must not hard-fail on.
    assert.ok(
      !(link.dependencies ?? []).includes("foundation-prism-icon"),
      "fixture assumption: component-link does not declare foundation-prism-icon",
    )
    const { errors } = checkApprovedDependencyConsistency(registry, rootDir)
    assert.ok(
      !errors.some((e) => e.includes("component-link")),
      `did not expect component-link to be flagged, got: ${JSON.stringify(errors)}`,
    )
  })

  test("does not check Mapped-review-pending entries as consumers (out of scope by design)", () => {
    const registry = cloneRegistry()
    const statusSelect = registry.entries.find((e) => e.id === "component-status-select")
    assert.ok(statusSelect, "fixture assumption: component-status-select exists")
    // Deliberately strip its own (correctly declared) dependency to prove
    // this check does not reach into Mapped-review-pending consumers at all
    // — that gap was fixed manually in this same pass, not by this
    // automated check, since the check is scoped to Approved-tier consumers
    // per the Component Eligibility Policy's own framing.
    statusSelect.dependencies = statusSelect.dependencies.filter((d) => d !== "component-dropdown-menu")
    const { errors } = checkApprovedDependencyConsistency(registry, rootDir)
    assert.ok(
      !errors.some((e) => e.includes("component-status-select")),
      `expected component-status-select to be out of scope for this check, got: ${JSON.stringify(errors)}`,
    )
  })
})
