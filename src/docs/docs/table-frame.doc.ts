import type { ComponentDoc } from "@/docs/types"

// STATUS: Mapped-review-pending. Approved for AI use with disclosure. Not
// yet design-owner visually reviewed as its own item — see
// ai/figma-coverage.json (id component-table-frame). Figma source: Table
// page (node 20:34, "SECTION 4 — TOOLBAR & PAGINATION") and List Page /
// Content Area (node 3302:6, the surface-treatment reference).
export const tableFrameDoc: ComponentDoc = {
  slug: "table-frame",
  name: "TableFrame",
  status: "stable",
  description:
    "Table's own intrinsic anatomy — Toolbar (title bar) → Table → optional Pagination — plus the PX-wide border-vs-shadow surface treatment. Use for any new table instead of hand-rolling a title bar and wrapper.",
  figmaNodeId: "20:34",
  sourcePath: "src/components/ui/table-frame.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "A bare title + count is enough for a small, non-interactive table — omit every RHS slot rather than adding controls that don't apply. TableFrame renders \"Title (N)\" on the left; pass the *filtered* count, per Table's own Dos rule.",
      exampleId: "table-frame/default",
    },
    {
      id: "with-controls",
      title: "With toolbar controls",
      body:
        "search reveals a caller-supplied SearchBar behind an icon toggle (never an always-open input — this matches Figma's own collapsed-icon Toolbar anatomy). filter toggles a caller-supplied filter surface below the toolbar. customization takes <TableCustomizationMenu> — the sanctioned owner of row density + column selection in a Toolbar; TableFrame itself never imports DropdownMenu. actions is for CTAs, rendered right-most.",
      exampleId: "table-frame/with-controls",
    },
    {
      id: "surface",
      title: "Surface treatment",
      body:
        "surface=\"page\" (default) is for a table sitting directly on the product/page background: shadow-100, no visible border. surface=\"nested\" is for a table inside another already-elevated surface (e.g. a Modal): a border, no shadow. Never combine border and shadow on the same TableFrame — see CLAUDE.md's Product Surface Rule.",
    },
    {
      id: "ownership",
      title: "What TableFrame does not own",
      body:
        "TableFrame owns title/count layout, the RHS icon-group chrome, and the surface treatment only. It never owns search query state, filter predicate logic, sort state, or column/density state — those stay in the composing screen or inside whatever component fills a slot.",
    },
  ],

  props: [
    {
      name: "title",
      type: "React.ReactNode",
      required: true,
      description: "Table/list title, e.g. \"Accounts\".",
    },
    {
      name: "count",
      type: "number",
      description: "Appended as \"(N)\" per Table's own Dos rule. Always pass the filtered count, not the total.",
    },
    {
      name: "subtitle",
      type: "React.ReactNode",
      description: "Secondary status text next to the title (e.g. \"3 selected\"), rendered in a subtler tone. Not part of Figma's Toolbar anatomy — a small, generic extension for feature-owned bulk-selection UX.",
    },
    {
      name: "surface",
      type: '"page" | "nested"',
      defaultValue: '"page"',
      description: "Encodes the Product Surface Rule — shadow-only on the page background, border-only when nested in another surface.",
    },
    {
      name: "search",
      type: "{ open: boolean; onToggle: () => void; render: React.ReactNode }",
      description: "Search icon that reveals the caller-supplied render node (a SearchBar) when open.",
    },
    {
      name: "filter",
      type: "{ active: boolean; onToggle: () => void }",
      description: "Filter icon; the caller renders its own filter surface below TableFrame based on `active`.",
    },
    {
      name: "customization",
      type: "React.ReactNode",
      description: "Row density + column selector slot — compose <TableCustomizationMenu>.",
    },
    {
      name: "actions",
      type: "React.ReactNode",
      description: "CTA(s), e.g. <Button>/<SplitButton>. Rendered right-most.",
    },
    {
      name: "children",
      type: "React.ReactNode",
      required: true,
      description: "<Table>… plus an optional <Pagination> below it.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only.",
    },
  ],

  tokens: [
    "--p-radius-150",
    "--p-space-050",
    "--p-space-100",
    "--p-space-200",
    "--s-color-line-default",
    "--s-color-surface-default",
    "--s-color-surface-page",
    "--s-color-text-default",
    "--s-color-text-subtlest",
    "--e-shadow-100",
  ],

  guidelines: {
    dos: [
      "Use TableFrame for any new table instead of hand-rolling a title-bar div and wrapper section.",
      "Pass the filtered row count to `count`, so the title reflects what's actually shown.",
      "Omit RHS slots that don't apply to a small/non-interactive table — the title bar itself is the default, not every control.",
      "Compose <TableCustomizationMenu> for the `customization` slot rather than a bespoke DropdownMenu-based control.",
    ],
    donts: [
      "Don't set both a visible border and a shadow — pick the correct `surface` value instead of hand-tuning classes.",
      "Don't put search query state, filter logic, sort state, or column/density state inside TableFrame itself — it's a layout/chrome-only composition.",
      "Don't import DropdownMenu directly to build a toolbar action menu — reuse TableCustomizationMenu, the sanctioned owner of that composition.",
      "Don't render an always-open SearchBar in the toolbar — start it collapsed behind the search icon.",
    ],
  },
}
