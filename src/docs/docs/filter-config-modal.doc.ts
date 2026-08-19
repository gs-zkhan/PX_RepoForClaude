import type { ComponentDoc } from "@/docs/types"

// Documents the real FilterConfigModal API ("Configure Filters"). No Figma
// node exists for this modal in U3D8WMBVFl9LvAZyLHhm24 — the design system
// owner authorised building it from a Gainsight CS Cockpit screenshot on the
// Large Modal size (2026-08-06). Every component inside it is approved and
// token-driven, so colours, heights, radii and typography are correct by
// construction; only the Field/Operator/Value column widths are read off the
// screenshot and are NOT Figma-verified — figmaNodeId is intentionally
// omitted rather than guessed.
export const filterConfigModalDoc: ComponentDoc = {
  slug: "filter-config-modal",
  name: "Filter Config Modal",
  status: "stable",
  description:
    "The \"Configure Filters\" modal — add, edit and remove filter criteria and combine them with an advanced boolean expression.",
  sourcePath: "src/components/ui/filter-config-modal.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Opened from a Filter Bar's \"Modify filter\" action (FilterBar exposes `onModifyFilter` with aria-haspopup=\"dialog\"). It does not replace the RHS PxFilterSlider — the two filter surfaces are separate and both stay. Each criterion row is a Field / Operator / Value DropdownField trio, labelled by a Letter tile.",
      exampleId: "filter-config-modal/default",
    },
    {
      id: "multiple-criteria",
      title: "Multiple criteria and advanced logic",
      body:
        "Each row is labelled A, B, C… by position (wrapping to AA, AB… past 26) purely so the row can be referenced in the \"Advanced logic\" text field below the grid, e.g. \"(A and B) or C\". Every row can be deleted, including the last one.",
      exampleId: "filter-config-modal/multiple-criteria",
    },
    {
      id: "empty",
      title: "No criteria",
      body:
        "With zero criteria the modal renders an EmptyState with its own \"Add filter\" primary action instead of the grid. Saving with no criteria is a legitimate action, not an error state — it clears the filter and the calling Filter Bar returns to its own empty \"Add filter\" state.",
      exampleId: "filter-config-modal/empty",
    },
  ],

  props: [
    {
      name: "open",
      type: "boolean",
      required: true,
      description: "Controls modal visibility.",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      required: true,
      description: "Fired when the modal requests to close (backdrop click, Escape, Cancel, the close icon).",
    },
    {
      name: "title",
      type: "string",
      defaultValue: '"Modify filter"',
      description:
        "Header text. The same modal serves both entry points: \"Add filter\" from the bar's empty state and \"Modify filter\" from its populated state.",
    },
    {
      name: "criteria",
      type: "FilterCriterion[]",
      required: true,
      description: "The rows currently configured. Each is `{ id, field, operator, value }`.",
    },
    {
      name: "onCriteriaChange",
      type: "(criteria: FilterCriterion[]) => void",
      required: true,
      description: "Fired whenever a row's field/operator/value changes, or a row is added or removed.",
    },
    {
      name: "advancedLogic",
      type: "string",
      required: true,
      description: 'Boolean expression over the row letters, e.g. "(A and B) or C".',
    },
    {
      name: "onAdvancedLogicChange",
      type: "(value: string) => void",
      required: true,
      description: "Fired on every change to the advanced logic text field.",
    },
    {
      name: "fieldOptions",
      type: "FilterOption[]",
      required: true,
      description: "Options for the Field column. Each is `{ value, label }`.",
    },
    {
      name: "operatorOptions",
      type: "FilterOption[]",
      required: true,
      description: "Options for the Operator column.",
    },
    {
      name: "valueOptions",
      type: "FilterOption[]",
      required: true,
      description:
        "Options for the Value column. Currently one shared list across all rows. Per-field value editors (date / number / picklist / multi-picklist) are already modelled by FilterDropdownPanel's six content types — wire those in here when the product needs per-field value editors, rather than duplicating that logic.",
    },
    {
      name: "onSave",
      type: "() => void",
      required: true,
      description: "Fired when the primary footer action (\"Save\") is pressed.",
    },
  ],

  tokens: [
    "--p-space-100",
    "--p-space-200",
    "--p-space-300",
    "--s-color-text-subtle",
    "--s-icon-color-subtle",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
    "--t-font-label-small-weight",
  ],

  guidelines: {
    dos: [
      "Open this modal only from a Filter Bar's \"Modify filter\" / \"Add filter\" action — it is a companion surface, not a replacement for the RHS PxFilterSlider.",
      "Let a row be deleted even when it's the last one; saving with zero criteria is a legitimate way to clear the filter.",
      "Reference rows by their Letter label in `advancedLogic`, matching the letters actually rendered for the current `criteria` order.",
      "Treat the column widths as screenshot-derived, not Figma-verified — correct them first if a real Figma node for this modal ever appears.",
    ],
    donts: [
      "Don't invent a Figma node id for this modal — none exists in U3D8WMBVFl9LvAZyLHhm24; the build was explicitly screenshot-derived with sign-off.",
      "Don't duplicate FilterDropdownPanel's per-type value editors (date/number/picklist/multi-picklist) locally — wire its content types in through `valueOptions` handling instead.",
      "Don't hardcode row letters — always derive them from position so they stay correct as rows are added or removed.",
    ],
  },
}
