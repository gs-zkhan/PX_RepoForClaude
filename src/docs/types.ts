// -----------------------------------------------------------------------------
// Docs site types.
//
// This is the schema for a component's documentation page. It is deliberately
// plain, typed TypeScript rather than MDX so that the whole catalogue stays
// greppable and machine-readable — per the repo goal of being an AI-readable
// source that can generate PX screens without Figma. An agent can read a
// `ComponentDoc` and learn the approved API, variants, tokens and usage rules
// for a component without executing anything.
//
// Examples are NOT stored here as code strings. Each example is a real .tsx
// file under src/docs/examples/<slug>/<exampleId>.tsx which the page both
// renders and displays the source of (via ?raw). One file, one source of
// truth — a snippet can never drift from the component it documents.
// -----------------------------------------------------------------------------

/** Lifecycle badge shown next to the component title. */
export type DocStatus = "stable" | "beta" | "deprecated"

export type DocSection = {
  /** Anchor id — must be unique per page; drives the right-hand TOC. */
  id: string
  title: string
  /** Optional prose shown under the heading. Plain text, no markup. */
  body?: string
  /**
   * Example file to render, relative to src/docs/examples/ and without the
   * extension — e.g. "button/appearance". Omit for prose-only sections.
   */
  exampleId?: string
  /** Nested subsections, rendered as h3 with their own anchors. */
  children?: DocSection[]
}

export type DocProp = {
  name: string
  /** The TypeScript type, written exactly as it appears in the component. */
  type: string
  defaultValue?: string
  required?: boolean
  description: string
}

export type DocGuidelines = {
  dos: string[]
  donts: string[]
}

export type ComponentDoc = {
  /** URL slug, e.g. "button" -> #/components/button */
  slug: string
  name: string
  status: DocStatus
  /** One-line summary shown under the title. */
  description: string
  /** Figma node id in the Prism V1 - ShadCN file, for traceability. */
  figmaNodeId?: string
  /** Path to the implementation, shown as a source link. */
  sourcePath: string
  sections: DocSection[]
  props: DocProp[]
  /**
   * Component tokens this component consumes. Listing them here is what makes
   * the docs useful for token governance — it surfaces at a glance whether a
   * component reaches outside its own namespace.
   */
  tokens?: string[]
  guidelines?: DocGuidelines
}

/** A left-nav grouping. */
export type DocNavGroup = {
  title: string
  items: { slug: string; name: string; status?: DocStatus }[]
}
