import { test, describe } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

import { makeFixtureRoot, writeJson, cleanup } from "./helpers.mjs"
import { buildGeneratedCss } from "../../scripts/generate-prism-css.mjs"

// Direct behavioural tests for generate-prism-css.mjs's actual output —
// node --check only proves the file parses, not that it emits the right
// CSS variable names/values or resolves references correctly.
describe("generate-prism-css: buildGeneratedCss", () => {
  test("emits a literal colour as a plain hex custom property", () => {
    const root = makeFixtureRoot()
    try {
      const { css } = buildGeneratedCss(root)
      assert.match(css, /--p-color-royal-blue-700:\s*#0369E9;/)
      assert.match(css, /--p-color-neutral-800:\s*#25313B;/)
    } finally {
      cleanup(root)
    }
  })

  test("emits a qualified reference as a var() pointing at the correctly-named target", () => {
    const root = makeFixtureRoot() // C_Default's nav.background = {p.color.neutral.800}
    try {
      const { css } = buildGeneratedCss(root)
      assert.match(css, /--c-nav-background:\s*var\(--p-color-neutral-800\);/)
    } finally {
      cleanup(root)
    }
  })

  test("throws a clear error on an unresolved qualified reference, instead of emitting garbage", () => {
    const root = makeFixtureRoot({
      cDefault: {
        nav: { background: { $type: "color", $value: "{p.color.doesNotExist.700}", $description: "broken" } },
      },
    })
    try {
      assert.throws(() => buildGeneratedCss(root), /does not exist in Primitive tokens/)
    } finally {
      cleanup(root)
    }
  })

  test("produces both a :root (light) block and a .dark block", () => {
    const root = makeFixtureRoot()
    try {
      const { css } = buildGeneratedCss(root)
      assert.match(css, /:root\s*\{[\s\S]*--p-color-royal-blue-700:\s*#0369E9;[\s\S]*\}/)
      assert.match(css, /\.dark\s*\{[\s\S]*--p-color-royal-blue-700:\s*#0369E9;[\s\S]*\}/)
    } finally {
      cleanup(root)
    }
  })

  test("is deterministic: two calls against the same fixture produce byte-identical output", () => {
    const root = makeFixtureRoot()
    try {
      const first = buildGeneratedCss(root).css
      const second = buildGeneratedCss(root).css
      assert.equal(first, second)
    } finally {
      cleanup(root)
    }
  })

  test("reflects a token-source change on the next call (this is what the staleness check relies on)", () => {
    const root = makeFixtureRoot()
    try {
      const before = buildGeneratedCss(root).css
      assert.match(before, /--p-color-royal-blue-700:\s*#0369E9;/)

      const pLightPath = path.join(root, "tokens/P_Light_Default.tokens.json")
      const pLight = JSON.parse(fs.readFileSync(pLightPath, "utf8"))
      pLight.color.royalBlue["700"].$value.hex = "#ABCDEF"
      pLight.color.royalBlue["700"].$value.components = [0.671, 0.804, 0.937]
      writeJson(root, "tokens/P_Light_Default.tokens.json", pLight)

      const after = buildGeneratedCss(root).css
      assert.match(after, /--p-color-royal-blue-700:\s*#ABCDEF;/)
      assert.notEqual(before, after)
    } finally {
      cleanup(root)
    }
  })
})
