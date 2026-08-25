import fs from "node:fs"
import path from "node:path"

const root = process.cwd()

// Light sources feed the :root block. Component/Typography/Effects have no
// dark-mode variant — they stay defined once, and cascade through whichever
// Primitive/Semantic values are active via the CSS variables they reference.
const lightSourceDefs = [
  {
    prefix: "p",
    label: "Primitive tokens",
    file: "tokens/P_Light_Default.tokens.json",
  },
  {
    prefix: "s",
    label: "Semantic tokens",
    file: "tokens/S_Light.tokens.json",
  },
  {
    prefix: "c",
    label: "Component tokens",
    file: "tokens/C_Default.tokens.json",
  },
  {
    prefix: "t",
    label: "Typography styles",
    file: "tokens/T_Typography.styles.json",
  },
  {
    prefix: "e",
    label: "Effect styles",
    file: "tokens/E_Effects.styles.json",
  },
]

// Dark sources feed the .dark block. Same prefixes ("p", "s") as light, on
// purpose — variable names must stay identical between :root and .dark so
// the browser's cascade is what switches the theme, not a second naming
// scheme. Only Primitive and Semantic have dark exports today.
const darkSourceDefs = [
  {
    prefix: "p",
    label: "Primitive tokens (Dark)",
    file: "tokens/P_Dark.tokens.json",
  },
  {
    prefix: "s",
    label: "Semantic tokens (Dark)",
    file: "tokens/S_Dark.tokens.json",
  },
]

function flattenTokens(node, currentPath = [], output = {}) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    return output
  }

  if (
    Object.prototype.hasOwnProperty.call(node, "$value") &&
    currentPath.length > 0
  ) {
    output[currentPath.join(".")] = node
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$") && key !== "$root") continue

    flattenTokens(value, [...currentPath, key], output)
  }

  return output
}

function cssName(prefix, tokenPath) {
  const safePath = tokenPath
    .replace(/\.\$root$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()

  return `--${prefix}-${safePath}`
}

function colourToCss(value) {
  const hex = value.hex
  const alpha = value.alpha ?? 1

  if (hex && alpha >= 1) return hex

  if (hex) {
    const clean = hex.replace("#", "")
    const red = Number.parseInt(clean.slice(0, 2), 16)
    const green = Number.parseInt(clean.slice(2, 4), 16)
    const blue = Number.parseInt(clean.slice(4, 6), 16)

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`
  }

  return String(value)
}

function numberToCss(tokenPath, value) {
  if (/font[.-]?weight/i.test(tokenPath)) {
    return String(value)
  }

  return `${value}px`
}

function typographyToCss(prefix, tokenPath, value) {
  const baseName = cssName(prefix, tokenPath)

  const properties = {
    family: value.fontFamily,
    style: value.fontStyle,
    weight: value.fontWeight,
    size: value.fontSize,
    "line-height": value.lineHeight,
    "letter-spacing": value.letterSpacing,
    "paragraph-spacing": value.paragraphSpacing,
    "text-case": value.textCase,
    "text-decoration": value.textDecoration,
  }

  return Object.entries(properties)
    .filter(([, propertyValue]) => propertyValue !== undefined)
    .map(([suffix, propertyValue]) => {
      const formattedValue =
        suffix === "family"
          ? `"${String(propertyValue).replaceAll('"', '\\"')}"`
          : String(propertyValue)

      return `  ${baseName}-${suffix}: ${formattedValue};`
    })
}

function shadowLayerToCss(layer) {
  if (!layer || layer.visible === false) return null

  const type = String(layer.type ?? "").toLowerCase()

  if (type !== "dropshadow" && type !== "innershadow") {
    return null
  }

  const inset = type === "innershadow" ? "inset " : ""

  return [
    inset,
    layer.offsetX ?? "0px",
    layer.offsetY ?? "0px",
    layer.blur ?? "0px",
    layer.spread ?? "0px",
    layer.color ?? "rgba(0, 0, 0, 0)",
  ].join(" ")
}

function shadowToCss(value) {
  const layers = Array.isArray(value) ? value : [value]

  return layers
    .map(shadowLayerToCss)
    .filter(Boolean)
    .join(", ")
}

// A qualified reference always starts with a single-letter prefix followed
// by a dot ("{s.color.surface.disabled}"). Every real token path segment
// exported from Figma is a multi-character word (verified: no source has a
// single-letter top-level group), so this pattern only ever matches an
// intentional qualifier, never a bare path — letting an unknown prefix be
// reported as its own distinct failure rather than a generic "not found".
const qualifiedReferencePattern = /^([a-z])\.(.+)$/

// Builds a self-contained resolution context (loaded/flattened sources, a
// collision-aware flat path index for bare references, and a prefix index
// for qualified references) from a list of source definitions. Used once
// for the light sources and once for the dark sources — light and dark
// never share a context, so a dark reference can never accidentally
// resolve against a light source, or vice versa.
function buildContext(sourceDefs, contextLabel) {
  const loadedSources = sourceDefs.map((source) => {
    const absolutePath = path.join(root, source.file)

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Missing token file: ${source.file}`)
    }

    const json = JSON.parse(fs.readFileSync(absolutePath, "utf8"))

    return {
      ...source,
      tokens: flattenTokens(json),
    }
  })

  // Each token path maps to every source (within this context) that defines
  // it. A path defined in more than one source is a collision: the bracket
  // reference syntax used in $value ("{some.path}") carries no source/layer
  // qualifier, so there is no safe way to guess which one a bare reference
  // was meant to resolve to.
  const tokenIndex = new Map()

  for (const source of loadedSources) {
    for (const tokenPath of Object.keys(source.tokens)) {
      const candidate = { prefix: source.prefix, label: source.label, cssName: cssName(source.prefix, tokenPath) }

      if (tokenIndex.has(tokenPath)) {
        tokenIndex.get(tokenPath).push(candidate)
      } else {
        tokenIndex.set(tokenPath, [candidate])
      }
    }
  }

  const collisions = [...tokenIndex.entries()].filter(([, candidates]) => candidates.length > 1)

  if (collisions.length > 0) {
    console.warn(
      `Warning (${contextLabel}): ${collisions.length} token path(s) are defined in more than one source. ` +
        `Any unqualified reference to these paths is ambiguous and will fail to resolve ` +
        `until disambiguated (a qualified reference such as "{s.path}" is unaffected):`,
    )

    for (const [tokenPath, candidates] of collisions) {
      console.warn(
        `  "${tokenPath}" -> ${candidates.map((c) => `${c.label} (${c.cssName})`).join(", ")}`,
      )
    }
  }

  // Sources are also indexed by their prefix so a qualified reference
  // ("{s.color.surface.disabled}") can resolve inside exactly one named
  // source, bypassing cross-source ambiguity by construction rather than by
  // guessing. Unqualified references ("{color.surface.disabled}") keep going
  // through the flat, collision-checked tokenIndex above unchanged.
  const sourcesByPrefix = new Map(loadedSources.map((source) => [source.prefix, source]))

  return { loadedSources, tokenIndex, collisions, sourcesByPrefix }
}

function valueToCss(tokenPath, value, context) {
  if (typeof value === "string") {
    const reference = value.match(/^\{(.+)\}$/)

    if (reference) {
      const qualified = reference[1].match(qualifiedReferencePattern)

      if (qualified) {
        const [, sourcePrefix, remainder] = qualified
        const source = context.sourcesByPrefix.get(sourcePrefix)

        if (!source) {
          throw new Error(
            `Unknown source prefix "${sourcePrefix}" in qualified reference "${value}" ` +
              `in token "${tokenPath}". Known prefixes: ` +
              `${context.loadedSources.map((s) => `"${s.prefix}" (${s.label})`).join(", ")}.`,
          )
        }

        const referencedToken = source.tokens[remainder]

        if (!referencedToken) {
          throw new Error(
            `Unresolved qualified reference "${value}" in token "${tokenPath}": ` +
              `"${remainder}" does not exist in ${source.label}`,
          )
        }

        return `var(${cssName(source.prefix, remainder)})`
      }

      const candidates = context.tokenIndex.get(reference[1])

      if (!candidates) {
        throw new Error(
          `Unresolved reference "${value}" in token "${tokenPath}"`,
        )
      }

      if (candidates.length > 1) {
        const qualifiedOptions = candidates
          .map((c) => `"{${c.prefix}.${reference[1]}}" for ${c.label}`)
          .join(", or ")

        throw new Error(
          `Ambiguous reference "${value}" in token "${tokenPath}": "${reference[1]}" ` +
            `is defined in ${candidates.length} sources ` +
            `(${candidates.map((c) => `${c.label} -> ${c.cssName}`).join(", ")}). ` +
            `The reference syntax does not carry source/layer information, so this ` +
            `cannot be resolved safely. Use a qualified reference instead: ${qualifiedOptions}.`,
        )
      }

      return `var(${candidates[0].cssName})`
    }

    return value
  }

  if (typeof value === "number") {
    return numberToCss(tokenPath, value)
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    if (value.colorSpace || value.hex) {
      return colourToCss(value)
    }
  }

  return JSON.stringify(value)
}

function renderSourceTokens(source, context) {
  const lines = [`  /* ${source.label} */`]

  const sortedEntries = Object.entries(source.tokens).sort(([a], [b]) =>
    a.localeCompare(b),
  )

  for (const [tokenPath, token] of sortedEntries) {
    if (token.$type === "typography") {
      lines.push(...typographyToCss(source.prefix, tokenPath, token.$value))
      continue
    }

    if (token.$type === "shadow") {
      const shadowValue = shadowToCss(token.$value)

      if (shadowValue) {
        lines.push(
          `  ${cssName(source.prefix, tokenPath)}: ${shadowValue};`,
        )
      }

      continue
    }

    const variableName = cssName(source.prefix, tokenPath)
    const variableValue = valueToCss(tokenPath, token.$value, context)

    lines.push(`  ${variableName}: ${variableValue};`)
  }

  lines.push("")

  return lines
}

const lightContext = buildContext(lightSourceDefs, "light")
const darkContext = buildContext(darkSourceDefs, "dark")

const lines = [
  "/*",
  " * Generated from Prism token and style exports.",
  " * Do not edit this file manually.",
  " * Run: npm run tokens:generate",
  " */",
  "",
  ":root {",
]

for (const source of lightContext.loadedSources) {
  lines.push(...renderSourceTokens(source, lightContext))
}

lines.push("}", "")
lines.push(".dark {")

for (const source of darkContext.loadedSources) {
  lines.push(...renderSourceTokens(source, darkContext))
}

lines.push("}", "")

const outputPath = path.join(root, "src/styles/prism-generated.css")

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, lines.join("\n"), "utf8")

console.log(
  `Generated ${path.relative(root, outputPath)} from ` +
    `${lightContext.loadedSources.length + darkContext.loadedSources.length} token files ` +
    `(${lightContext.loadedSources.length} light, ${darkContext.loadedSources.length} dark).`,
)
