import fs from "node:fs"
import os from "node:os"
import path from "node:path"

// Builds a small, self-contained token-source fixture — not a full,
// floor-satisfying corpus like the real repo's tokens/*.json, just enough
// structure for generate-prism-css.mjs / validate-protected-tokens.mjs to
// run meaningfully against: one --c-nav-background (a real var() alias, like
// the repo's own), one baked-literal semantic action.primary.default /
// text.default (matching the repo's own "semantic tokens are baked
// literals with a descriptive alias note" pattern), and the three
// protected primitives.
//
// Deliberately does NOT touch the real repo's tokens/ directory — every
// fixture lives in its own fs.mkdtempSync() temp directory, cleaned up by
// the caller (or left for the OS temp-dir GC; these are tiny).

function writeJson(root, relPath, obj) {
  const abs = path.join(root, relPath)
  fs.mkdirSync(path.dirname(abs), { recursive: true })
  fs.writeFileSync(abs, JSON.stringify(obj, null, 2), "utf8")
}

function colorToken(hex, description) {
  const clean = hex.replace("#", "")
  const components = [
    Number.parseInt(clean.slice(0, 2), 16) / 255,
    Number.parseInt(clean.slice(2, 4), 16) / 255,
    Number.parseInt(clean.slice(4, 6), 16) / 255,
  ]
  return {
    $type: "color",
    $value: { colorSpace: "srgb", components, alpha: 1, hex },
    $description: description,
  }
}

function makeFixtureRoot(overrides = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "token-guardrail-fixture-"))

  // "Actual" values (what the token source itself holds) default to the
  // canonical baseline, but can be overridden independently of the
  // "approved" values below — this is what lets a test simulate "the
  // token changed" without also changing what the policy says was
  // approved (and vice versa).
  const royalBlue700 = overrides.royalBlue700Hex ?? "#0369E9"
  const neutral800 = overrides.neutral800Hex ?? "#25313B"
  const neutral900 = overrides.neutral900Hex ?? "#181F26"

  const approvedRoyalBlue700 = overrides.approvedRoyalBlue700Hex ?? "#0369E9"
  const approvedNeutral800 = overrides.approvedNeutral800Hex ?? "#25313B"
  const approvedNeutral900 = overrides.approvedNeutral900Hex ?? "#181F26"

  const defaultPLight = {
    color: {
      royalBlue: { "700": colorToken(royalBlue700, overrides.royalBlue700Desc ?? `Royal blue 700 — ${royalBlue700}. Primary brand blue.`) },
      neutral: {
        "800": colorToken(neutral800, overrides.neutral800Desc ?? `Grey 800 — ${neutral800}. Primary dark surface.`),
        "900": colorToken(neutral900, overrides.neutral900Desc ?? `Darkest neutral — ${neutral900}. Primary text colour.`),
      },
    },
  }

  writeJson(root, "tokens/P_Light_Default.tokens.json", overrides.pLight ?? defaultPLight)
  writeJson(root, "tokens/P_Dark.tokens.json", overrides.pDark ?? defaultPLight)

  writeJson(
    root,
    "tokens/S_Light.tokens.json",
    overrides.sLight ?? {
      color: {
        action: {
          primary: {
            default: colorToken(overrides.actionPrimaryHex ?? royalBlue700, `Primary action default. Aliases color/royalBlue/700 (Light).`),
          },
        },
        text: {
          default: colorToken(overrides.textDefaultHex ?? neutral900, `Default text. Aliases color/neutral/900 (Light).`),
        },
      },
    },
  )
  writeJson(root, "tokens/S_Dark.tokens.json", overrides.sDark ?? { color: {} })

  writeJson(
    root,
    "tokens/C_Default.tokens.json",
    overrides.cDefault ?? {
      nav: {
        background: { $type: "color", $value: "{p.color.neutral.800}", $description: "Nav rail background." },
      },
    },
  )
  writeJson(root, "tokens/T_Typography.styles.json", overrides.tTypography ?? {})
  writeJson(root, "tokens/E_Effects.styles.json", overrides.eEffects ?? {})

  const defaultPolicy = {
    $description: "Test fixture policy.",
    protected: [
      {
        path: "color.royalBlue.700",
        files: ["tokens/P_Light_Default.tokens.json", "tokens/P_Dark.tokens.json"],
        reason: "test",
        visibleSurfaces: ["Buttons"],
        approvedValue: { hex: approvedRoyalBlue700 },
        approvedBy: "design-owner",
        approvedAt: "2026-08-28",
      },
      {
        path: "color.neutral.800",
        files: ["tokens/P_Light_Default.tokens.json", "tokens/P_Dark.tokens.json"],
        reason: "test",
        visibleSurfaces: ["Nav"],
        approvedValue: { hex: approvedNeutral800 },
        approvedBy: "design-owner",
        approvedAt: "2026-08-28",
      },
      {
        path: "color.neutral.900",
        files: ["tokens/P_Light_Default.tokens.json", "tokens/P_Dark.tokens.json"],
        reason: "test",
        visibleSurfaces: ["Text"],
        approvedValue: { hex: approvedNeutral900 },
        approvedBy: "design-owner",
        approvedAt: "2026-08-28",
      },
    ],
  }
  writeJson(root, "tokens/protected-tokens.json", overrides.protectedPolicy ?? defaultPolicy)

  return root
}

function cleanup(root) {
  fs.rmSync(root, { recursive: true, force: true })
}

export { makeFixtureRoot, writeJson, colorToken, cleanup }
