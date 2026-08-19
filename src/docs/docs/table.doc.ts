import type { ComponentDoc } from "@/docs/types"

export const tableDoc: ComponentDoc = {
  slug: "table",
  name: "Table",
  status: "stable",
  description:
    "A data table built from Table, TableHeader/Body/Footer/Row/Head/Cell, plus selection, action, sort, empty-state, and caption parts.",
  sourcePath: "src/components/ui/table.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "Compose Table > TableHeader > TableRow > TableHead for the header row, and Table > TableBody > TableRow > TableCell for data rows. Table always wraps its own scroll container — never wrap a second div around it for vertical scroll, since that creates two nested scroll containers and breaks the sticky header. Size the scroll area with `containerClassName` instead (e.g. `min-h-0 flex-1`).",
      exampleId: "table/default",
    },
    {
      id: "density",
      title: "Density",
      body:
        "Three densities, set with `density` on Table: compact, default, comfortable. Density is provided via context (`useTableDensity`) so descendants — including StatusLabel's automatic size resolution — can read it without prop drilling. Row height always comes from --c-table-row-height-*; never set it by hand on TableRow.",
      exampleId: "table/density",
    },
    {
      id: "sortable-header",
      title: "Sortable header",
      body:
        "TableHead's `sortable` prop opts a header into interactive styling and `aria-sort`; it is never inferred from `sortDirection` alone, so a stray undefined direction can't silently make every header look sortable. Pair it with TableSortHeader, which renders the label plus a direction-aware arrow icon (dimmed and revealed on hover when no sort is active).",
      exampleId: "table/sortable-header",
    },
    {
      id: "selection-and-actions",
      title: "Selection and action columns",
      body:
        "TableSelectionHead/Cell and TableActionHead/Cell share a fixed action-column width (--c-table-column-width-action). Action cell content is opacity-0 by default and revealed on row hover, keyboard focus-within, or row selection — this depends on TableRow already carrying the `group` class.",
      exampleId: "table/selection-and-actions",
    },
    {
      id: "empty-state",
      title: "Empty state",
      body:
        "TableEmptyState replaces TableBody entirely, spanning `colSpan` columns with a centred title, optional body copy, and optional primary/secondary actions inside a single-cell row.",
      exampleId: "table/empty-state",
    },
  ],

  props: [
    {
      name: "density",
      type: '"compact" | "default" | "comfortable"',
      defaultValue: '"default"',
      description: "Row height and StatusLabel size resolution for all descendants, via context.",
    },
    {
      name: "containerClassName",
      type: "string",
      description: "Layout-only classes for the table's own scroll container (e.g. `min-h-0 flex-1`). Never wrap a second scrolling div around Table.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the <table> element itself.",
    },
    {
      name: "selected (TableRow)",
      type: "boolean",
      defaultValue: "false",
      description: "Applies the selected-row background and exposes `data-state=\"selected\"` for descendant styling (e.g. always-visible action cells).",
    },
    {
      name: "sortable (TableHead)",
      type: "boolean",
      defaultValue: "false",
      description: "Marks the header as interactive: hover background, aria-sort, pointer cursor. Not inferred from sortDirection.",
    },
    {
      name: "sortDirection (TableHead)",
      type: '"ascending" | "descending" | undefined',
      description: "Current sort direction, reflected in aria-sort when sortable is true.",
    },
    {
      name: "align (TableCell)",
      type: '"left" | "right" | "center"',
      defaultValue: '"left"',
      description: "Text alignment within the cell.",
    },
    {
      name: "direction (TableSortHeader)",
      type: '"ascending" | "descending" | undefined',
      description: "Selects the active sort icon (arrow-up/arrow-down) and its highlighted colour; undefined shows a hover-revealed neutral arrow.",
    },
    {
      name: "colSpan (TableEmptyState)",
      type: "number",
      required: true,
      description: "Number of columns the empty-state cell should span.",
    },
    {
      name: "title (TableEmptyState)",
      type: "string",
      defaultValue: '"No data found"',
      description: "Empty-state heading.",
    },
    {
      name: "body (TableEmptyState)",
      type: "string",
      description: "Optional supporting copy under the title.",
    },
    {
      name: "primaryAction (TableEmptyState)",
      type: "React.ReactNode",
      description: "Primary call to action, typically a Button.",
    },
    {
      name: "secondaryAction (TableEmptyState)",
      type: "React.ReactNode",
      description: "Secondary call to action, rendered before primaryAction.",
    },
  ],

  tokens: [
    "--c-table-cell-background-default",
    "--c-table-cell-background-hover",
    "--c-table-cell-background-selected",
    "--c-table-cell-border-row",
    "--c-table-cell-font-line-height",
    "--c-table-cell-font-size",
    "--c-table-cell-font-weight",
    "--c-table-cell-text-default",
    "--c-table-cell-text-subtlest",
    "--c-table-column-width-action",
    "--c-table-focus-ring-color",
    "--c-table-header-background-default",
    "--c-table-header-background-hover",
    "--c-table-header-border-bottom",
    "--c-table-header-font-line-height",
    "--c-table-header-font-size",
    "--c-table-header-font-weight",
    "--c-table-header-height",
    "--c-table-header-icon",
    "--c-table-header-icon-sort-active",
    "--c-table-header-text",
    "--c-table-pagination-height",
    "--c-table-row-height-comfortable",
    "--c-table-row-height-compact",
    "--c-table-row-height-default",
    "--p-font-line-height-h5",
    "--p-font-line-height-medium",
    "--p-font-size-h5",
    "--p-font-size-medium",
    "--p-font-size-small",
    "--s-color-line-subtle",
    "--s-color-surface-muted",
    "--s-color-text-default",
    "--s-color-text-disabled",
    "--s-color-text-subtlest",
  ],

  guidelines: {
    dos: [
      "Size the scroll region with `containerClassName` on Table itself, never with an extra wrapping div.",
      "Use `sortable` explicitly on every sortable TableHead rather than relying on sortDirection alone.",
      "Read density from `useTableDensity` in any child component that needs to match the table's density, as StatusLabel does.",
      "Use TableEmptyState in place of TableBody, not nested inside it.",
    ],
    donts: [
      "Don't wrap Table in a second vertical-scroll container — border-collapse plus overflow rules will break the sticky header.",
      "Don't set row height directly on TableRow; use the `density` prop on Table.",
      "Don't infer sortability from the presence of `sortDirection` — pass `sortable` explicitly.",
      "Don't hide action-cell content with a different mechanism than opacity + group-hover; TableRow's `group` class and TableActionCell's opacity classes are coupled.",
    ],
  },
}
