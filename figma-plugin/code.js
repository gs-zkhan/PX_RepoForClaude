// Prism Pipeline POC — Figma plugin main-thread code.
//
// Extraction-only. This file never calls any Figma API that creates,
// renames, or mutates a node/variable/collection, and never calls fetch,
// XMLHttpRequest, or any networking primitive. manifest.json also declares
// networkAccess.allowedDomains: ["none"], so the platform itself blocks any
// network call regardless of what this code does.
//
// Every value read from figma.variables is passed through unmodified except
// for VARIABLE_ALIAS values, which are additionally annotated with the
// resolved target's name/collection alongside the original alias — never
// replaced by the resolved literal. Preserving that alias/target pairing is
// the entire point of this POC: it proves the Plugin API gives us enough
// information to reconstruct "component token -> semantic/primitive target"
// relationships, which the Git token pipeline depends on.
//
// Step 4A adds one more capability on top of that: "Export Prism snapshot"
// (buildSnapshot, below) re-reads every local collection/variable fresh at
// click time and assembles a complete, deterministically-ordered JSON
// document covering the whole file. This is export-only — the resulting
// JSON is handed to ui.html to save as a file; nothing here writes it back
// into the Figma file, the Git repo, or anywhere else.

figma.showUI(__html__, { width: 480, height: 680 })

function serializeAliasValue(value) {
  if (value && typeof value === "object" && value.type === "VARIABLE_ALIAS") {
    return { type: "VARIABLE_ALIAS", targetVariableId: value.id }
  }
  return value
}

async function resolveAliasTarget(aliasValue) {
  if (!aliasValue || aliasValue.type !== "VARIABLE_ALIAS") return null

  const target = await figma.variables.getVariableByIdAsync(aliasValue.id)
  if (!target) {
    return { targetVariableId: aliasValue.id, resolved: false }
  }

  const targetCollection = await figma.variables.getVariableCollectionByIdAsync(
    target.variableCollectionId,
  )

  return {
    resolved: true,
    targetVariableId: target.id,
    targetVariableKey: target.key ?? null,
    targetVariableName: target.name,
    targetCollectionId: target.variableCollectionId,
    targetCollectionName: targetCollection ? targetCollection.name : null,
  }
}

async function buildValuesByMode(variable, collection) {
  const modes = collection ? collection.modes : []
  const result = {}

  for (const mode of modes) {
    const raw = variable.valuesByMode[mode.modeId]
    const isAlias = !!(raw && typeof raw === "object" && raw.type === "VARIABLE_ALIAS")

    result[mode.modeId] = {
      modeName: mode.name,
      isAlias,
      // The raw alias pointer is always preserved as-is, never flattened
      // into just the resolved literal.
      rawValue: isAlias ? serializeAliasValue(raw) : raw,
      alias: isAlias ? await resolveAliasTarget(raw) : null,
    }
  }

  return result
}

async function serializeVariable(variable) {
  const collection = await figma.variables.getVariableCollectionByIdAsync(
    variable.variableCollectionId,
  )

  return {
    id: variable.id,
    key: variable.key ?? null,
    name: variable.name,
    resolvedType: variable.resolvedType,
    description: variable.description || null,
    collectionId: variable.variableCollectionId,
    collectionName: collection ? collection.name : null,
    valuesByMode: await buildValuesByMode(variable, collection),
  }
}

async function getSummary() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const variables = await figma.variables.getLocalVariablesAsync()

  const countByCollectionId = {}
  for (const variable of variables) {
    const id = variable.variableCollectionId
    countByCollectionId[id] = (countByCollectionId[id] || 0) + 1
  }

  return {
    fileName: figma.root.name,
    totalCollections: collections.length,
    totalVariables: variables.length,
    collections: collections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      modes: collection.modes.map((mode) => ({ modeId: mode.modeId, name: mode.name })),
      variableCount: countByCollectionId[collection.id] || 0,
    })),
  }
}

async function findVariableByExactName(name) {
  const variables = await figma.variables.getLocalVariablesAsync()
  return variables.find((variable) => variable.name === name) || null
}

// Prefers "color/royalBlue/700" if — and only if — it actually exists.
// Never invents a fallback: if the preferred variable is missing, it
// reports real candidate names from the actual local variables instead.
async function findPrimitiveColorCandidate() {
  const preferredName = "color/royalBlue/700"
  const preferred = await findVariableByExactName(preferredName)

  if (preferred) {
    return { requestedName: preferredName, found: true, variable: await serializeVariable(preferred) }
  }

  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const variables = await figma.variables.getLocalVariablesAsync()

  const primitiveCollectionIds = new Set(
    collections.filter((c) => /primitive/i.test(c.name)).map((c) => c.id),
  )

  const candidates = variables
    .filter((variable) => {
      const inPrimitiveCollection =
        primitiveCollectionIds.size === 0 || primitiveCollectionIds.has(variable.variableCollectionId)
      return variable.resolvedType === "COLOR" && inPrimitiveCollection
    })
    .map((variable) => variable.name)
    .slice(0, 30)

  return { requestedName: preferredName, found: false, candidates }
}

// Finds one Component-collection variable whose value in some mode is a
// VARIABLE_ALIAS, to prove the "component token -> semantic/primitive
// target" chain is reconstructable from the Plugin API alone.
async function findComponentAliasExample() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const variables = await figma.variables.getLocalVariablesAsync()

  const componentCollectionIds = new Set(
    collections.filter((c) => /component/i.test(c.name)).map((c) => c.id),
  )

  for (const variable of variables) {
    const inComponentCollection =
      componentCollectionIds.size === 0 || componentCollectionIds.has(variable.variableCollectionId)
    if (!inComponentCollection) continue

    const hasAlias = Object.values(variable.valuesByMode).some(
      (value) => value && typeof value === "object" && value.type === "VARIABLE_ALIAS",
    )

    if (hasAlias) {
      return { found: true, variable: await serializeVariable(variable) }
    }
  }

  return { found: false }
}

// Ordinal (non-locale) string comparison, so sort order can never shift
// between machines/locales — needed for the snapshot export to be
// byte-stable between runs when Figma hasn't changed.
function compareStrings(a, b) {
  const x = a ?? ""
  const y = b ?? ""
  if (x < y) return -1
  if (x > y) return 1
  return 0
}

function normalizeColorValue(rgba) {
  const clamp01 = (n) => Math.min(1, Math.max(0, typeof n === "number" ? n : 0))
  const toByte = (n) => Math.round(clamp01(n) * 255)
  const toHex2 = (n) => n.toString(16).padStart(2, "0").toUpperCase()
  const alpha = typeof rgba.a === "number" ? rgba.a : 1

  return {
    hex: `#${toHex2(toByte(rgba.r))}${toHex2(toByte(rgba.g))}${toHex2(toByte(rgba.b))}`,
    alpha,
  }
}

// Never mutates the Figma value. For COLOR, wraps the untouched raw RGBA
// alongside a normalized hex/alpha representation, so the repo importer
// (Step 4B) has both without this plugin making any lossy decision.
// FLOAT/STRING/BOOLEAN pass through exactly as Figma gave them.
function serializeLiteralValue(value, resolvedType) {
  if (resolvedType === "COLOR" && value && typeof value === "object") {
    return {
      raw: { r: value.r, g: value.g, b: value.b, a: value.a },
      normalized: normalizeColorValue(value),
    }
  }
  return value
}

// Best-effort, debugging-only resolution of what a mode's alias chain
// currently evaluates to. Never authoritative — the raw alias pointer
// (rawValue/alias on the mode entry) is what must be trusted structurally.
// Guards against cycles with a depth cap, same pattern as the repo's own
// token validator (scripts/validate-prism-tokens.mjs).
async function resolveLiteralForModeChain(variable, modeId, depth = 0) {
  if (depth > 10) return { error: "max-depth-exceeded" }

  const raw = variable.valuesByMode[modeId]
  const isAlias = !!(raw && typeof raw === "object" && raw.type === "VARIABLE_ALIAS")

  if (!isAlias) {
    return { value: serializeLiteralValue(raw, variable.resolvedType) }
  }

  const target = await figma.variables.getVariableByIdAsync(raw.id)
  if (!target) return { error: "unresolved-target" }

  const targetCollection = await figma.variables.getVariableCollectionByIdAsync(
    target.variableCollectionId,
  )
  const targetModeId =
    target.valuesByMode[modeId] !== undefined
      ? modeId
      : targetCollection
        ? targetCollection.defaultModeId
        : modeId

  return resolveLiteralForModeChain(target, targetModeId, depth + 1)
}

// Builds the full deterministic snapshot. Always re-fetches local
// collections/variables from Figma directly — nothing here is read from a
// module-level cache, so every export reflects the file's current state.
async function buildSnapshot() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync()
  const variables = await figma.variables.getLocalVariablesAsync()

  const collectionById = new Map(collections.map((c) => [c.id, c]))

  const countByCollectionId = {}
  for (const variable of variables) {
    const id = variable.variableCollectionId
    countByCollectionId[id] = (countByCollectionId[id] || 0) + 1
  }

  const collectionEntries = [...collections]
    .sort(
      (a, b) =>
        compareStrings(a.name, b.name) || compareStrings(a.key, b.key) || compareStrings(a.id, b.id),
    )
    .map((collection) => ({
      id: collection.id,
      key: collection.key ?? null,
      name: collection.name,
      defaultModeId: collection.defaultModeId ?? null,
      // Mode order is preserved exactly as Figma defines it on the
      // collection — never re-sorted.
      modes: collection.modes.map((mode) => ({ modeId: mode.modeId, modeName: mode.name })),
      variableCount: countByCollectionId[collection.id] || 0,
    }))

  const variableEntries = []

  for (const variable of variables) {
    const collection = collectionById.get(variable.variableCollectionId) || null
    const modes = collection ? collection.modes : []

    const valuesByMode = []

    for (const mode of modes) {
      const raw = variable.valuesByMode[mode.modeId]
      const isAlias = !!(raw && typeof raw === "object" && raw.type === "VARIABLE_ALIAS")

      const modeEntry = {
        modeId: mode.modeId,
        modeName: mode.name,
        isAlias,
        // Authoritative: the alias pointer itself, or the literal value —
        // never flattened into only a resolved literal.
        rawValue: isAlias ? serializeAliasValue(raw) : serializeLiteralValue(raw, variable.resolvedType),
        alias: isAlias ? await resolveAliasTarget(raw) : null,
      }

      if (isAlias) {
        const resolved = await resolveLiteralForModeChain(variable, mode.modeId)
        // Debugging aid only — see resolveLiteralForModeChain comment.
        modeEntry.resolvedLiteral = resolved.error ? { error: resolved.error } : resolved.value
      }

      valuesByMode.push(modeEntry)
    }

    variableEntries.push({
      id: variable.id,
      key: variable.key ?? null,
      name: variable.name,
      resolvedType: variable.resolvedType,
      description: variable.description || null,
      collectionId: variable.variableCollectionId,
      collectionName: collection ? collection.name : null,
      scopes: Array.isArray(variable.scopes) ? variable.scopes : null,
      hiddenFromPublishing:
        typeof variable.hiddenFromPublishing === "boolean" ? variable.hiddenFromPublishing : null,
      valuesByMode,
    })
  }

  variableEntries.sort(
    (a, b) =>
      compareStrings(a.collectionName, b.collectionName) ||
      compareStrings(a.collectionId, b.collectionId) ||
      compareStrings(a.name, b.name) ||
      compareStrings(a.key, b.key) ||
      compareStrings(a.id, b.id),
  )

  return {
    schemaVersion: "1.0.0",
    // The only field expected to differ between two exports of an
    // unchanged file — kept separate from everything else so a future
    // diff can ignore just this one key and compare the rest byte-for-byte.
    exportedAt: new Date().toISOString(),
    figmaFileName: figma.root.name,
    totalCollections: collections.length,
    totalVariables: variables.length,
    collections: collectionEntries,
    variables: variableEntries,
  }
}

figma.ui.onmessage = async (message) => {
  try {
    if (message.type === "get-summary") {
      figma.ui.postMessage({ type: "summary", payload: await getSummary() })
      return
    }

    if (message.type === "inspect-variable") {
      const variables = await figma.variables.getLocalVariablesAsync()
      const variable = variables.find((v) => v.id === message.id)
      if (!variable) {
        figma.ui.postMessage({ type: "inspect-result", error: "Variable not found" })
        return
      }
      figma.ui.postMessage({ type: "inspect-result", payload: await serializeVariable(variable) })
      return
    }

    if (message.type === "find-primitive-color") {
      figma.ui.postMessage({ type: "primitive-color-result", payload: await findPrimitiveColorCandidate() })
      return
    }

    if (message.type === "find-component-alias") {
      figma.ui.postMessage({ type: "component-alias-result", payload: await findComponentAliasExample() })
      return
    }

    if (message.type === "export-snapshot") {
      const snapshot = await buildSnapshot()
      figma.ui.postMessage({ type: "snapshot-result", payload: snapshot })
      return
    }
  } catch (error) {
    figma.ui.postMessage({ type: "error", message: String((error && error.message) || error) })
  }
}

getSummary()
  .then((summary) => figma.ui.postMessage({ type: "summary", payload: summary }))
  .catch((error) => figma.ui.postMessage({ type: "error", message: String((error && error.message) || error) }))
