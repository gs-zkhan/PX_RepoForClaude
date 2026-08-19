import type { ComponentDoc } from "@/docs/types"

// Documents the REAL DateFilter API — a distinct component from DatePicker
// and DateField, sharing only the datepicker/* and calendar-panel/* token
// namespaces per the Figma page's own AI instructions ("The two share a
// trigger shell and panel container but serve fundamentally different
// goals"). DateFilter resolves a date RANGE via one of four modes, not a
// single date.
export const dateFilterDoc: ComponentDoc = {
  slug: "date-filter",
  name: "Date Filter",
  status: "stable",
  description: "A 320px range-filter trigger that opens a four-mode panel — Presets, Custom Range, Rolling Window, Fiscal Quarter.",
  figmaNodeId: "1273:12",
  sourcePath: "src/components/ui/date-filter.tsx",

  sections: [
    {
      id: "default",
      title: "Default",
      body:
        "With no props, DateFilter renders a 320px trigger with a calendar icon, placeholder text and a chevron, and opens on the Presets tab. Presets shows an 11-item static list (Today through Last year) next to a range Calendar that highlights the active preset's days.",
      exampleId: "date-filter/default",
    },
    {
      id: "controlled-value",
      title: "Controlled value",
      body:
        "`value` is a discriminated union tagged by `mode` (\"presets\" | \"custom\" | \"rolling\" | \"fiscal\"), each carrying its own resolved `range` plus a display `label` the trigger renders verbatim. `onChange` fires once, when Apply is pressed in whichever tab is active — not on every intermediate selection.",
      exampleId: "date-filter/controlled-value",
    },
    {
      id: "disabled",
      title: "Disabled",
      body: "Set `disabled` to prevent the panel from opening. Applies the shared disabled border/background treatment to the trigger.",
      exampleId: "date-filter/disabled",
    },
  ],

  props: [
    {
      name: "value",
      type: "DateFilterValue | null",
      description: "The applied filter value (controlled) — a union of presets/custom/rolling/fiscal modes, each with a resolved `range` and display `label`.",
    },
    {
      name: "onChange",
      type: "(value: DateFilterValue) => void",
      description: "Called once, when Apply is pressed for the active tab.",
    },
    {
      name: "placeholder",
      type: "string",
      defaultValue: '"Select a date range"',
      description: "Trigger text shown when `value` is unset.",
    },
    {
      name: "disabled",
      type: "boolean",
      defaultValue: "false",
      description: "Disable the trigger and prevent the panel from opening.",
    },
    {
      name: "className",
      type: "string",
      description: "Placement only, applied to the trigger button.",
    },
  ],

  tokens: [
    "--c-datepicker-button-font-line-height",
    "--c-datepicker-button-font-size",
    "--c-datepicker-button-font-weight",
    "--c-datepicker-content-font-line-height",
    "--c-datepicker-content-font-size",
    "--c-datepicker-day-bg-hover",
    "--c-datepicker-divider-color",
    "--c-datepicker-gap-base",
    "--c-datepicker-gap-item",
    "--c-datepicker-gap-trigger",
    "--c-datepicker-icon-color-default",
    "--c-datepicker-icon-color-disabled",
    "--c-datepicker-input-background-default",
    "--c-datepicker-input-background-disabled",
    "--c-datepicker-input-border-default",
    "--c-datepicker-input-border-disabled",
    "--c-datepicker-input-border-focus",
    "--c-datepicker-input-border-hover",
    "--c-datepicker-input-border-width",
    "--c-datepicker-input-content-disabled",
    "--c-datepicker-input-content-placeholder",
    "--c-datepicker-input-content-value",
    "--c-datepicker-input-font-line-height",
    "--c-datepicker-input-font-size",
    "--c-datepicker-input-padding-left",
    "--c-datepicker-input-padding-right",
    "--c-datepicker-input-radius",
    "--c-datepicker-padding-item",
    "--c-datepicker-panel-background",
    "--c-datepicker-panel-border",
    "--c-datepicker-panel-radius",
    "--c-datepicker-preset-item-bg-active",
    "--c-datepicker-preset-item-text-active",
    "--c-datepicker-quarter-background-active",
    "--c-datepicker-quarter-border-active",
    "--c-datepicker-quarter-label-active",
    "--c-datepicker-text-default",
    "--c-datepicker-text-subtlest",
    "--c-textfield-border-default",
    "--c-textfield-height-large",
    "--c-textfield-radius",
    "--e-shadow-500",
    "--p-radius-100",
    "--p-shadow-500",
    "--p-space-050",
    "--p-space-100",
    "--p-space-200",
    "--t-font-label-small-line-height",
    "--t-font-label-small-size",
    "--t-font-label-small-weight",
  ],

  guidelines: {
    dos: [
      "Use DateFilter for a filter control that resolves to a date RANGE across multiple modes — use DatePicker or DateField for a single date.",
      "Read the resolved `range` off `value`, not the display `label` — the label is presentation text only.",
      "Match calendar state to the active preset: when a preset is active, the panel's Calendar should show that preset's full range highlighted, which the component already does by keeping `month` controlled.",
    ],
    donts: [
      "Don't use `--e-shadow-500` for the panel — the verified shadow is the primitive `--p-shadow-500` (0 20px 40px rgba(24,31,38,0.16)), a different, heavier elevation than the semantic alias.",
      "Don't borrow `--c-datepicker-label-font-*` (the calendar weekday-row token) for panel body text — panel copy uses `--c-datepicker-content-font-*` / `font.label.small` depending on context; check the specific row before assuming.",
      "Don't call `onChange` on every intermediate click inside a tab — only Apply should commit a value.",
    ],
  },
}
