import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { spawnSync } from "node:child_process"

// Shared fixture builders for tests that need a REAL, throwaway git
// repository running the ACTUAL scripts/*.mjs files (copied verbatim, not
// re-implemented) — used by both the mutation-order and workflow-wiring
// integration tests, so both exercise identical repo shape and don't
// duplicate this setup.

const REAL_SCRIPTS_DIR = path.resolve(import.meta.dirname, "../../scripts")

function sh(cwd, cmd, args) {
  const result = spawnSync(cmd, args, { cwd, encoding: "utf8" })
  if (result.status !== 0 && result.stderr) {
    throw new Error(`"${cmd} ${args.join(" ")}" failed in ${cwd}:\n${result.stdout}\n${result.stderr}`)
  }
  return result
}

// A repo with only ONE identity-tagged token per source file. Any token
// present WITHOUT a com.figma.variableId is treated by
// figma-snapshot-import.mjs as "repoNoIdentity", which figma-sync.mjs's
// structural-safety gate (stage 3, BEFORE the protected-token gate this
// test targets) treats as a hard stop for an unrelated reason. Keeping
// Semantic/Component empty avoids that entirely, so the run reaches the
// protected-token gate for the reason these tests actually care about.
//
// This means the report's OWN "standing" checks (description/generated-
// output/rendered-smoke, which need real nav.background/action.primary/
// text.default entries to resolve) will legitimately report failures too
// — buildSyncReport's overall `blocked` is deliberately an OR of all of
// these, not just the protected-token part. Tests using this fixture that
// need to isolate the protected-token-specific behavior assert on that
// specifically, not just "blocked" — see each test's own comment.
function buildMinimalSyncRepo() {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "figma-sync-fixture-"))

  const royalBlue700 = {
    $type: "color",
    $value: { colorSpace: "srgb", components: [0.0117647061124444, 0.4117647111415863, 0.9137254953384399], alpha: 1, hex: "#0369E9" },
    $description: "Royal blue 700 — #0369E9. Primary brand blue.",
    $extensions: { "com.figma.variableId": "VariableID:184:9" },
  }

  fs.mkdirSync(path.join(repoRoot, "tokens"), { recursive: true })
  fs.writeFileSync(path.join(repoRoot, "tokens/P_Light_Default.tokens.json"), JSON.stringify({ color: { royalBlue: { "700": royalBlue700 } } }, null, 2))
  fs.writeFileSync(path.join(repoRoot, "tokens/P_Dark.tokens.json"), JSON.stringify({ color: { royalBlue: { "700": royalBlue700 } } }, null, 2))
  fs.writeFileSync(path.join(repoRoot, "tokens/S_Light.tokens.json"), JSON.stringify({}, null, 2))
  fs.writeFileSync(path.join(repoRoot, "tokens/S_Dark.tokens.json"), JSON.stringify({}, null, 2))
  fs.writeFileSync(path.join(repoRoot, "tokens/C_Default.tokens.json"), JSON.stringify({}, null, 2))
  // Needed only so generate-prism-css.mjs's buildGeneratedCss (called by
  // the report's standing checks) doesn't throw on a missing file — this
  // repo never exercises Typography/Effects tokens otherwise.
  fs.writeFileSync(path.join(repoRoot, "tokens/T_Typography.styles.json"), JSON.stringify({}, null, 2))
  fs.writeFileSync(path.join(repoRoot, "tokens/E_Effects.styles.json"), JSON.stringify({}, null, 2))
  fs.writeFileSync(
    path.join(repoRoot, "tokens/protected-tokens.json"),
    JSON.stringify(
      {
        protected: [
          {
            path: "color.royalBlue.700",
            files: ["tokens/P_Light_Default.tokens.json", "tokens/P_Dark.tokens.json"],
            reason: "test fixture",
            visibleSurfaces: ["Buttons"],
            approvedValue: { hex: "#0369E9" },
            approvedBy: "design-owner",
            approvedAt: "2026-08-28",
          },
        ],
      },
      null,
      2,
    ),
  )

  fs.mkdirSync(path.join(repoRoot, "scripts"), { recursive: true })
  for (const file of fs.readdirSync(REAL_SCRIPTS_DIR)) {
    if (file.endsWith(".mjs")) {
      fs.copyFileSync(path.join(REAL_SCRIPTS_DIR, file), path.join(repoRoot, "scripts", file))
    }
  }

  sh(repoRoot, "git", ["init", "-q"])
  sh(repoRoot, "git", ["config", "user.email", "test@example.com"])
  sh(repoRoot, "git", ["config", "user.name", "Test"])
  sh(repoRoot, "git", ["checkout", "-q", "-b", "poc/prism-figma-pipeline"])
  sh(repoRoot, "git", ["add", "-A"])
  sh(repoRoot, "git", ["commit", "-q", "-m", "initial fixture commit"])

  return repoRoot
}

// A snapshot proposing royalBlue.700 -> red (#E90303), the exact real
// incident value — matched against the fixture repo's own variableId, so
// figma-snapshot-import.mjs's dry run reports it as a genuine changedLiteral.
function buildMismatchedSnapshot() {
  // Written OUTSIDE the fixture repo — inside it, the file would show up
  // as untracked and trip figma-sync.mjs's own "working tree must be
  // clean" precondition before the gate under test even runs.
  const snapshotDir = fs.mkdtempSync(path.join(os.tmpdir(), "figma-sync-snapshot-"))
  const snapshotPath = path.join(snapshotDir, "snapshot.json")
  fs.writeFileSync(
    snapshotPath,
    JSON.stringify(
      {
        schemaVersion: "1.0.0",
        figmaFileName: "Prism V1 - ShadCN",
        exportedAt: new Date().toISOString(),
        totalVariables: 1,
        totalCollections: 1,
        collections: [],
        variables: [
          {
            id: "VariableID:184:9",
            key: "test-key",
            name: "color/royalBlue/700",
            collectionName: "Primitive",
            valuesByMode: [
              {
                modeName: "Default",
                isAlias: false,
                rawValue: { raw: { r: 0.9137254953384399, g: 0.0117647061124444, b: 0.0117647061124444, a: 1 }, normalized: { hex: "#E90303", alpha: 1 } },
              },
              {
                modeName: "Dark",
                isAlias: false,
                rawValue: { raw: { r: 0.0117647061124444, g: 0.4117647111415863, b: 0.9137254953384399, a: 1 }, normalized: { hex: "#0369E9", alpha: 1 } },
              },
            ],
          },
        ],
      },
      null,
      2,
    ),
  )
  return snapshotPath
}

export { REAL_SCRIPTS_DIR, sh, buildMinimalSyncRepo, buildMismatchedSnapshot }
