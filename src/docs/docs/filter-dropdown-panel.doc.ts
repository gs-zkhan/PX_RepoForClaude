import type { ComponentDoc } from "@/docs/types"

// Documents the real FilterDropdownPanel API: a discriminated union on `type`
// with six content variants, plus the FilterDropdownPopover wrapper that
// supplies the Popover shell and anchoring. Used inside FilterBar (documented
// separately) as the surface a FilterChip opens — this page covers the panel
// and its content types in isolation.
export const filterDropdownPanelDoc: ComponentDoc = {
  slug: "filter-dropdown-panel",
  name: "Filter Dropdown Panel",
  status: "stable",
  description:
    "Content-only filter editor with six body types (search, value, date, number, picklist, multi-picklist) above a shared Clear / Cancel / Apply footer.",
  figmaNodeId: "4077:8037",
  sourcePath: "src/components/ui/filter-dropdown-panel.tsx",

  sections: [
    {
      id: "default",
      title: "Default — search",
      body:
        "type=\"search\" renders a SearchBar body for a freeform search filter. FilterDropdownPanel has no outer shell (border/background/radius/shadow) — it is meant to render inside a PopoverContent, which supplies the shell. Prefer FilterDropdownPopover over hand-wiring Popover + FilterDropdownPanel; it fixes the anchoring (4px sideOffset, align=\"start\") that prompt-generated screens got wrong before this wrapper existed.",
      exampleId: "filter-dropdown-panel/default",
    },
    {
      id: "value",
      title: "Value",
      body:
        "type=\"value\" renders a labelled TextField body for a single-value text filter.",
      exampleId: "filter-dropdown-panel/value",
    },
    {
      id: "date",
      title: "Date",
      body:
        "type=\"date\" renders a DatePicker body for a single-date filter. For a range with presets, use DateFilter instead — this content type is deliberately single-value only.",
      exampleId: "filter-dropdown-panel/date",
    },
    {
      id: "number",
      title: "Number",
      body:
        "type=\"number\" renders a row of 6 operator chips (equal / not-equal / greater-than / greater-than-or-equal-to / less-than / less-than-or-equal-to) above a numeric input. Only \"equal\" has a dedicated 16px icon asset; the other five render their 24px source at 16px via `sourceSize`.",
      exampleId: "filter-dropdown-panel/number",
    },
    {
      id: "picklist",
      title: "Picklist",
      body:
        "type=\"picklist\" renders a SearchBar over a scrollable single-select option list (max height 280px).",
      exampleId: "filter-dropdown-panel/picklist",
    },
    {
      id: "multi-picklist",
      title: "Multi-picklist",
      body:
        "type=\"multi-picklist\" adds a \"Select all\" checkbox (indeterminate when some but not all options are selected) and a \"n/total Selected\" count above a scrollable multi-select checkbox list.",
      exampleId: "filter-dropdown-panel/multi-picklist",
    },
  ],

  props: [
    {
      name: "type",
      type: '"search" | "value" | "date" | "number" | "picklist" | "multi-picklist"',
      required: true,
      description: "Discriminates which content body renders. Determines which other props are required.",
    },
    {
      name: "value",
      type: 'string (type="search" | "value" | "number") | string | undefined (type="picklist") | Date | undefined (type="date")',
      description: "The current filter value. Shape depends on `type` — see the section for that variant.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void | (date: Date | undefined) => void",
      required: true,
      description: "Fired when the value changes. Signature depends on `type`.",
    },
    {
      name: "label",
      type: "string",
      description: 'TextField label. Only used when type="value".',
    },
    {
      name: "placeholder",
      type: "string",
      description: 'Placeholder text. Used when type="search" | "value" | "date".',
    },
    {
      name: "operator",
      type: "NumberOperator",
      description: 'The active operator chip. Only used when type="number".',
    },
    {
      name: "onOperatorChange",
      type: "(op: NumberOperator) => void",
      description: 'Fired when a different operator chip is clicked. Only used when type="number".',
    },
    {
      name: "options",
      type: "PicklistOption[]",
      description: 'The list to render. Each is `{ value, label, disabled? }`. Used when type="picklist" | "multi-picklist".',
    },
    {
      name: "selected",
      type: "string[]",
      description: 'Selected option values. Only used when type="multi-picklist".',
    },
    {
      name: "onSelectedChange",
      type: "(selected: string[]) => void",
      description: 'Fired when the selection changes. Only used when type="multi-picklist".',
    },
    {
      name: "searchValue",
      type: "string",
      description: 'The picklist search input value. Used when type="picklist" | "multi-picklist".',
    },
    {
      name: "onSearchChange",
      type: "(value: string) => void",
      description: 'Fired on picklist search input change. Used when type="picklist" | "multi-picklist".',
    },
    {
      name: "totalCount",
      type: "number",
      description: 'Denominator shown in "n/total Selected". Defaults to `options.length`. Only used when type="multi-picklist".',
    },
    {
      name: "onClear",
      type: "() => void",
      description: "Fired by the footer's tertiary \"Clear\" action. Present on every content type.",
    },
    {
      name: "onCancel",
      type: "() => void",
      description: "Fired by the footer's secondary \"Cancel\" action. Present on every content type.",
    },
    {
      name: "onApply",
      type: "() => void",
      description: "Fired by the footer's primary \"Apply\" action. Present on every content type.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the panel's outer flex column.",
    },
  ],

  tokens: [
    "--c-filter-dropdown-gap-actions",
    "--c-filter-dropdown-padding-inner",
    "--c-filter-dropdown-padding-outer",
    "--e-shadow-inverse",
    "--p-radius-050",
    "--p-space-050",
    "--p-space-100",
    "--p-space-200",
    "--s-color-action-primary-default",
    "--s-color-line-default",
    "--s-color-surface-default",
    "--s-color-surface-muted",
    "--s-color-surface-selected",
    "--s-color-text-default",
    "--s-color-text-disabled",
    "--s-color-text-subtle",
    "--s-icon-color-default",
    "--t-font-body-medium-line-height",
    "--t-font-body-medium-size",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
  ],

  guidelines: {
    dos: [
      "Reach for FilterDropdownPopover instead of hand-wiring Popover + FilterDropdownPanel — it fixes anchoring (sideOffset 4px, align=\"start\") that was a reported bug when screens wired their own.",
      "Pick the content `type` that matches the field's data type — number fields get the operator-chip row, not a plain TextField.",
      "Keep the panel content-only; render it inside a PopoverContent (or FilterDropdownPopover) rather than giving it its own border/shadow/radius.",
      "Wire real per-field value editors through these six content types rather than duplicating date/number/picklist logic elsewhere (e.g. inside FilterConfigModal's Value column).",
    ],
    donts: [
      "Don't render the panel without a surrounding Popover shell — it has no background or border of its own.",
      "Don't invent a 16px icon for the five non-\"equal\" number operators — the 24px source rendered at 16px via `sourceSize` is the deliberate pattern, matching how other missing intermediate icon sizes are handled.",
      "Don't add a Legend or an outer footer border directly on the panel — the footer's `shadow-inverse` hairline is the only separator, owned by the component.",
    ],
  },
}
