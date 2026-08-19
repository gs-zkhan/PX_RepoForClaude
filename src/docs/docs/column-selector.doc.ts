import type { ComponentDoc } from "@/docs/types"

export const columnSelectorDoc: ComponentDoc = {
  slug: "column-selector",
  name: "Column Selector",
  status: "stable",
  description:
    "A popover panel for controlling table column visibility and order, with search, selection and reorder views.",
  figmaNodeId: "1572:8281",
  sourcePath: "src/components/ui/column-selector.tsx",

  sections: [
    {
      id: "default",
      title: "Default (selection view)",
      body:
        "ColumnSelector is content-only — it is meant to be rendered inside a PopoverContent, which supplies the outer border, radius/150 and shadow/500 (the same composition pattern as the PEC Dropdown and Filter Dropdown Panel). The selection view shows a Checkbox per row to toggle column visibility, plus a \"Reset to default\" footer action.",
      exampleId: "column-selector/default",
    },
    {
      id: "order-view",
      title: "Order view",
      body:
        "Set `view=\"order\"` (or let the caller drive it via `onViewChange`) to swap the checkboxes for a drag-handle glyph plus keyboard up/down buttons that call `onReorder(nextOrder)`. Drag-and-drop itself isn't wired up — the drag-handle is only a visual affordance; plug in dnd-kit, react-dnd or native HTML5 DnD as the screen requires. The \"Reset\" footer action is hidden in this view.",
      exampleId: "column-selector/order-view",
    },
  ],

  props: [
    {
      name: "columns",
      type: "ColumnSelectorColumn[]",
      required: true,
      description: "All available columns: { id, label, disabled? }.",
    },
    {
      name: "selected",
      type: "string[]",
      required: true,
      description: "Currently visible column ids.",
    },
    {
      name: "order",
      type: "string[]",
      description: "Display order as an array of column ids. Defaults to columns' own order.",
    },
    {
      name: "view",
      type: '"selection" | "order"',
      defaultValue: '"selection"',
      description: "Active view. See Default and Order view.",
    },
    {
      name: "onViewChange",
      type: "(view: ColumnSelectorView) => void",
      description: "Controls `view` externally. Without it, ColumnSelector manages its own internal view state.",
    },
    {
      name: "onSelectedChange",
      type: "(selected: string[]) => void",
      required: true,
      description: "Called with the next selected-ids array when a checkbox is toggled.",
    },
    {
      name: "onReorder",
      type: "(order: string[]) => void",
      description: "Called with the next order array from a drag or the up/down buttons. Omitting it hides the reorder controls.",
    },
    {
      name: "onReset",
      type: "() => void",
      description: "Called from the \"Reset to default\" footer button. Omitting it hides that button.",
    },
    {
      name: "onCancel",
      type: "() => void",
      description: "Called from the footer Cancel button.",
    },
    {
      name: "onSave",
      type: "() => void",
      description: "Called from the footer Save button.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the panel's outer container.",
    },
  ],

  tokens: [
    "--e-shadow-inverse",
    "--p-radius-050",
    "--p-space-100",
    "--p-space-150",
    "--p-space-200",
    "--s-color-line-default",
    "--s-color-surface-muted",
    "--s-color-surface-sunken",
    "--s-color-text-default",
    "--s-color-text-subtle",
    "--s-icon-color-default",
    "--s-icon-color-disabled",
    "--s-icon-color-subtle",
    "--t-font-body-medium-line-height",
    "--t-font-body-medium-size",
    "--t-font-heading-small-line-height",
    "--t-font-heading-small-size",
    "--t-font-heading-small-weight",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
  ],

  guidelines: {
    dos: [
      "Render ColumnSelector inside a PopoverContent — it supplies no outer shell of its own.",
      "Wire `onReorder` to real drag-and-drop (or leave it to the built-in keyboard up/down buttons) rather than leaving the Order view non-functional.",
      "Use `disabled` on a column that must always stay visible, e.g. a primary key column.",
    ],
    donts: [
      "Don't wrap ColumnSelector in a second bordered/shadowed container — the PopoverContent already owns that visual.",
      "Don't show the Reset action in the Order view; the component hides it there by design.",
      "Don't reorder `columns` directly — always go through `order` and `onReorder` so selection state stays in sync with display order.",
    ],
  },
}
