import type { ComponentDoc } from "@/docs/types"

// Documents the REAL FilterBar API. Collapses Figma's 5 variants (Empty, One
// Line, Overflow, Show Full, Save as New View) into this single component,
// driven by `chips`, overflow measurement and the presence of `onSaveAsNew`.
// FilterBar composes FilterChip (documented in a separate batch) — no local
// visual overrides on it.
export const filterBarDoc: ComponentDoc = {
  slug: "filter-bar",
  name: "Filter Bar",
  status: "stable",
  description: "The conditional row of active Filter Chips below a Table Title Bar, with automatic overflow and an optional per-chip dropdown.",
  figmaNodeId: "4077:8079",
  sourcePath: "src/components/ui/filter-bar.tsx",

  sections: [
    {
      id: "default",
      title: "Empty",
      body:
        "`chips={[]}` renders \"No filters applied\" plus an Add filter action — Figma's own rule is to hide the Filter Bar completely when no filters are active, so passing an empty array is the page's deliberate choice (e.g. right after the user clicks \"Filter\" in the Table Title Bar), not FilterBar's default state to render everywhere.",
      exampleId: "filter-bar/default",
    },
    {
      id: "one-line",
      title: "One line",
      body: "When all chips fit the available width, FilterBar renders them plus a trailing Modify filter action, with no overflow badge.",
      exampleId: "filter-bar/one-line",
    },
    {
      id: "overflow-with-save",
      title: "Overflow and Save as new",
      body:
        "Overflow is measured against real chip and button widths via a hidden off-screen measurer row plus a ResizeObserver — not a hardcoded chip count. The trailing controls' reserved width always assumes the worst case (Show full filter button included) so the calculation never depends on its own result. `onSaveAsNew` adds the \"Save as new\" action for Figma's \"Save as New View\" variant.",
      exampleId: "filter-bar/overflow-with-save",
    },
    {
      id: "with-chip-panel",
      title: "Chip dropdown panel",
      body:
        "`renderChipPanel` makes FilterBar own the Popover for each chip: open state is `chip.id === openChipId`, anchored with `sideOffset={4}` / `align=\"start\"` to match every other floating surface in the repo. Wire `onChipClick` to toggle `openChipId` only — Radix's Popover `onOpenChange` alone already reports every open and close correctly, so the chip itself carries no separate onClick in this branch.",
      exampleId: "filter-bar/with-chip-panel",
    },
  ],

  props: [
    {
      name: "chips",
      type: "FilterBarChip[]",
      required: true,
      description: "Active filter chips. `FilterBarChip = { id: string; label: string; value?: string; operatorIcon?: PrismIconName; disabled?: boolean }`.",
    },
    {
      name: "openChipId",
      type: "string",
      description: "Id of the chip whose Filter Dropdown Panel is currently open.",
    },
    {
      name: "onChipClick",
      type: "(id: string) => void",
      description: "Called when a chip is clicked. With `renderChipPanel` provided, wire this to toggle `openChipId` only.",
    },
    {
      name: "onModifyFilter",
      type: "() => void",
      description: "Called from the trailing Modify filter action.",
    },
    {
      name: "onAddFilter",
      type: "() => void",
      description: "Called from the Add filter action shown in the empty state.",
    },
    {
      name: "onSaveAsNew",
      type: "() => void",
      description: "When provided, renders the \"Save as new\" action (Figma's \"Save as New View\" variant).",
    },
    {
      name: "renderChipPanel",
      type: "(chipId: string) => React.ReactNode",
      description: "Content for a chip's own Filter Dropdown Panel, keyed by chip id. When omitted, chips are inert buttons that only report clicks via `onChipClick`.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the outer toolbar element.",
    },
  ],

  tokens: [
    "--c-filter-bar-background",
    "--c-filter-bar-content-accent",
    "--c-filter-bar-divider",
    "--c-filter-bar-gap",
    "--c-filter-bar-overflow-padding",
    "--c-filter-bar-padding-horizontal",
    "--c-filter-bar-padding-vertical",
    "--c-filter-chip-background-default",
    "--c-filter-chip-border-default",
    "--c-filter-chip-content-default",
    "--c-filter-chip-font-line-height",
    "--c-filter-chip-font-size",
    "--c-filter-chip-radius",
    "--c-filterchip-height",
    "--p-font-size-xsmall",
    "--p-font-weight-semi-bold",
  ],

  guidelines: {
    dos: [
      "Let the page decide when to render FilterBar at all — hide it completely when no filters are active, per Figma's own rule; only pass `chips={[]}` for the deliberate \"Add filter\" invitation state.",
      "Use `renderChipPanel` to get a real per-chip dropdown; FilterBar then owns anchoring so it can't be wired inconsistently screen to screen.",
      "Let FilterBar's own ResizeObserver-based measurement decide overflow — don't pass a truncated `chips` array to fake the collapsed state.",
    ],
    donts: [
      "Don't add local visual overrides to the FilterChip instances rendered inside FilterBar — all chip styling is delegated to filter/chip/* tokens with no local overrides.",
      "Don't wire both a chip's own onClick and `onChipClick` via `onOpenChange` when using `renderChipPanel` — Radix's Trigger click already fires the child's onClick through `asChild`, so double-wiring toggles `openChipId` twice per click.",
      "Don't hardcode a chip count threshold for when to show the overflow badge; it depends on real measured widths, which change with content and viewport.",
    ],
  },
}
